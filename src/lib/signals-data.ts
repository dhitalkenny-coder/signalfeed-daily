import {
  Brain,
  HeartPulse,
  Wallet,
  Palette,
  Wrench,
  Globe2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Category =
  | "Mind"
  | "Body"
  | "Wealth"
  | "Create"
  | "Skills"
  | "World"
  | "Lifestyle";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type ContentType = "Shorts" | "Video" | "Article" | "Tool" | "Idea" | "News" | "Tip";

export interface CategoryMeta {
  Icon: LucideIcon;
  tone: string;
  blurb: string;
  examples: string[];
  gradient: string;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  Mind: {
    Icon: Brain,
    tone: "text-indigo-300",
    blurb: "Think deeper, live calmer",
    examples: ["Focus", "emotions", "philosophy", "mental clarity"],
    gradient: "from-indigo-500/40 via-violet-700/20 to-slate-900",
  },
  Body: {
    Icon: HeartPulse,
    tone: "text-green-300",
    blurb: "Feel better, daily",
    examples: ["Sleep", "energy", "movement", "health basics"],
    gradient: "from-green-500/40 via-emerald-700/20 to-slate-900",
  },
  Wealth: {
    Icon: Wallet,
    tone: "text-emerald-300",
    blurb: "Save, invest, earn smarter",
    examples: ["Money", "saving", "business", "investing basics"],
    gradient: "from-emerald-500/40 via-teal-700/20 to-slate-900",
  },
  Create: {
    Icon: Palette,
    tone: "text-purple-300",
    blurb: "Make better, more often",
    examples: ["Design", "photography", "video", "music", "writing"],
    gradient: "from-purple-500/40 via-fuchsia-700/20 to-slate-900",
  },
  Skills: {
    Icon: Wrench,
    tone: "text-cyan-300",
    blurb: "Practical things worth knowing",
    examples: ["AI tools", "cooking", "communication", "productivity"],
    gradient: "from-cyan-500/40 via-sky-700/20 to-slate-900",
  },
  World: {
    Icon: Globe2,
    tone: "text-slate-300",
    blurb: "Understand what's happening",
    examples: ["Current affairs", "culture", "science", "history"],
    gradient: "from-slate-400/30 via-slate-700/20 to-slate-900",
  },
  Lifestyle: {
    Icon: Sparkles,
    tone: "text-orange-300",
    blurb: "Feel good in your own life",
    examples: ["Skin", "grooming", "beauty", "travel", "home routines"],
    gradient: "from-orange-500/40 via-amber-700/20 to-slate-900",
  },
};

export const CATEGORIES: ({ name: Category } & CategoryMeta)[] = (
  Object.keys(CATEGORY_META) as Category[]
).map((name) => ({ name, ...CATEGORY_META[name] }));

export const DIFFICULTIES: { name: Difficulty; line: string }[] = [
  { name: "Beginner", line: "Teach me the basics clearly." },
  { name: "Intermediate", line: "I know some things. Show me better ideas." },
  { name: "Advanced", line: "Give me deeper, sharper content." },
];

export interface QuizQuestion {
  question: string;
  options: string[]; // 3
  correctAnswer: number;
  explanation: string;
}

export interface Signal {
  id: string;
  title: string;
  hook: string;
  category: Category;
  difficulty: Difficulty;
  contentType: ContentType;
  youtubeEmbedUrl?: string;
  thumbnailFallback?: string;
  sourceName?: string;
  sourceUrl?: string;
  questions: QuizQuestion[];
  tags?: string[];
}

export const DEFAULT_SIGNALS: Signal[] = [
  {
    id: "skills-ai-thinks",
    title: "How AI actually thinks",
    hook: "Not magic. Just math.",
    category: "Skills",
    difficulty: "Beginner",
    contentType: "Shorts",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/qbIk7-JPge0?rel=0&modestbranding=1&playsinline=1",
    sourceName: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=qbIk7-JPge0",
    questions: [
      {
        question: "What does AI mostly do when generating text?",
        options: ["Predicts likely next words", "Reads your mind", "Searches Google directly"],
        correctAnswer: 0,
        explanation: "Language models generate text by predicting likely next tokens based on patterns.",
      },
      {
        question: "Why does this matter?",
        options: ["It means AI is always conscious", "It helps you understand its limits", "It removes all mistakes"],
        correctAnswer: 1,
        explanation: "Knowing AI predicts patterns helps you use it better and check its answers.",
      },
    ],
    tags: ["AI", "tech"],
  },
  {
    id: "wealth-leak-100",
    title: "You are leaking $100 a month",
    hook: "Most people forget subscriptions.",
    category: "Wealth",
    difficulty: "Beginner",
    contentType: "Shorts",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/7Lm4kDQaYiA?rel=0&modestbranding=1&playsinline=1",
    sourceName: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=7Lm4kDQaYiA",
    questions: [
      {
        question: "What is a common silent money leak?",
        options: ["Unused subscriptions", "Drinking water", "Saving money"],
        correctAnswer: 0,
        explanation: "Subscriptions are easy to forget because they renew automatically.",
      },
      {
        question: "What should you check first?",
        options: ["Your recurring bank charges", "Your old photos", "Your phone wallpaper"],
        correctAnswer: 0,
        explanation: "Recurring charges show what quietly leaves your account every month.",
      },
    ],
    tags: ["money", "saving"],
  },
  {
    id: "mind-stoics",
    title: "What Stoics knew that we forgot",
    hook: "2000 years old. Still works.",
    category: "Mind",
    difficulty: "Beginner",
    contentType: "Shorts",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/LBNNSCAgvEY?rel=0&modestbranding=1&playsinline=1",
    sourceName: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=LBNNSCAgvEY",
    questions: [
      {
        question: "What did Stoics focus on?",
        options: ["What they could control", "Other people's opinions", "Avoiding all problems"],
        correctAnswer: 0,
        explanation: "Stoicism teaches you to focus on your own actions and judgments.",
      },
      {
        question: "Why is this useful today?",
        options: [
          "It removes all stress",
          "It helps you stop wasting energy on things outside your control",
          "It makes life perfect",
        ],
        correctAnswer: 1,
        explanation: "You still face problems, but you waste less energy fighting what you cannot control.",
      },
    ],
    tags: ["philosophy", "stoicism"],
  },
  {
    id: "create-thirds",
    title: "The rule that makes photos better",
    hook: "One grid changes everything.",
    category: "Create",
    difficulty: "Beginner",
    contentType: "Shorts",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/hJDiQf3Sqoc?rel=0&modestbranding=1&playsinline=1",
    sourceName: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=hJDiQf3Sqoc",
    questions: [
      {
        question: "What does the rule of thirds use?",
        options: ["A 3x3 grid", "A circle", "A random crop"],
        correctAnswer: 0,
        explanation: "The rule of thirds divides the frame into 9 equal sections.",
      },
      {
        question: "Where should subjects often sit?",
        options: ["On grid lines or intersections", "Always at the bottom", "Outside the frame"],
        correctAnswer: 0,
        explanation: "Grid intersections create more balanced compositions.",
      },
    ],
    tags: ["photography", "composition"],
  },
  {
    id: "body-morning",
    title: "Your morning shapes your brain",
    hook: "The first 10 minutes matter.",
    category: "Body",
    difficulty: "Beginner",
    contentType: "Shorts",
    youtubeEmbedUrl: "https://www.youtube-nocookie.com/embed/kFUjkfhPCk4?rel=0&modestbranding=1&playsinline=1",
    sourceName: "YouTube",
    sourceUrl: "https://www.youtube.com/watch?v=kFUjkfhPCk4",
    questions: [
      {
        question: "What can hurt morning focus?",
        options: ["Checking your phone immediately", "Drinking water", "Opening a window"],
        correctAnswer: 0,
        explanation: "Your phone can flood your brain with stimulation before you start your day.",
      },
      {
        question: "What is a better first move?",
        options: ["Get light, water, or movement first", "Scroll for 30 minutes", "Reply to every notification"],
        correctAnswer: 0,
        explanation: "Light, water, and movement help your body wake up naturally.",
      },
    ],
    tags: ["morning", "focus"],
  },
  {
    id: "lifestyle-skin",
    title: "Skin basics most people skip",
    hook: "Simple beats complicated.",
    category: "Lifestyle",
    difficulty: "Beginner",
    contentType: "Tip",
    questions: [
      {
        question: "What is the most basic daily skin habit?",
        options: ["Sunscreen", "Ten products", "Scrubbing hard"],
        correctAnswer: 0,
        explanation: "Sunscreen is one of the most important basic skin-protection habits.",
      },
      {
        question: "What should beginners avoid?",
        options: ["Changing everything at once", "Using gentle products", "Washing face"],
        correctAnswer: 0,
        explanation: "Changing too many products makes it hard to know what works.",
      },
    ],
    tags: ["skin", "basics"],
  },
  {
    id: "world-one-story",
    title: "Understand one big story today",
    hook: "If you can explain it simply, you understand it.",
    category: "World",
    difficulty: "Beginner",
    contentType: "Tip",
    questions: [
      {
        question: "What helps you understand news better?",
        options: ["Explain it in one sentence", "Read ten headlines only", "Trust comments first"],
        correctAnswer: 0,
        explanation: "A simple explanation shows you understand the core idea.",
      },
      {
        question: "What should you check before believing a story?",
        options: ["Source and context", "Number of emojis", "Comment section only"],
        correctAnswer: 0,
        explanation: "Source and context help you avoid misinformation.",
      },
    ],
    tags: ["news", "media literacy"],
  },
  {
    id: "wealth-build-demand",
    title: "Don't build before people care",
    hook: "\"Nice idea\" is not demand.",
    category: "Wealth",
    difficulty: "Intermediate",
    contentType: "Idea",
    sourceName: "Y Combinator / Paul Graham",
    sourceUrl: "https://www.paulgraham.com/startupideas.html",
    questions: [
      {
        question: "What should you prove first?",
        options: ["People actually want the solution", "Your logo is perfect", "You have every feature"],
        correctAnswer: 0,
        explanation: "Demand matters more than polish at the start.",
      },
      {
        question: "What is a weak signal?",
        options: ["\"Nice idea\"", "Someone asking to use it again", "Someone paying or returning"],
        correctAnswer: 0,
        explanation: "Compliments are cheap. Repeated use is stronger proof.",
      },
    ],
    tags: ["startup", "demand"],
  },
];
