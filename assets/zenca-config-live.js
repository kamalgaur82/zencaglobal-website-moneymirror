/* ==========================================================================
   ZENCA — Money Mirror · LIVE (tight 20-min / 8-question format)
   Separate, self-contained deck. Does NOT touch the delivered v20260919 deck.
   Loaded only by /live/present, /live/vote, /live/results.
   Run-length is a live choice: drop the two "sacrificial" questions for ~15 min.
   ========================================================================== */

window.ZENCA_CONFIG = {

  sync: {
    mode: "supabase",
    supabase: {
      url: "https://etmhdaqxliefuuvyaqxw.supabase.co",
      anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0bWhkYXF4bGllZnV1dnlhcXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NjYzNDgsImV4cCI6MjEwNDM0MjM0OH0.-U_S4joUCQ02BBpF18aGIOQY2eT2T4mxsj0VI3lXe2c"
    }
  },

  /* Distinct label so Live runs are obvious and never mixed with the delivered deck. */
  session: { id: "", label: "Money Mirror — Live (20-min)" },

  audience: {
    url: "mirror.zenca.global/live/vote",
    fullUrl: "https://mirror.zenca.global/live/vote",
    qrImage: ""
  },

  closing: {
    url: "zenca.global",
    fullUrl: "https://zenca.global",
    qrImage: ""
  },

  segments: { holder: "Holds bitcoin", nonholder: "Holds none", unknown: "Didn’t say" },

  /* No scorecard section in the tight format — the split lands inline at the mood question. */
  resultStages: [],

  /* Drop these two for the ~15-min cut (press P to see them on the panel). */
  sacrificial: ["inflation", "runway"],

  /* Per-question vote window (seconds) for the on-screen countdown. Default 12. */

  deck: [

    { type: "title",
      kicker: "A live, anonymous mirror on how this room thinks about money",
      title: ["Money Mirror"],
      presenter: "Kamal Gaur",
      role: "Founder, Zenca" },

    { type: "cards",
      kicker: "Welcome — a little about tonight",
      lead: "I’m Kamal — 21 years in finance, and I stepped away last year to do exactly this.",
      headline: ["This isn’t a talk. It’s a *mirror*."],
      cards: [
        { label: "What we’ll do", text: "For the next 20 minutes, this room answers from your phones — live on the screen." },
        { label: "Anonymous",     text: "No names, no logins, nothing tracked." },
        { label: "So be honest",  text: "It only works if you are — nobody will ever know it was you." }
      ],
      footer: "You’ll see where you stand — and where everyone around you stands." },

    { type: "join" },

    { type: "question",
      id: "warmup",
      depth: "rapid",
      voteSeconds: 20,
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
      commentary: { default: "There’s the room. Hold that picture — it changes how you read everything that follows." } },

    { type: "question",
      id: "singlestock",
      depth: "merged",
      voteSeconds: 15,
      kicker: "The one that changes everything",
      prompt: "Ever bought one stock hoping it would change your life?",
      note: "No judgment — it’s anonymous.",
      options: ["Yes, more than once", "Once", "No", "That’s basically my strategy"],
      commentary: {
        default: "The odds a single stock changes your life sit under 1% — you’d need the pick, the entry, the exit, and the size all right. The hope is the product being sold." } },

    { type: "question",
      id: "networth",
      depth: "merged",
      voteSeconds: 20,
      kicker: "Where you stand",
      prompt: "Do you know your net worth to within 10%?",
      options: ["Yes, to the rupee or dollar", "Roughly", "No idea"],
      commentary: {
        default: "You can’t compound what you can’t measure. The fix is boring and it works: one page a quarter, everything you own minus everything you owe." } },

    { type: "question",
      id: "fee",
      depth: "merged",
      voteSeconds: 25,
      kicker: "The quiet leak — lock in a guess first",
      prompt: "A 1% annual fee. Over 30 years, how much of your final wealth does it eat?",
      note: "Lock a number in your head before you vote.",
      options: ["About 0.1%", "About 1%", "About 9%", "About 17%", "About 26%"],
      answer: 4,
      commentary: {
        default: "It’s about 26%. Not charged once — charged on the compounding, every year. In India that’s regular vs. direct funds, and the switch is free." } },

    { type: "question",
      id: "inflation",
      depth: "merged",
      voteSeconds: 18,
      kicker: "Money",
      prompt: "Your grocery bill is bigger than last year. What actually changed?",
      options: ["The economy grew", "Groceries got more expensive", "Your rupee/dollar is worth less"],
      commentary: {
        default: "The shop didn’t change — the measuring stick did. India’s money supply grew ~15% a year for six decades; the dollar’s, ~7%. Prices are just the downstream signal." } },

    { type: "question",
      id: "allocation",
      depth: "merged",
      voteSeconds: 20,
      kicker: "Your position",
      prompt: "What share of your net worth is in bitcoin?",
      note: "‘None’ is a real answer in this room.",
      options: ["None", "Under 10%", "10–50%", "50–90%", "Nearly all of it"],
      commentary: {
        default: "No correct number — only trade-offs. The risk at the all-in end isn’t being wrong — it’s an emergency forcing you to sell at whatever price that week happens to offer." } },

    { type: "question",
      id: "runway",
      depth: "merged",
      voteSeconds: 30,
      kicker: "Staying in the game",
      prompt: "If your income stopped today, how long could everything you own cover your current lifestyle?",
      note: "monthly spend × 12 = yearly cost\nnet worth ÷ yearly cost = your runway in years",
      options: ["Under 2 years", "2–5 years", "5–10 years", "10–20 years", "Rest of my life"],
      commentary: {
        default: "Runway is time, and time turns money into choices. That last bucket has a name — financial independence." } },

    { type: "question",
      id: "mood",
      depth: "split",
      voteSeconds: 18,
      kicker: "Price and mood",
      prompt: "In the last month, has a price move changed your mood for the worse?",
      note: "Last month only. ‘I don’t look’ is a legitimate answer.",
      options: ["Yes, most days", "A few times", "No", "I don’t look"],
      commentary: {
        default: "A 30% drop is a sale in your favourite store and a crisis in the market — same math, opposite instinct.",
        split: "In most rooms, holders take a price swing calmer than non-holders — usually conviction and time in the asset, not the price." } },

    { type: "question",
      id: "freedom",
      depth: "merged",
      voteSeconds: 18,
      kicker: "If money stopped being the reason",
      prompt: "If you never had to work for money again, what would you do?",
      note: "The first thing that comes to mind.",
      options: ["Rest, travel, and enjoy life", "Give my time to family and people I love", "Build or create something that matters", "Change nothing about my life, including work", "I’ve never let myself think about it"],
      commentary: {
        default: "Everything else — saving, investing, independence — is in service of this one question. Independence isn’t the finish line; it’s the starting line." } },

    { type: "closing",
      headline: ["The goal is not to believe harder.", "It is to see clearer."],
      note: "Everything tonight, anonymised, plus a fee calculator and a FIRE calculator that shows your real number — free on zenca.global. One new piece a week.",
      contact: "Want help thinking about your own money more clearly? The contact form at zenca.global is open." }
  ]
};
