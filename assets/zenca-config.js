/* ==========================================================================
   ZENCA — Money Mirror (v3: the full arc, with the story)
   Single source of truth: sync config, deck slides, questions, commentary.
   Edit this file. Do not edit presenter.html / audience.html for content.
   ========================================================================== */

window.ZENCA_CONFIG = {

  /* --- Sync -------------------------------------------------------------
     mode: "local"    → rehearsal. Presenter + audience tabs on ONE machine
                        talk via BroadcastChannel. No backend. Works offline.
     mode: "supabase" → live event. Fill url + anonKey. See README for SQL.
     Rehearse in "local". Switch to "supabase" only after the SQL is applied. */
  sync: {
    mode: "supabase",
    supabase: {
      url: "https://etmhdaqxliefuuvyaqxw.supabase.co",       // https://xxxxxxxx.supabase.co
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bWhkYXF4bGllZnV1dnlhcXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NjYzNDgsImV4cCI6MjEwNDM0MjM0OH0.-U_S4joUCQ02BBpF18aGIOQY2eT2T4mxsj0VI3lXe2c"    // anon public key — safe to ship, RLS restricts writes
    }
  },


  /* --- Session ----------------------------------------------------------
     Every run is recorded under its own session id, so one event never
     overwrites another. Leave id blank to auto-name from the date and time
     (e.g. 2026-09-06-1830). Set it explicitly to name a session yourself:
     id: "bitmela-2026". Start a fresh one any time from the presenter panel. */
  session: { id: "", label: "Money Mirror — v3" },

  /* --- Audience entry point --------------------------------------------- */
  audience: {
    url: "zenca.global/vote",              // shown on the join slide
    fullUrl: "https://zenca.global/vote",  // encoded into the QR
    qrImage: ""                            // optional: path to a pre-made QR png.
                                           // Set this for the live event — most
                                           // reliable. Blank = generate in browser.
  },

  /* --- Closing slide ----------------------------------------------------- */
  closing: {
    url: "zenca.global",
    fullUrl: "https://zenca.global",
    qrImage: ""
  },

  /* --- Segmentation ------------------------------------------------------
     Set by the warm-up question. Every later vote is counted into one of
     these buckets. No individual votes are ever stored — three anonymous
     piles instead of one. */
  segments: { holder: "Holds bitcoin", nonholder: "Holds none", unknown: "Didn’t say" },

  /* --- Result scorecard --------------------------------------------------
     The 18 questions grouped by the five framework stages (slide 15). Each
     group becomes one "honest snapshot" page and one holders/non-holders
     page at the end of the talk. Warm-up is included (its age part). */
  resultStages: [
    { name: "Education",     ids: ["warmup", "networth", "fee", "feeonly"] },
    { name: "Understanding", ids: ["manages", "mood"] },
    { name: "Judgment",      ids: ["risk", "optimise", "allocation", "singlestock", "why"] },
    { name: "Decisions",     ids: ["runway", "insurance", "twofa", "pwmgr", "access"] },
    { name: "Agency",        ids: ["freedom", "enough"] }
  ],

  /* --- Questions you can drop live if running late ------------------------
     Marked on the presenter’s panic panel (press P). Skipping is seamless:
     phones simply never light up for them. */
  sacrificial: ["insurance", "pwmgr", "mood", "singlestock", "enough"],

  /* ======================================================================
     THE DECK
     type: title | quote | statement | cards | steps | compare | layers |
           cycles | chain | list | join | question | report | split | closing
     ====================================================================== */
  deck: [

    { type: "title",
      kicker: "Financial education for long-term financial agency",
      title: ["Money Mirror"],
      presenter: "Kamal Gaur",
      role: "Helping people understand money" },

    { type: "quote",
      lines: ["Fun fact: I got serious about money after 13 years of working.",
              "I just didn’t have a plan — and no idea whether things would turn out fine."],
      sub: "The discomfort of not knowing where I was heading got too high to keep living with." },

    { type: "quote",
      lines: ["So I took ownership of my own financial education.",
              "That *one* decision changed everything."],
      sub: "It carried me to financial independence \u2014 so when life happened, I was ready." },

    { type: "cards",
      kicker: "What I actually do",
      headline: ["I am not a financial advisor.", "I am not here to manage your money."],
      sub: "I use facts, logic, math and AI to make sense of the world, and I teach people to think for themselves.",
      cards: [
        { label: "Observer", text: "Watch what people actually do" },
        { label: "Learner",  text: "Still figuring it out, in public" },
        { label: "Educator", text: "Hand the thinking back to you" }
      ],
      footer: "Helping people understand money" },

    { type: "statement",
      kicker: "What this is",
      headline: ["Money Mirror"],
      sub: "A live quiz we turn on the room. You answer from your phone; the answers appear on the screen. You see where you stand \u2014 and where everyone around you stands.",
      footer: "No login. No names. Only the counts are ever saved." },

    { type: "join" },

    { type: "question",
      id: "warmup",
      depth: "rapid",
      kicker: "Before we start",
      prompt: "Who’s in the room?",
      note: "Anonymous. Two taps, then submit.",
      parts: [
        { id: "age",  prompt: "Your age",
          options: ["18–24", "25–34", "35–44", "45+", "Prefer not to say"] },
        { id: "hold", prompt: "Do you hold any bitcoin?",
          options: ["Yes", "No"],
          segmentMap: ["holder", "nonholder"] }
      ],
      commentary: { default: "That’s the room. Hold that picture — it changes how you read everything that follows." } },

    { type: "question",
      id: "networth",
      depth: "full",
      kicker: "Where we start",
      prompt: "Do you know your net worth to within 10%?",
      options: ["Yes, to the rupee or dollar", "Roughly", "No idea"],
      commentary: {
        default: "Every decision after this one depends on this number. Most of us are managing a portfolio we can’t measure.",
        rules: [
          { opt: 2, min: 30, text: "Nearly a third of this room can’t measure the thing they’re trying to grow. That isn’t carelessness — nobody was ever taught to keep score." },
          { opt: 0, min: 50, text: "Unusually high. This is a self-selected room: people who track a volatile asset tend to track everything else too." }
        ] },
      teach: {
        kicker: "What good looks like",
        headline: "One number, one page, once a quarter.",
        points: [
          { label: "Everything you own", text: "Bank, deposits, equity, funds, gold, property, crypto, EPF." },
          { label: "Minus everything you owe", text: "Loans, cards, anything with interest running on it." },
          { label: "Quarterly, not daily", text: "Daily tracking measures mood. Quarterly measures direction." }
        ],
        footer: "You cannot compound what you cannot see." } },

    { type: "question",
      id: "manages",
      depth: "merged",
      kicker: "Where we start",
      prompt: "Who actually manages your money?",
      options: ["I do", "My spouse or partner", "My parents", "An advisor", "Honestly, no one"],
      commentary: {
        default: "Hold this next to the last slide: most of us say we manage our own money, and most of us can’t state what we have.",
        rules: [
          { opt: 0, min: 55, text: "A room of self-managers — next to a room that mostly can’t state its net worth. Managing and monitoring are not the same job." },
          { opt: 4, min: 15, text: "‘No one’ is the honest answer more often than we admit. Money left unmanaged still makes decisions — the default ones." }
        ] } },

    { type: "cards",
      kicker: "The human layer",
      headline: ["Bitcoin can solve a monetary problem.", "It cannot solve your *behavior*."],
      sub: "A better asset does not automatically create a better investor.",
      cards: [
        { label: "Fear",       text: "Sell the fall" },
        { label: "FOMO",       text: "Buy the rise" },
        { label: "Ego",        text: "Defend old beliefs" },
        { label: "Impatience", text: "Add leverage" }
      ],
      footer: "The protocol has rules. The human needs frameworks." },

    { type: "steps",
      kicker: "The Zenca framework",
      headline: ["From information to agency"],
      steps: [
        { label: "Education",     text: "Build the foundation" },
        { label: "Understanding", text: "See the bigger picture" },
        { label: "Judgment",      text: "Weigh what matters" },
        { label: "Decisions",     text: "Aligned with your goals" },
        { label: "Agency",        text: "Confidence and control" }
      ],
      footer: "Bitcoin knowledge is not the destination. Financial agency is." },

    { type: "statement",
      kicker: "Money",
      headline: ["Inflation is not just prices going up.", "It is your unit of account buying less."],
      figure: { left: "₹100", mid: "buys less", right: "stuff" },
      footer: "Change the lens from the object to the measuring stick." },

    { type: "statement",
      kicker: "First principles",
      headline: ["A room. Five chocolates. More money."],
      figure: { items: ["5 chocolates", "more bidding power",
                        "people pay more for a chocolate", "each monetary unit buys less chocolate"] },
      footer: "More claims on the same scarce goods." },

    { type: "layers",
      kicker: "Three layers",
      headline: ["Inflation is experienced, measured, and created at different layers."],
      rows: [
        { label: "CPI",          mid: "A weighted basket",        right: "How prices show up" },
        { label: "Personal",     mid: "Your basket",              right: "What you actually feel" },
        { label: "Money supply", mid: "System-wide bidding power", right: "Where dilution begins" }
      ],
      footer: "Prices are downstream. Money is upstream." },

    { type: "compare",
      kicker: "The asymmetry",
      headline: ["Making more things makes everyone richer.", "Making more money just splits the same things differently."],
      left:  { label: "More output", text: "More real stuff to go around" },
      right: { label: "More money",  text: "More claims on the same stuff" },
      footer: "These are not the same thing." },

    { type: "question",
      id: "fee",
      depth: "full",
      kicker: "The quiet leak",
      prompt: "A 1% annual fee. Over 30 years, how much of your final wealth does it eat?",
      note: "A guess is fine.",
      options: ["About 0.1%", "About 1%", "About 9%", "About 17%", "About 26%"],
      answer: 4,
      commentary: {
        default: "It’s about 26%. A quarter of the outcome, for a number small enough that nobody negotiates it.",
        rules: [
          { opt: 4, min: 40, text: "This room knows. That’s rare — and it usually means you’ve already been on the wrong end of it once." }
        ] },
      teach: {
        kicker: "Why it’s so much bigger than it sounds",
        headline: ["*1%* is not charged once.", "It is charged on the *compounding*."],
        points: [
          { label: "The fee compounds too", text: "Every rupee taken this year is a rupee that never compounds for the next 29." },
          { label: "Where it hides in India", text: "Regular mutual fund plans carry a distributor commission. Direct plans of the same fund don’t." },
          { label: "The switch is free", text: "Same fund, same manager, same portfolio. Different expense ratio." }
        ],
        footer: "The fee is not the cost. The compounding you never see is the cost." } },

    { type: "question",
      id: "feeonly",
      depth: "merged",
      kicker: "The quiet leak",
      prompt: "Did you know advisors exist who charge a flat fee and earn nothing on what you buy?",
      options: ["Yes, I use one", "Yes, never used one", "No, didn’t know"],
      commentary: {
        default: "Fee-only advice removes one incentive: the person telling you what to buy no longer earns more when you buy more.",
        rules: [
          { opt: 2, min: 40, text: "Most of the room didn’t know the category exists. That’s not an accident — nobody funds advertising for a model that pays no commission." }
        ] } },

    { type: "quote",
      lines: ["*Price* is simply the latest agreement.", "It is not the same thing as *value*."],
      sub: "Markets move on behavior long before fundamentals move." },

    { type: "cards",
      kicker: "Price shouts, value whispers",
      headline: ["Bitcoin’s price is one number.", "Its value is four slower ones."],
      cards: [
        { label: "Scarcity",  text: "Capped at 21 million, forever" },
        { label: "Access",    text: "Anyone, anywhere, no permission" },
        { label: "Security",  text: "Held up by a global network" },
        { label: "Rules",     text: "Fixed, transparent, verifiable by all" }
      ],
      footer: "Value moves on slower clocks." },

    { type: "compare",
      kicker: "Psychological inversion",
      headline: ["Same direction. Opposite instinct."],
      left:  { label: "A store, −30%", text: "Sale. Buy." },
      right: { label: "A market, −30%", text: "Danger. Sell." },
      footer: "The discount you welcome and the discount you flee are the same arithmetic." },

    { type: "question",
      id: "mood",
      depth: "merged",
      kicker: "Price and mood",
      prompt: "In the last month, has a price move changed your mood for the worse?",
      options: ["Yes, most days", "A few times", "No", "I don\u2019t look"],
      commentary: {
        default: "Prices move moods, moods move actions, and actions are what actually decide your returns.",
        rules: [
          { opt: 0, min: 30, text: "Daily is worth noticing \u2014 not because feeling it is wrong, but because that is the channel through which a chart reaches your portfolio." },
          { opt: 3, min: 25, text: "\u201cI don\u2019t look\u201d is a strategy, not an admission. It is the cheapest emotional risk control available." }
        ] } },

    { type: "statement",
      kicker: "Uncertainty",
      headline: ["You cannot demand all three."],
      figure: { left: "High returns", mid: "Short time", right: "Low risk" },
      footer: "Certainty is the thing that has to give." },

    { type: "question",
      id: "risk",
      depth: "full",
      kicker: "What are you actually risking",
      prompt: "What does \u201crisk\u201d mean to you?",
      options: ["Prices falling", "How much it swings day to day", "Losing money permanently", "Not reaching my goal in time"],
      answer: 2,
      commentary: {
        default: "Volatility and risk got welded together somewhere, and a great many bad decisions follow from the confusion.",
        rules: [
          { opt: 1, min: 30, text: "Most of us were taught to call volatility risk. But volatility reverses on its own. Permanent impairment does not." },
          { opt: 2, min: 45, text: "This room separates the two. That single distinction explains most of what follows." }
        ] },
      teach: {
        kicker: "The distinction that changes everything",
        headline: "Risk is the permanent impairment of capital. Everything else is weather.",
        points: [
          { label: "Volatility", text: "The price moved. Painful, temporary, and only made real if you sell into it." },
          { label: "Impairment", text: "The money is not coming back. A failed company, a liquidation, a scam." },
          { label: "Why it matters", text: "Avoiding volatility usually means avoiding returns. Avoiding impairment is what keeps you in the game." }
        ],
        footer: "You can survive a great deal of volatility. You cannot survive impairment." } },

    { type: "question",
      id: "optimise",
      depth: "full",
      kicker: "What are you optimising for",
      prompt: "What are you actually optimising for?",
      note: "Only one. The one you would defend if the others suffered.",
      options: ["The highest return", "Hitting a number by a date", "The lowest risk", "The highest chance of getting there"],
      answer: 3,
      commentary: {
        default: "Return, time and safety are the three we can name. Probability of success is the one that actually compounds.",
        rules: [
          { opt: 1, min: 30, text: "A number by a date is the most dangerous target in personal finance. The deadline does the choosing, and it always chooses more risk." },
          { opt: 0, min: 35, text: "Maximum return is the answer that feels ambitious and quietly lowers the odds of arriving at all." }
        ] },
      teach: {
        kicker: "Optimising for arrival",
        headline: "Relax time, and almost every other decision gets easier.",
        points: [
          { label: "A date forces risk", text: "Fix the deadline and the only lever left is how much you gamble to meet it." },
          { label: "Odds improve with patience", text: "The longer you can stay in, the higher your probability of success climbs \u2014 without doing anything cleverer." },
          { label: "Allocation is the real lever", text: "Limit the downside that ends the game; keep the upside that only arrives if you are still playing." }
        ],
        footer: "The highest chance of getting there is not the modest goal. It is the winning one." } },

    { type: "compare",
      kicker: "A different objective",
      headline: ["Optimise for probability of success, not maximum return."],
      left:  { label: "Max return",  text: "How fast can I get there?" },
      right: { label: "Probability", text: "How likely am I to stay in the game?" },
      footer: "Survival compounds." },

    { type: "question",
      id: "runway",
      depth: "full",
      kicker: "Staying in the game",
      prompt: "If your income stopped today, how long could everything you own cover your current lifestyle?",
      note: "Count everything — savings, investments, the lot. At today’s prices.",
      options: ["Under 6 months", "6–12 months", "1–3 years", "3–5 years", "More than 5 years"],
      commentary: {
        default: "Runway is time. The more of it you have, the fewer decisions get made for you — by a market, a boss, or a bad year.",
        rules: [
          { opt: 0, min: 30, text: "Under six months for a large part of the room. One shock and the choices stop being yours." },
          { opt: 4, min: 20, text: "More than five years without income is a genuine choice most people don’t realise they already hold — this is what financial independence starts to look like." }
        ] },
      teach: {
        kicker: "What runway really buys",
        headline: ["Runway is *time*.", "And time is what turns money into *choices*."],
        points: [
          { label: "Measured in time, not rupees", text: "Months and years of your real spending — the only unit that answers the question." },
          { label: "It removes the forced hand", text: "The longer your runway, the fewer decisions a market or a bad year gets to make for you." },
          { label: "The first taste of freedom", text: "Enough runway, and work becomes a choice — which is exactly what the last questions are about." }
        ],
        footer: "The longer you can last, the freer every other decision becomes." } },

    { type: "question",
      id: "insurance",
      depth: "rapid",
      kicker: "Staying in the game",
      prompt: "Do you have health cover beyond what an employer gives you?",
      options: ["Yes", "Only my employer’s", "None"],
      commentary: {
        default: "One hospitalisation is the most common reason a long-term portfolio gets liquidated at the worst possible moment.",
        rules: [
          { opt: 1, min: 35, text: "Employer cover ends the day the job does — usually the same day you can least afford to replace it." }
        ] } },

    { type: "cards",
      kicker: "Asymmetry",
      headline: ["A good bet can fail. A bad bet can win."],
      cards: [
        { label: "Small downside", text: "Survivable" },
        { label: "Large upside",   text: "Meaningful" },
        { label: "No guarantee",   text: "Still uncertain" }
      ],
      footer: "The goal is not to be certain. It is to structure uncertainty." },

    { type: "question",
      id: "allocation",
      depth: "full",
      kicker: "Your position",
      prompt: "What share of your net worth is in bitcoin or crypto?",
      options: ["None", "Under 10%", "10–50%", "50–90%", "Nearly all of it"],
      commentary: {
        default: "There is no correct answer on this slide. There are only trade-offs — and they’re different at each end.",
        rules: [
          { opt: 4, min: 20, text: "A meaningful group is all-in. That is a position with a very specific requirement: you must never be forced to sell." },
          { opt: 0, min: 20, text: "A real share of this hall holds none. Worth noticing — the money questions in this room are not Bitcoin questions." }
        ] },
      teach: {
        kicker: "What each end optimises for",
        headline: ["Concentration is not wrong.", "*Unexamined* concentration is."],
        points: [
          { label: "A large share buys", text: "Maximum exposure — if you turn out to be right." },
          { label: "A large share costs", text: "Every emergency becomes a forced sale, at whatever price that week offers." },
          { label: "A small share buys",  text: "Optionality and sleep, for a smaller slice of the upside." }
        ],
        footer: "Ask what your allocation requires of you, not what it might return." } },

    { type: "question",
      id: "singlestock",
      depth: "merged",
      kicker: "The one that changes everything",
      prompt: "Have you ever bought one stock hoping it would change your life?",
      options: ["Yes, more than once", "Once", "No", "That is basically my strategy"],
      commentary: {
        default: "The odds that a single stock makes you wealthy sit under one percent. The odds it feels like it might are close to certain.",
        rules: [
          { opt: 0, min: 35, text: "More than once is the honest answer for most people who have been at this a while. The hope is the product being sold." }
        ] } },

    { type: "quote",
      lines: ["Most financial mistakes are not caused by greed.",
              "They are caused by the desire to *compress time*."],
      sub: "Speed quietly turns reasonable goals into unreasonable risk." },

    { type: "compare",
      kicker: "The leverage trap",
      headline: ["Time is not the enemy of wealth.", "Time is the *_mechanism_*."],
      left:  { label: "Leverage",    text: "Tries to pull the future toward you" },
      right: { label: "Compounding", text: "Lets you travel toward it" },
      footer: "One of these has a liquidation price." },

    { type: "cycles",
      kicker: "Cycles",
      headline: ["Attention arrives after opportunity."],
      stages: [
        { label: "Bear",       text: "Low attention · positioning" },
        { label: "Early bull", text: "Liquidity expands · price moves" },
        { label: "Late bull",  text: "Attention spikes · FOMO" },
        { label: "Reset",      text: "Narrative breaks · interest leaves" }
      ],
      footer: "By the time it feels important, it is often already expensive." },

    { type: "chain",
      kicker: "Information",
      headline: ["Financial information has a half-life."],
      links: [
        { label: "Source",        text: "Where the edge is real" },
        { label: "Professionals", text: "Act on it first" },
        { label: "Media",         text: "Turn it into a story" },
        { label: "Social",        text: "Repeat it for validation" },
        { label: "You",           text: "It reaches you last, as “news”" }
      ],
      footer: "New to you is not the same as new to the market." },

    { type: "question",
      id: "why",
      depth: "full",
      kicker: "Your portfolio",
      prompt: "Think of your largest holding. Why do you own it?",
      options: ["I researched it myself", "Someone I know suggested it", "An advisor or influencer said so", "Honestly, I don’t fully remember"],
      commentary: {
        default: "Most portfolios aren’t decisions. They’re sediment — layers of old tips nobody has revisited.",
        rules: [
          { opt: 0, min: 60, text: "Self-research dominates. Worth testing that answer: could you still state the reason out loud, in one sentence, today?" },
          { opt: 3, min: 20, text: "‘I don’t fully remember’ is the most useful answer here. A holding you can’t justify is a holding you can’t rationally sell either." }
        ] },
      teach: {
        kicker: "The test that costs nothing",
        headline: ["If you can’t say *why* you own it,", "you can’t say *when* to sell it."],
        points: [
          { label: "Write one line per holding", text: "The reason you bought it, and what would make you exit." },
          { label: "Date the line",  text: "A reason from 2021 may have expired without telling you." },
          { label: "Notice the silent ones", text: "Anything you can’t explain is a candidate for review, not automatically a sale." }
        ],
        footer: "This is the cheapest audit in personal finance." } },

    { type: "compare",
      kicker: "Beliefs",
      headline: ["Math is math. Until money threatens the ego."],
      left:  { label: "Identity", text: "Defend the old model" },
      right: { label: "Evidence", text: "Update to a better model" },
      flow: true,
      footer: "Conviction should be strong enough to act, and weak enough to update." },

    { type: "question",
      id: "twofa",
      depth: "merged",
      kicker: "The keys to everything",
      prompt: "What protects your exchange and broker accounts?",
      options: ["App-based 2FA", "SMS codes only", "Password only", "Not sure"],
      answer: 0,
      commentary: {
        default: "SMS is the weakest of these — and the one most people believe is fine.",
        rules: [
          { opt: 1, min: 30, text: "SMS-only is the answer worth changing tonight. A SIM swap doesn’t need your password, and it doesn’t need your permission." },
          { opt: 3, min: 20, text: "‘Not sure’ is worth checking before you leave this hall. It takes ninety seconds per account." }
        ] } },

    { type: "question",
      id: "pwmgr",
      depth: "rapid",
      kicker: "The keys to everything",
      prompt: "Do you use a password manager?",
      options: ["Yes, for everything", "For some things", "The browser remembers them", "No"],
      commentary: {
        default: "Every financial account you own sits behind this one habit.",
        rules: [
          { opt: 2, min: 25, text: "Browser-saved passwords feel like a manager and aren’t one — same convenience, none of the isolation." }
        ] } },

    { type: "list",
      kicker: "Self-sovereignty",
      headline: ["Before you learn Bitcoin, learn yourself."],
      items: [
        "What do you fear losing?",
        "How much volatility can you actually tolerate?",
        "What would make you sell?",
        "Can you hold your own keys responsibly?",
        "Who can recover them if you cannot?"
      ] },

    { type: "question",
      id: "access",
      depth: "full",
      kicker: "The last question",
      prompt: "If something happened to you tomorrow, could anyone reach your money?",
      note: "All of it — accounts, investments, deposits, keys.",
      options: ["Yes, it’s documented", "Partly", "No one could", "I’ve never thought about it"],
      commentary: {
        default: "This is the question with the widest gap between how simple it is and how few of us have done it.",
        rules: [
          { opt: 2, min: 35, text: "For most of this room, a portfolio built over a decade would end at a password nobody else has." },
          { opt: 0, min: 40, text: "Higher than almost any room I’d expect. Self-custody forces the question earlier than a bank ever does." }
        ] },
      teach: {
        kicker: "What to actually do",
        headline: ["A nominee can claim your bank accounts.", "No one can claim your keys."],
        points: [
          { label: "Nomination is not inheritance", text: "A nominee receives custody, not ownership. A will decides ownership." },
          { label: "List the accounts, not the passwords", text: "Someone should know what exists and where, even if they can’t open it yet." },
          { label: "Self-custody has no helpline", text: "For keys, a recovery plan is the entire estate plan. Decide who, and how, while you can." }
        ],
        footer: "Sovereignty that ends with you is only half of it." } },

    { type: "question",
      id: "freedom",
      depth: "merged",
      kicker: "If money stopped being the reason",
      prompt: "If you never had to work for money again, what would you do?",
      options: ["Stop working entirely", "Keep working, on my own terms", "Keep doing what I do now", "I have never let myself think about it"],
      commentary: {
        default: "Everything else \u2014 saving, investing, independence \u2014 is in service of this one question.\nIndependence isn\u2019t the finish line; it\u2019s what finally lets you ask it.",
        rules: [
          { opt: 3, min: 30, text: "Never having thought about it is the most common answer and the most revealing. We optimise hard toward a finish line we have never described." }
        ] } },

    { type: "question",
      id: "enough",
      depth: "rapid",
      kicker: "If money stopped being the reason",
      prompt: "When is it enough — enough to stop working?",
      options: ["At my number", "My number, plus a buffer", "No amount would make me stop", "I have never worked out my number"],
      commentary: {
        default: "A number you can’t name, you can never reach.\nA number with no ceiling means you never stop — the investing is just working forever, because ‘enough’ keeps moving.",
        rules: [
          { opt: 2, min: 30, text: "Worth sitting with. If no amount would make you stop, the plan is to work forever \u2014 which is fine, as long as it is a choice and not a default." }
        ] } },

    { type: "steps",
      kicker: "The full stack",
      headline: ["Understanding Bitcoin is a sequence, not a pitch."],
      steps: [
        { label: "Money",    text: "What is the unit?" },
        { label: "Markets",  text: "What is price?" },
        { label: "Behavior", text: "How do I react?" },
        { label: "Bitcoin",  text: "What are the rules?" },
        { label: "Custody",  text: "Who controls it?" }
      ],
      footer: "Skip a layer and the missing understanding usually returns as fear." },

    { type: "quote",
      lines: ["You don’t need better predictions.", "You need better *frameworks*."],
      sub: "Predictions tell you what might happen. Frameworks tell you what to do when you are wrong." },

    { type: "list",
      kicker: "A practical test",
      headline: ["Five questions before your next decision."],
      items: [
        "Am I reacting to price, or to a change in value?",
        "Am I optimising for return, or for survival?",
        "Am I trying to compress time?",
        "Is this information new, or merely new to me?",
        "Does this increase my agency, or my dependence?"
      ] },

    { type: "report", group: 0 },
    { type: "report", group: 1 },
    { type: "report", group: 2 },
    { type: "report", group: 3 },
    { type: "report", group: 4 },

    { type: "split", group: 0 },
    { type: "split", group: 1 },
    { type: "split", group: 2 },
    { type: "split", group: 3 },
    { type: "split", group: 4 },

    { type: "cards",
      kicker: "Things to play with",
      headline: ["Tools, not answers."],
      sub: "Change the inputs until it is your situation, not a worked example. Then see what it tells you. Both free on zenca.global.",
      cards: [
        { label: "Inflation Reframed", text: "What your unit of account is doing" },
        { label: "Price of Advice",    text: "What a fee costs across a lifetime" }
      ],
      footer: "Understand money. Understand yourself. Then decide what Bitcoin means in your life." },

    { type: "quote",
      lines: ["When information becomes infinite,", "*_curation_* becomes the product."],
      sub: "Welcome to Zenca — much of this is on the Substack already, with a great deal more to come." },

    { type: "closing",
      headline: ["The goal is not to believe harder.", "It is to see clearer."],
      note: "Every subscription is a vote for thinking more clearly about money." }
  ]
};
