/* ==========================================================================
   ZENCA sync layer
   One interface, two backends.

     local     BroadcastChannel + localStorage. One machine, many tabs.
               For rehearsal. No network, no account, nothing to break.
     supabase  Realtime broadcast for slide state, counter table for votes.
               For the live room.

   Vote storage is counters only: key = "questionId|optionIndex|segment".
   No row is ever written that identifies a person or a single ballot.
   ========================================================================== */

(function () {
  const STATE_KEY = "zenca:state";
  const MAN_KEY   = "zenca:manifests";
  const COUNT_KEY = "zenca:counters";

  function makeLocal() {
    const chan = ("BroadcastChannel" in window) ? new BroadcastChannel("zenca-v2") : null;
    const stateSubs = [], countSubs = [];
    let counters = read(COUNT_KEY) || {};
    let state = read(STATE_KEY) || null;

    function read(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }
    function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

    /* Presence (rehearsal): vote tabs heartbeat over the BroadcastChannel, the
       presenter tab counts the ids it has heard from in the last 5 seconds. */
    let presCb = null, presSid = null, presTrack = false, presTimer = null;
    const presId = (function () { try { return crypto.randomUUID(); } catch (e) { return "u" + Math.random().toString(36).slice(2); } })();
    const presSeen = {};
    function presTick() {
      const now = Date.now();
      Object.keys(presSeen).forEach(id => { if (now - presSeen[id] > 5000) delete presSeen[id]; });
      if (presTrack && chan) chan.postMessage({ kind: "presence", sid: presSid, id: presId, t: now });
      if (presCb) presCb(Object.keys(presSeen).length);
    }
    function presStart() { if (!presTimer) { presTimer = setInterval(presTick, 2000); presTick(); } }

    function receive(msg) {
      if (!msg) return;
      if (msg.kind === "state") { state = msg.payload; stateSubs.forEach(f => f(state)); }
      if (msg.kind === "counters") { counters = msg.payload; countSubs.forEach(f => f(counters)); }
      if (msg.kind === "presence" && msg.sid === presSid && msg.id !== presId) { presSeen[msg.id] = Date.now(); }
    }
    if (chan) chan.onmessage = e => receive(e.data);
    window.addEventListener("storage", e => {
      if (e.key === STATE_KEY) { state = read(STATE_KEY); stateSubs.forEach(f => f(state)); }
      if (e.key === COUNT_KEY) { counters = read(COUNT_KEY) || {}; countSubs.forEach(f => f(counters)); }
    });

    return {
      mode: "local",
      ready: Promise.resolve(),
      status: () => "Rehearsal mode — this machine only",
      needsAuth: false,
      signedIn: () => true,
      user: () => null,
      signIn() { return Promise.resolve(); },
      signInPassword() { return Promise.resolve(); },
      signOut() { return Promise.resolve(); },
      onAuth(cb) { cb(true); },
      room() {},
      trackPresence(s) { presSid = s; presTrack = true; presStart(); },
      watchPresence(s, cb) { presSid = s; presCb = cb; presStart(); },
      publishState(s) { state = s; write(STATE_KEY, s); if (chan) chan.postMessage({ kind: "state", payload: s }); },
      subscribeState(cb) { stateSubs.push(cb); if (state) cb(state); },
      getState() { return state; },
      refreshState() {
        const s2 = read(STATE_KEY);
        if (s2) { state = s2; stateSubs.forEach(f => f(state)); }
        return Promise.resolve(state);
      },
      bump(key) {
        counters = read(COUNT_KEY) || {};
        counters[key] = (counters[key] || 0) + 1;
        write(COUNT_KEY, counters);
        if (chan) chan.postMessage({ kind: "counters", payload: counters });
        countSubs.forEach(f => f(counters));
        return Promise.resolve();
      },
      subscribeCounters(cb) { countSubs.push(cb); cb(counters); },
      getCounters() { return counters; },
      getManifest(sid) {
        const all = read(MAN_KEY) || {};
        return Promise.resolve(all[sid] || null);
      },
      saveManifest(sid, m) {
        const all = read(MAN_KEY) || {};
        all[sid] = m; write(MAN_KEY, all);
        return Promise.resolve();
      },
      listSessions() {
        const all = read(MAN_KEY) || {};
        return Promise.resolve(Object.keys(all).map(sid => ({ sid: sid, manifest: all[sid] })));
      },
      allCounters() { return Promise.resolve(read(COUNT_KEY) || {}); },
      resetSession(sid) {
        counters = read(COUNT_KEY) || {};
        Object.keys(counters).forEach(k => { if (k.split("|")[0] === sid) delete counters[k]; });
        write(COUNT_KEY, counters);
        if (chan) chan.postMessage({ kind: "counters", payload: counters });
        countSubs.forEach(f => f(counters));
      }
    };
  }

  function makeSupabase(cfg) {
    const stateSubs = [], countSubs = [], authSubs = [];
    let counters = {}, state = null, client = null, live = false;
    let sid = null, session = null, roomChan = null;

    const ready = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
      s.onload = () => {
        try {
          client = window.supabase.createClient(cfg.url, cfg.anonKey, {
            realtime: { params: { eventsPerSecond: 20 } }
          });

          client.auth.getSession().then(({ data }) => {
            session = data ? data.session : null;
            authSubs.forEach(f => f(!!session));
          });
          client.auth.onAuthStateChange((_e, s2) => {
            session = s2; authSubs.forEach(f => f(!!session));
          });

          client.from("zenca_counters").select("key,count").limit(20000).then(({ data }) => {
            if (data) { data.forEach(r => { counters[r.key] = r.count; }); countSubs.forEach(f => f(counters)); }
          });

          client.channel("zenca-counters")
            .on("postgres_changes", { event: "*", schema: "public", table: "zenca_counters" }, p => {
              const r = p.new; if (!r) return;
              counters[r.key] = r.count; countSubs.forEach(f => f(counters));
            }).subscribe(s2 => { live = (s2 === "SUBSCRIBED"); });

          resolve();
        } catch (err) { reject(err); }
      };
      s.onerror = () => reject(new Error("Could not load the Supabase client"));
      document.head.appendChild(s);
    });

    /* One row per session. Subscribing to a room listens to that row only, so
       two sessions can run at once without colliding, and an old QR cannot
       wander into a new session. */
    function room(newSid) {
      if (!client || !newSid || newSid === sid) return;
      sid = newSid;
      if (roomChan) { client.removeChannel(roomChan); roomChan = null; }

      client.from("zenca_rooms").select("payload").eq("sid", sid).maybeSingle().then(({ data }) => {
        if (data && data.payload) { state = data.payload; stateSubs.forEach(f => f(state)); }
      });

      roomChan = client.channel("room-" + sid)
        .on("postgres_changes",
            { event: "*", schema: "public", table: "zenca_rooms", filter: "sid=eq." + sid },
            p => { if (p.new && p.new.payload) { state = p.new.payload; stateSubs.forEach(f => f(state)); } })
        .subscribe();
    }

    /* Live "who's here now" via Realtime presence — independent of zenca_bump,
       which the server only allows while a question is open. Phones track
       themselves on a per-session presence channel; the presenter watches the
       count. Works during the idle wait, and drops when a phone leaves. */
    let presChan = null, presSid = null, presCb = null, presTrack = false;
    function presUid() { try { return crypto.randomUUID(); } catch (e) { return "u" + Math.random().toString(36).slice(2); } }
    function ensurePresence(newSid) {
      if (!client || !newSid) return null;
      if (presChan && presSid === newSid) return presChan;
      if (presChan) { client.removeChannel(presChan); presChan = null; }
      presSid = newSid;
      presChan = client.channel("presence-" + newSid, { config: { presence: { key: presUid() } } });
      presChan.on("presence", { event: "sync" }, () => {
        if (!presCb) return;
        const st = presChan.presenceState();
        let n = 0;
        Object.keys(st).forEach(k => { const m = st[k] || []; if (m.some(x => x && x.role === "audience")) n++; });
        presCb(n);
      });
      presChan.subscribe(status => {
        if (status === "SUBSCRIBED" && presTrack) { presChan.track({ role: "audience" }).catch(function () {}); }
      });
      return presChan;
    }

    return {
      mode: "supabase",
      ready,
      status: () => live ? "Live — connected" : "Connecting…",
      needsAuth: true,
      signedIn: () => !!session,
      user: () => session && session.user ? session.user.email : null,
      signIn(email) {
        return client.auth.signInWithOtp({ email: email, options: { emailRedirectTo: location.href } })
          .then(({ error }) => { if (error) throw error; });
      },
      signInPassword(email, password) {
        return client.auth.signInWithPassword({ email: email, password: password })
          .then(({ error }) => { if (error) throw error; });
      },
      signOut() { return client.auth.signOut(); },
      onAuth(cb) { authSubs.push(cb); if (session !== null) cb(!!session); },
      room,
      trackPresence(newSid) { presTrack = true; const ch = ensurePresence(newSid); if (ch && ch.state === "joined") { ch.track({ role: "audience" }).catch(function () {}); } },
      watchPresence(newSid, cb) { presCb = cb; ensurePresence(newSid); },
      publishState(s) {
        state = s; stateSubs.forEach(f => f(state));
        if (client && s && s.sid) {
          client.from("zenca_rooms").upsert({ sid: s.sid, payload: s }).then(({ error }) => {
            if (error) console.warn("state write refused:", error.message);
          });
        }
      },
      subscribeState(cb) { stateSubs.push(cb); if (state) cb(state); },
      getState() { return state; },
      refreshState() {
        if (!client || !sid) return Promise.resolve(null);
        return client.from("zenca_rooms").select("payload").eq("sid", sid).maybeSingle()
          .then(({ data }) => {
            if (data && data.payload) { state = data.payload; stateSubs.forEach(f => f(state)); }
            return state;
          }).catch(() => state);
      },
      bump(key) {
        if (!client) return Promise.reject(new Error("not ready"));
        return client.rpc("zenca_bump", { k: key }).then(({ error }) => { if (error) throw error; });
      },
      subscribeCounters(cb) { countSubs.push(cb); cb(counters); },
      getCounters() { return counters; },
      getManifest(sid) {
        if (!client) return Promise.resolve(null);
        return client.from("zenca_sessions").select("manifest").eq("sid", sid).maybeSingle()
          .then(({ data }) => data ? data.manifest : null).catch(() => null);
      },
      saveManifest(sid, m) {
        if (!client) return Promise.resolve();
        return client.from("zenca_sessions").upsert({ sid: sid, manifest: m }).then(() => {});
      },
      listSessions() {
        if (!client) return Promise.resolve([]);
        return client.from("zenca_sessions").select("sid,manifest,created_at")
          .order("created_at", { ascending: false })
          .then(({ data }) => data || []).catch(() => []);
      },
      allCounters() {
        if (!client) return Promise.resolve({});
        return client.from("zenca_counters").select("key,count").limit(20000)
          .then(({ data }) => { const m = {}; (data || []).forEach(r => { m[r.key] = r.count; }); return m; })
          .catch(() => ({}));
      },
      resetSession(sid) {
        if (!client) return;
        client.rpc("zenca_reset_session", { s: sid }).then(() => {
          Object.keys(counters).forEach(k => { if (k.split("|")[0] === sid) delete counters[k]; });
          countSubs.forEach(f => f(counters));
        });
      }
    };
  }

  window.ZencaSync = function (cfg) {
    return (cfg.mode === "supabase" && cfg.supabase.url) ? makeSupabase(cfg.supabase) : makeLocal();
  };
})();
