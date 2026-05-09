import {
  Cpu,
  Wallet,
  PenTool,
  Newspaper,
  BookOpen,
  HeartPulse,
  Utensils,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export type Category =
  | "AI & Tech"
  | "Money"
  | "Creativity"
  | "News & Current Affairs"
  | "Mind & Philosophy"
  | "Health & Lifestyle"
  | "Cooking & Skills"
  | "Business";

export type ContentType = "Video" | "Article" | "Tool" | "Idea" | "News" | "Tip";

export interface CategoryMeta {
  Icon: LucideIcon;
  tone: string;
  blurb: string;
  examples: string[];
  gradient: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  "AI & Tech": {
    Icon: Cpu,
    tone: "text-cyan-300",
    blurb: "Use the tools shaping the future",
    examples: ["AI tools", "gadgets", "cybersecurity", "software"],
    gradient: "from-cyan-500/40 via-sky-700/20 to-slate-900",
  },
  "Money": {
    Icon: Wallet,
    tone: "text-emerald-300",
    blurb: "Save, invest, earn smarter",
    examples: ["saving", "budgeting", "investing", "side hustles"],
    gradient: "from-emerald-500/40 via-teal-700/20 to-slate-900",
  },
  "Creativity": {
    Icon: PenTool,
    tone: "text-purple-300",
    blurb: "Make better, more often",
    examples: ["design", "photography", "video", "music"],
    gradient: "from-purple-500/40 via-fuchsia-700/20 to-slate-900",
  },
  "News & Current Affairs": {
    Icon: Newspaper,
    tone: "text-slate-300",
    blurb: "Understand what's happening",
    examples: ["world events", "explainers", "trends"],
    gradient: "from-slate-400/30 via-slate-700/20 to-slate-900",
  },
  "Mind & Philosophy": {
    Icon: BookOpen,
    tone: "text-indigo-300",
    blurb: "Think deeper, live calmer",
    examples: ["Stoicism", "Buddhism", "ethics", "psychology"],
    gradient: "from-indigo-500/40 via-violet-700/20 to-slate-900",
  },
  "Health & Lifestyle": {
    Icon: HeartPulse,
    tone: "text-green-300",
    blurb: "Feel better, daily",
    examples: ["wellness", "habits", "sleep", "self-care"],
    gradient: "from-green-500/40 via-emerald-700/20 to-slate-900",
  },
  "Cooking & Skills": {
    Icon: Utensils,
    tone: "text-orange-300",
    blurb: "Practical things worth knowing",
    examples: ["recipes", "home skills", "practical tips"],
    gradient: "from-orange-500/40 via-amber-700/20 to-slate-900",
  },
  "Business": {
    Icon: Briefcase,
    tone: "text-amber-300",
    blurb: "Operator-level thinking",
    examples: ["marketing", "sales", "startup ideas", "customer problems"],
    gradient: "from-amber-500/40 via-yellow-700/15 to-slate-900",
  },
};

export const CATEGORIES: ({ name: Category } & CategoryMeta)[] = (
  Object.keys(CATEGORY_META) as Category[]
).map((name) => ({ name, ...CATEGORY_META[name] }));

export interface QuizQuestion {
  q: string;
  options: string[]; // 4
  correct: number;   // index
  explanation: string;
}

export interface Signal {
  id: string;
  title: string;
  hook: string;
  category: Category;
  contentType: ContentType;
  videoUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  questions: QuizQuestion[];
}

export const DEFAULT_SIGNALS: Signal[] = [
  {
    id: "ai-llm",
    title: "How LLMs actually work",
    hook: "The clearest explanation of AI in under an hour",
    category: "AI & Tech",
    contentType: "Video",
    videoUrl: "https://www.youtube.com/embed/zjkBMFhNj_g?rel=0&modestbranding=1",
    sourceName: "Andrej Karpathy / YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
    questions: [
      {
        q: "What does LLM stand for?",
        options: ["Large League Model", "Large Language Model", "Linear Logic Machine", "Learned Language Module"],
        correct: 1,
        explanation: "LLM means Large Language Model — an AI system trained on massive amounts of text.",
      },
      {
        q: "What do LLMs fundamentally predict?",
        options: ["Images", "User clicks", "The next word", "Search results"],
        correct: 2,
        explanation: "LLMs generate text by predicting the most likely next word, repeatedly.",
      },
      {
        q: "Which company created GPT-4?",
        options: ["Google", "Meta", "Anthropic", "OpenAI"],
        correct: 3,
        explanation: "GPT-4 was created by OpenAI.",
      },
    ],
  },
  {
    id: "money-leak",
    title: "You're probably leaking $100/month",
    hook: "Most people forget subscriptions they still pay for",
    category: "Money",
    contentType: "Video",
    videoUrl: "https://www.youtube.com/embed/THNkf02fBNI?rel=0&modestbranding=1",
    sourceName: "George Kamel / YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=THNkf02fBNI",
    questions: [
      {
        q: "What is a common silent money drain?",
        options: ["Coffee", "Unused subscriptions", "Eating out", "Impulse buying"],
        correct: 1,
        explanation: "Unused subscriptions quietly drain money because people forget they're still active.",
      },
      {
        q: "How often should you audit subscriptions?",
        options: ["Once a year", "Never", "Every 3 months", "Every week"],
        correct: 2,
        explanation: "Quarterly audits catch subscriptions before they pile up.",
      },
      {
        q: "What is the first step of a subscription audit?",
        options: ["Cancel everything", "Call your bank", "Check recurring charges in your bank app", "Delete all apps"],
        correct: 2,
        explanation: "Start by listing recurring charges, then decide what stays.",
      },
    ],
  },
  {
    id: "phil-stoic",
    title: "What Stoics knew that we forgot",
    hook: "A 2000-year-old idea that makes today matter",
    category: "Mind & Philosophy",
    contentType: "Video",
    videoUrl: "https://www.youtube.com/embed/EFkyxzJtiv4?rel=0&modestbranding=1",
    sourceName: "Einzelgänger / YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=EFkyxzJtiv4",
    questions: [
      {
        q: "What does Memento Mori mean?",
        options: ["Live in the moment", "Remember you will die", "Forget the past", "Enjoy today"],
        correct: 1,
        explanation: "Memento Mori means 'remember that you will die'.",
      },
      {
        q: "Why did Stoics think about death?",
        options: ["To feel sad", "To prepare for heaven", "To appreciate life and stop wasting time", "To overcome fear"],
        correct: 2,
        explanation: "For Stoics, thinking about death made life feel more urgent and valuable.",
      },
      {
        q: "Which philosopher wrote Meditations?",
        options: ["Socrates", "Plato", "Marcus Aurelius", "Epicurus"],
        correct: 2,
        explanation: "Marcus Aurelius wrote Meditations as private notes to himself.",
      },
    ],
  },
  {
    id: "creat-thirds",
    title: "The rule that makes photos better",
    hook: "One invisible grid changes composition",
    category: "Creativity",
    contentType: "Video",
    videoUrl: "https://www.youtube.com/embed/o9t9R7Zn7C0?rel=0&modestbranding=1",
    sourceName: "NYIP / YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=o9t9R7Zn7C0",
    questions: [
      {
        q: "What does the rule of thirds divide the frame into?",
        options: ["4 squares", "6 sections", "9 equal boxes", "2 halves"],
        correct: 2,
        explanation: "The 3x3 grid creates 9 boxes and 4 intersection points.",
      },
      {
        q: "Where should your subject often be placed?",
        options: ["Dead center", "Bottom edge", "Top corner", "At a grid intersection point"],
        correct: 3,
        explanation: "Placing subjects on intersections creates balance and visual tension.",
      },
      {
        q: "Where can you enable a grid?",
        options: ["Instagram settings", "Photo editing apps only", "Phone camera settings", "You must draw it yourself"],
        correct: 2,
        explanation: "Most phones let you enable a camera grid in settings.",
      },
    ],
  },
  {
    id: "health-morning",
    title: "The first 30 minutes matter",
    hook: "Your morning shapes your brain chemistry",
    category: "Health & Lifestyle",
    contentType: "Video",
    videoUrl: "https://www.youtube.com/embed/h2aWYjSA1Jc?rel=0&modestbranding=1",
    sourceName: "Andrew Huberman / YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=h2aWYjSA1Jc",
    questions: [
      {
        q: "What should you avoid right after waking?",
        options: ["Drinking water", "Bright screens and phone", "Stretching", "Opening windows"],
        correct: 1,
        explanation: "Checking your phone immediately can overload attention and dopamine early.",
      },
      {
        q: "What does morning light exposure help set?",
        options: ["Skin tone", "Circadian rhythm", "Eyesight", "Vitamin D only"],
        correct: 1,
        explanation: "Morning light helps set your body clock for the day.",
      },
      {
        q: "How long is a useful morning light exposure window?",
        options: ["2 minutes", "1 hour", "10–30 minutes", "All morning"],
        correct: 2,
        explanation: "10–30 minutes is often enough to anchor your circadian rhythm.",
      },
    ],
  },
  {
    id: "biz-idea",
    title: "Is your idea worth building?",
    hook: "Most founders build things nobody badly wanted",
    category: "Business",
    contentType: "Tip",
    sourceName: "Paul Graham / Y Combinator",
    sourceUrl: "https://www.paulgraham.com/startupideas.html",
    questions: [
      {
        q: "What is a strong early startup test?",
        options: ["Can you build it in a weekend?", "Do 10 people genuinely need this?", "Is the market big?", "Can you get funding?"],
        correct: 1,
        explanation: "If real people badly need it, the idea has stronger pull.",
      },
      {
        q: "Where do many strong startup ideas come from?",
        options: ["Brainstorming sessions", "Market reports only", "Personal frustration with real problems", "Copying competitors"],
        correct: 2,
        explanation: "Many strong ideas start when founders notice their own repeated pain.",
      },
      {
        q: "What mistake do first-time founders often make?",
        options: ["Moving too fast", "Building a solution before proving the problem", "Not raising money", "Building alone"],
        correct: 1,
        explanation: "A product is risky when the problem is not urgent or proven.",
      },
    ],
  },
];
