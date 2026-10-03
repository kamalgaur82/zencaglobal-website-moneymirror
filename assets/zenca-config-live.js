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
  sacrificial: ["inflation", "firenumber", "runway"],

  /* Per-question vote window (seconds) for the on-screen countdown. Default 12. */

  deck: [

    { type: "title",
      kicker: "A live, anonymous poll on how this room thinks",
      title: ["Money Mirror"],
      presenter: "Kamal Gaur",
      role: "Founder\nZenca" },

    { type: "cards",
      kicker: "Who’s talking",
      headline: ["A little about me, and *Zenca*."],
      cards: [
        { label: "Me",    text: "21 years · Strategy & Analytics · India Inc" },
        { label: "Zenca", text: "Education · Personal finance lens" },
        { label: "Why",   text: "Financial independence — for everyone" }
      ],
      tagline: "Financial education for long-term financial agency" },

    { type: "journey",
      kicker: "The Zenca Framework",
      headline: ["From education to agency"],
      now: 1,
      steps: [
        { lab: "Education",     text: "Build the\nfoundation" },
        { lab: "Understanding", text: "See the bigger\npicture" },
        { lab: "Judgment",      text: "Weigh what\nmatters" },
        { lab: "Decisions",     text: "Aligned with\nyour goals" },
        { lab: "Agency",        text: "Confidence\nand control" }
      ],
      footer: "Knowledge is not the destination. Agency is." },

    { type: "triptych",
      kicker: "Before you decide",
      headline: ["Stop guessing. Start understanding."],
      sub: "Understand — across three dimensions",
      boxes: [
        { letter: "U", verb: "Understand", dim: "Money",     subs: "Value · Inflation · Compounding" },
        { letter: "U", verb: "Understand", dim: "The World", subs: "Systems · Incentives · Markets" },
        { letter: "U", verb: "Understand", dim: "Yourself",  subs: "Goals · Constraints · Temperament" }
      ],
      footer: "Today, we hold the mirror to all three." },

    { type: "cards",
      kicker: "How this works",
      headline: ["10 questions. Live. *Anonymous*."],
      cards: [
        { label: "You vote",  text: "Your phone · one at a time" },
        { label: "We reveal", text: "On screen · you + the room" },
        { label: "Anonymous", text: "No names · no emails · just votes" }
      ],
      footer: "Be honest — the more honest the room, the sharper the mirror." },

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
      prompt: "Ever bought *one stock* hoping it would change your life?",
      note: "No judgment — it’s anonymous.",
      options: ["No", "Once", "Yes, more than once", "That’s basically my strategy"],
      commentary: {
        default: "The odds a single stock changes your life sit *under 1%*\n— you’d need the *pick*, the *entry*, the *exit*, and the *sizing* all right.\nThe hope is *the product being sold*." } },

    { type: "question",
      id: "networth",
      depth: "merged",
      voteSeconds: 20,
      kicker: "Where you stand",
      prompt: "Do you know your *net worth* to within 10%?",
      note: "A number from the last 6 months counts.",
      options: ["Yes, to the rupee, dollar, or sat", "Roughly", "No idea"],
      commentary: {
        default: "You can’t *compound* what you can’t *measure*.\nThe fix is boring, and it works —\n*1* page, once a *quarter*, with everything you *own* minus everything you *owe*." } },

    { type: "question",
      id: "fee",
      depth: "merged",
      voteSeconds: 25,
      kicker: "The quiet leak — lock in a guess first",
      prompt: "A *1% annual fee*. Over 30 years, how much of your final wealth does it eat?",
      note: "Lock a number in your head before you vote.",
      options: ["~0.03%", "~1%", "~9%", "~17%", "~26%"],
      answer: 4,
      commentary: {
        default: "1% is charged on the compounding, every year — not charged only once.\nIn India, that’s the difference between Regular and Direct mutual funds — and the switch is free." } },

    { type: "question",
      id: "inflation",
      depth: "merged",
      voteSeconds: 18,
      kicker: "Money",
      prompt: "Your grocery bill is bigger than last year. What *actually changed*?",
      options: ["The economy grew", "Groceries got more expensive", "Your rupee/dollar is worth less"],
      commentary: {
        default: "The shop didn’t change — the measuring stick did. Prices are just the downstream signal." } },

    { type: "question",
      id: "allocation",
      depth: "merged",
      voteSeconds: 20,
      kicker: "Your position",
      prompt: "What share of your net worth is in *bitcoin*?",
      note: "‘None’ is a real answer in this room.",
      options: ["None", "Under 10%", "10–50%", "50–90%", "Nearly all of it"],
      commentary: {
        default: "There is no correct number — *only trade-offs*.\nThe *risk* at the all-in end isn’t being wrong —\n— it’s an emergency *forcing you to sell* at a price you don’t want to sell at." } },

    { type: "question",
      id: "runway",
      depth: "merged",
      voteSeconds: 30,
      kicker: "Staying in the game",
      prompt: "If your income stopped today, *how long* could everything you own cover your current lifestyle?",
      note: "Monthly expenses × 12 = Annual cost of living\nNet worth ÷ Annual cost of living = Your runway in years",
      options: ["Under 2 years", "2–5 years", "5–10 years", "10–20 years", "Rest of my life"],
      commentary: {
        default: "Runway is *time*, and time turns money into *choices*. That last bucket has a name — *financial independence*." } },

    { type: "question",
      id: "firenumber",
      depth: "merged",
      voteSeconds: 18,
      kicker: "Your number",
      prompt: "Your retirement number rides on five things. Which would you *struggle most* to put a real figure on?",
      options: ["How long you’ll live", "Your returns after you stop working", "Your monthly spending", "How fast your costs rise", "Your age today"],
      icons: ["hourglass", "upGreen", "cash", "upRed", "face"],
      commentary: {
        default: "Your retirement number isn’t one figure to calculate — it’s a handful of moving parts to manage. That’s why a number you ‘heard’ is answering someone else’s question, not yours." } },

    { type: "question",
      id: "mood",
      depth: "split",
      voteSeconds: 18,
      kicker: "Price and mood",
      prompt: "In the last month, has a price move changed your *mood for the worse*?",
      note: "Last month only. ‘I don’t look’ is a legitimate answer.",
      options: ["Yes, most days", "A few times", "I don’t look", "No"],
      commentary: {
        default: "A price move only costs you when it reaches your decisions —\n— mood tips action, and action sets your return.\nA genuine ‘No’ is the North Star —\n— and ‘I don’t look’ is an easier shortcut to the same calm.",
        split: "In most rooms, Bitcoin holders are calmer than non-holders when it comes to price swings." } },

    { type: "question",
      id: "freedom",
      depth: "merged",
      voteSeconds: 18,
      kicker: "If money stopped being the reason",
      prompt: "If you never had to *work for money* again, what would you do?",
      note: "The first thing that comes to mind.",
      options: ["Rest, travel, and enjoy life", "Give my time to family and people I love", "Build or create something that matters", "Change nothing about my life, including work", "I’ve never let myself think about it"],
      commentary: {
        default: "*Everything else* — saving, investing, waiting — is in service of this *one question*.\n*Independence* isn’t the finish line; it’s the *starting line*." } },

    { type: "closing",
      headline: ["The goal is not to believe harder.", "It is to see clearer."],
      note: "Find Money Mirror results, apart from FIRE and Fee calculators, for free on Zenca.Global.\nNew articles go out every week.",
      contact: "Reach me through the Contact form if you’d like me to help you think about money more clearly." }
  ]
};
