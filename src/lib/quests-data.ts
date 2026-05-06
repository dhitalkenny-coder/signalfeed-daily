export type Category =
  | "Current Affairs"
  | "Art & Culture"
  | "AI & Technology"
  | "Money"
  | "Business"
  | "Health & Wellness"
  | "Beauty & Lifestyle"
  | "Creativity"
  | "Cooking"
  | "Philosophy & Spirituality"
  | "Productivity"
  | "Confidence";

import {
  Newspaper,
  Palette,
  Cpu,
  Wallet,
  Briefcase,
  HeartPulse,
  Sparkles as SparklesIcon,
  PenTool,
  Utensils,
  BookOpen,
  Zap,
  Flame,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_META: Record<
  Category,
  { Icon: LucideIcon; blurb: string; tone: string }
> = {
  "Current Affairs": { Icon: Newspaper, blurb: "Stay informed without the noise", tone: "text-slate-300" },
  "Art & Culture": { Icon: Palette, blurb: "Sharpen taste and perspective", tone: "text-rose-300" },
  "AI & Technology": { Icon: Cpu, blurb: "Use the tools shaping the future", tone: "text-cyan-300" },
  "Money": { Icon: Wallet, blurb: "Build smarter habits with money", tone: "text-emerald-300" },
  "Business": { Icon: Briefcase, blurb: "Think like an operator", tone: "text-amber-300" },
  "Health & Wellness": { Icon: HeartPulse, blurb: "Move, sleep, eat better", tone: "text-green-300" },
  "Beauty & Lifestyle": { Icon: SparklesIcon, blurb: "Small upgrades, big difference", tone: "text-pink-200" },
  "Creativity": { Icon: PenTool, blurb: "Make more, judge less", tone: "text-purple-300" },
  "Cooking": { Icon: Utensils, blurb: "Cook things you'd pay for", tone: "text-orange-300" },
  "Philosophy & Spirituality": { Icon: BookOpen, blurb: "Think clearly, live deeper", tone: "text-indigo-300" },
  "Productivity": { Icon: Zap, blurb: "Get focused, finish things", tone: "text-sky-300" },
  "Confidence": { Icon: Flame, blurb: "Show up as your boldest self", tone: "text-orange-400" },
};

export const CATEGORIES: { name: Category; Icon: LucideIcon; blurb: string; tone: string }[] =
  (Object.keys(CATEGORY_META) as Category[]).map((name) => ({ name, ...CATEGORY_META[name] }));

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Quest {
  id: string;
  questTitle: string;
  category: Category;
  summary: string;
  whyItMatters: string;
  doThisToday: string;
  difficulty: Difficulty;
  xpReward: number;
  estimatedTime: string;
  optionalSourceTitle?: string;
  optionalSourceUrl?: string;
  tags: string[];
  icon: string;
}

const xpFor = (d: Difficulty) => (d === "Beginner" ? 10 : d === "Intermediate" ? 20 : 35);
const q = (
  id: string,
  category: Category,
  icon: string,
  questTitle: string,
  summary: string,
  whyItMatters: string,
  doThisToday: string,
  difficulty: Difficulty,
  estimatedTime: string,
  tags: string[],
  source?: { title: string; url: string },
): Quest => ({
  id,
  questTitle,
  category,
  summary,
  whyItMatters,
  doThisToday,
  difficulty,
  xpReward: xpFor(difficulty),
  estimatedTime,
  optionalSourceTitle: source?.title,
  optionalSourceUrl: source?.url,
  tags,
  icon,
});

export const DEFAULT_QUESTS: Quest[] = [
  q("ca-1", "Current Affairs", "🗞️", "Read one long-form story end to end",
    "Pick a single in-depth article instead of skimming 20 headlines.",
    "Headlines train you to react. Long-form trains you to think.",
    "Open Reuters or The Guardian, pick one feature story, and read it without switching tabs.",
    "Beginner", "15 min", ["news", "focus"],
    { title: "Reuters", url: "https://www.reuters.com" }),
  q("ca-2", "Current Affairs", "🌍", "Map a global story to its second-order effects",
    "Take one major news event and write down 3 ways it might ripple over the next year.",
    "Most people stop at the headline. Operators think in consequences.",
    "Pick today's biggest story. Write 3 second-order effects in your notes app.",
    "Intermediate", "20 min", ["geopolitics", "thinking"]),

  q("ac-1", "Art & Culture", "🖼️", "Visit one museum collection online",
    "Browse a curated collection from the world's great museums from your couch.",
    "Exposure to great work raises your taste — and taste compounds.",
    "Spend 10 minutes on the Met or Rijksmuseum site and pick one piece you'd hang at home.",
    "Beginner", "10 min", ["art", "taste"],
    { title: "The Met Collection", url: "https://www.metmuseum.org/art/collection" }),
  q("ac-2", "Art & Culture", "🎬", "Watch a short film by an award-winning director",
    "Short films are masterclasses in compression and craft.",
    "You learn more about storytelling from one great short than from a season of TV.",
    "Watch one short film on The Criterion Channel or YouTube and note the opening shot's purpose.",
    "Beginner", "20 min", ["film", "storytelling"]),

  q("ai-1", "AI & Technology", "🤖", "Build your personal AI prompt library",
    "Save 5 prompts that genuinely save you time this week.",
    "Reusable prompts compound. One-off prompts don't.",
    "Open a notes file called 'Prompts' and capture 5 you'd use again.",
    "Beginner", "15 min", ["ai", "workflow"]),
  q("ai-2", "AI & Technology", "🧠", "Use AI as a thinking partner, not a search box",
    "Reframe a decision using the 'steelman both sides' prompt.",
    "Most people use LLMs as Google. The leverage is in structured reasoning.",
    "Take one decision you're stuck on and ask Claude or ChatGPT to steelman both sides.",
    "Beginner", "10 min", ["llm", "decisions"]),
  q("ai-3", "AI & Technology", "📺", "Watch Karpathy's intro to LLMs",
    "One hour gets you a real mental model of how LLMs work.",
    "The clearest first-principles explanation of LLMs that exists.",
    "Watch the first 30 minutes today and finish tomorrow.",
    "Intermediate", "60 min", ["llm", "fundamentals"],
    { title: "Intro to LLMs (Karpathy)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" }),

  q("mo-1", "Money", "💸", "Audit every subscription you're paying for",
    "Cancel one you forgot you had.",
    "The fastest 'raise' most people get is killing dead subscriptions.",
    "Open your bank app, list every recurring charge, cancel one today.",
    "Beginner", "15 min", ["personal-finance", "saving"]),
  q("mo-2", "Money", "📊", "Learn the three-fund portfolio in 10 minutes",
    "A boring, calm primer on index investing that beats most active funds.",
    "Replaces hours of finance content with the math that compounds for decades.",
    "Read the Bogleheads three-fund page and check the expense ratio of any fund you own.",
    "Beginner", "12 min", ["investing", "index-funds"],
    { title: "Three-fund portfolio", url: "https://www.bogleheads.org/wiki/Three-fund_portfolio" }),
  q("mo-3", "Money", "🏦", "Automate one transfer to savings",
    "Make the savings decision once, not every month.",
    "Behavior beats intelligence in personal finance. Automation is behavior, locked in.",
    "Set up an auto-transfer for any amount — even €10 — to a savings account.",
    "Beginner", "10 min", ["saving", "habits"]),

  q("bu-1", "Business", "📈", "Fill out a one-page lean canvas",
    "Force clarity on customer, problem, and unfair advantage in under an hour.",
    "Beats a 30-page business plan you'll never read again.",
    "Sketch a lean canvas for your idea — 9 boxes, 1 page.",
    "Intermediate", "30 min", ["strategy", "mvp"],
    { title: "Strategyzer library", url: "https://www.strategyzer.com/library" }),
  q("bu-2", "Business", "🎯", "Interview 3 customers about the day they bought",
    "Use Jobs-to-be-Done to find the real trigger behind a purchase.",
    "Reveals the real competition for your product is rarely what you think.",
    "Message 3 recent customers and ask: 'walk me through the day you decided to buy.'",
    "Intermediate", "45 min", ["jtbd", "research"],
    { title: "JTBD primer", url: "https://jtbd.info/" }),
  q("bu-3", "Business", "✉️", "Read Paul Graham's Do Things That Don't Scale",
    "The classic essay on manually recruiting your first users.",
    "Cures the 'if we build it they will come' delusion that kills most startups.",
    "Read it once, then DM 5 ideal users today.",
    "Beginner", "10 min", ["yc", "early-stage"],
    { title: "Do Things That Don't Scale", url: "https://www.paulgraham.com/ds.html" }),

  q("hw-1", "Health & Wellness", "🚶", "Walk 8,000 steps today",
    "A walk is the most underrated health intervention there is.",
    "Daily walking improves mood, cardiovascular health, and creative thinking — all in one.",
    "Take a 30-minute walk without your phone in your hand.",
    "Beginner", "30 min", ["movement", "habits"]),
  q("hw-2", "Health & Wellness", "💧", "Hit your hydration target before noon",
    "Most fatigue is mild dehydration in disguise.",
    "Cheap, fast, real ROI on energy and focus.",
    "Drink one full glass of water on waking and another before lunch.",
    "Beginner", "5 min", ["hydration", "energy"]),
  q("hw-3", "Health & Wellness", "😴", "Lock a consistent wake-up time",
    "A fixed wake time anchors your entire circadian rhythm.",
    "Better sleep starts with mornings, not nights.",
    "Set the same wake-up alarm for the next 7 days — including weekends.",
    "Intermediate", "5 min", ["sleep", "habits"]),

  q("bl-1", "Beauty & Lifestyle", "✨", "Build a 3-step skincare routine",
    "Cleanser, moisturizer, SPF. That's the entire foundation.",
    "90% of the result comes from doing the basics every day, not the 12-step routine.",
    "Pick one cleanser, one moisturizer, one SPF — and use them tonight + tomorrow morning.",
    "Beginner", "10 min", ["skincare", "routine"]),
  q("bl-2", "Beauty & Lifestyle", "👕", "Define a 10-piece capsule wardrobe",
    "Decide what you actually wear so getting dressed stops costing willpower.",
    "Decision fatigue is real. A capsule kills it before breakfast.",
    "List the 10 pieces you'd happily wear all week and put them at the front of your closet.",
    "Intermediate", "30 min", ["style", "minimalism"]),

  q("cr-1", "Creativity", "✏️", "Write 3 morning pages",
    "Stream-of-consciousness writing to clear mental clutter.",
    "Empties the static so you can hear your actual ideas.",
    "Write 3 pages by hand — no editing, no rereading.",
    "Beginner", "20 min", ["writing", "habits"]),
  q("cr-2", "Creativity", "📷", "Shoot 10 photos with one constraint",
    "Constraints kill perfectionism and produce work.",
    "You learn more by shipping 10 imperfect things than planning 1 perfect one.",
    "Shoot 10 photos today using only your phone and one focal length.",
    "Beginner", "30 min", ["photography", "constraints"]),
  q("cr-3", "Creativity", "🎵", "Make a 60-second song idea",
    "Open a DAW or voice memo and capture one musical idea.",
    "Most musicians overthink themselves into silence. Capture beats craft on day one.",
    "Record one 60-second loop or hummed melody before bed.",
    "Intermediate", "20 min", ["music", "shipping"]),

  q("co-1", "Cooking", "🍳", "Learn to cook one perfect omelette",
    "The French omelette is the chef's basic skills exam.",
    "Master one technique-heavy dish and your everyday cooking levels up across the board.",
    "Watch a 5-min French omelette video and make one for breakfast tomorrow.",
    "Beginner", "15 min", ["technique", "breakfast"],
    { title: "Jacques Pépin omelette", url: "https://www.youtube.com/watch?v=s10etP1p2bU" }),
  q("co-2", "Cooking", "🥗", "Build a 5-ingredient go-to dinner",
    "A repeatable, healthy weeknight meal you can make on autopilot.",
    "Reliable defaults beat takeout every time.",
    "Decide your 5 ingredients, buy them today, cook it tonight.",
    "Beginner", "30 min", ["weeknight", "habits"]),

  q("ph-1", "Philosophy & Spirituality", "🕊️", "Read a Stoic passage and apply it once",
    "Marcus Aurelius wrote Meditations as a workout for the mind.",
    "Philosophy only matters if it changes a single decision today.",
    "Read one short passage from Meditations and apply it to one moment today.",
    "Beginner", "10 min", ["stoicism", "wisdom"],
    { title: "Meditations (free)", url: "https://classics.mit.edu/Antoninus/meditations.html" }),
  q("ph-2", "Philosophy & Spirituality", "🧘", "Sit for a 10-minute silent meditation",
    "No app. No music. Just you, breath, and a timer.",
    "The most boring 10 minutes of your day will reshape the other 23 hours and 50 minutes.",
    "Set a 10-minute timer, sit, breathe, return when you wander.",
    "Beginner", "10 min", ["meditation", "silence"]),

  q("pr-1", "Productivity", "🎯", "Pick your one thing for tomorrow tonight",
    "End the day by deciding the single most important task for tomorrow.",
    "You wake up already aligned instead of negotiating with yourself.",
    "Before bed, write one sentence: 'Tomorrow, the most important thing is ___.'",
    "Beginner", "5 min", ["planning", "focus"]),
  q("pr-2", "Productivity", "🧱", "Run one 90-minute deep work block",
    "No phone, no tabs, no Slack. One task. 90 minutes.",
    "A single deep block produces more than a fragmented workday.",
    "Pick the task, put your phone in another room, set a 90-minute timer.",
    "Intermediate", "90 min", ["deep-work", "focus"],
    { title: "Cal Newport on Deep Work", url: "https://www.calnewport.com/podcast/" }),
  q("pr-3", "Productivity", "📥", "Get your inbox to zero — once",
    "Just today. Not forever. A clean baseline beats infinite triage.",
    "An empty inbox is a clear head. You only need to feel it once to want it again.",
    "Archive aggressively, reply to anything under 2 minutes, snooze the rest.",
    "Intermediate", "30 min", ["inbox", "systems"]),

  q("co-confidence-1", "Confidence", "🔥", "Make one slightly uncomfortable ask today",
    "Ask for the discount, the intro, the meeting. Just once.",
    "Confidence is a muscle. It only grows under load.",
    "Identify one ask you've been avoiding and send it before the day ends.",
    "Beginner", "10 min", ["courage", "habits"]),
  q("co-confidence-2", "Confidence", "🎤", "Record a 60-second video of yourself talking",
    "Talk about anything you know well, on camera, without re-recording.",
    "Watching yourself once is worth a year of mirror practice.",
    "Hit record, talk for 60 seconds, watch it back, delete it.",
    "Intermediate", "10 min", ["speaking", "presence"]),
  q("co-confidence-3", "Confidence", "🪞", "Write your top 5 wins of the past year",
    "Most people forget how much they've already done.",
    "Confidence isn't manifesting. It's evidence.",
    "Open notes, list 5 things you're genuinely proud of from the last 12 months.",
    "Beginner", "10 min", ["self-image", "reflection"]),
];
