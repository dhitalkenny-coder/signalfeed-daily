export type Category =
  | "AI" | "Business" | "Money" | "Filmmaking" | "Music"
  | "Design" | "Productivity" | "Psychology" | "Startups" | "Creator Growth";

export const CATEGORIES: Category[] = [
  "AI","Business","Money","Filmmaking","Music",
  "Design","Productivity","Psychology","Startups","Creator Growth",
];

export interface FeedPost {
  id: string;
  title: string;
  platform: string;
  url: string;
  category: Category;
  summary: string;
  whyUseful: string;
  actionStep: string;
  timeToConsume: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

export const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    title: "How to actually use Claude as a thinking partner",
    platform: "YouTube",
    url: "https://www.youtube.com",
    category: "AI",
    summary: "A breakdown of prompt patterns that turn LLMs into useful research collaborators instead of toy chatbots.",
    whyUseful: "Most people use AI as a search engine. This reframes it as a structured reasoning tool you can compound on.",
    actionStep: "Open Claude and run one decision you're stuck on through the 'steelman both sides' prompt.",
    timeToConsume: "9 min",
    difficulty: "Beginner",
    tags: ["llm","workflow","prompting"],
  },
  {
    id: "2",
    title: "The one-page business model that beats a 30-page plan",
    platform: "Article",
    url: "https://strategyzer.com",
    category: "Business",
    summary: "A condensed walkthrough of the lean canvas with examples from real bootstrapped companies.",
    whyUseful: "Forces clarity on customer, problem, and unfair advantage in under an hour.",
    actionStep: "Fill out a lean canvas for your current idea before you write any more code.",
    timeToConsume: "12 min",
    difficulty: "Beginner",
    tags: ["strategy","mvp"],
  },
  {
    id: "3",
    title: "Index funds explained without the bro energy",
    platform: "Podcast",
    url: "https://www.bogleheads.org",
    category: "Money",
    summary: "A calm primer on three-fund portfolios, expense ratios, and why timing the market loses.",
    whyUseful: "Replaces hours of finance content with the actual math that compounds over decades.",
    actionStep: "Check the expense ratio of every fund you own. Anything above 0.2% — investigate.",
    timeToConsume: "22 min",
    difficulty: "Beginner",
    tags: ["investing","personal-finance"],
  },
  {
    id: "4",
    title: "Shooting cinematic b-roll with one lens",
    platform: "YouTube",
    url: "https://www.youtube.com",
    category: "Filmmaking",
    summary: "A working DP shows how composition and movement matter more than gear.",
    whyUseful: "Cuts through gear-acquisition syndrome with constraints that force better shots.",
    actionStep: "Shoot 10 b-roll clips this week using only a 35mm equivalent.",
    timeToConsume: "14 min",
    difficulty: "Intermediate",
    tags: ["cinematography","composition"],
  },
  {
    id: "5",
    title: "Mixing vocals so they sit, not shout",
    platform: "Article",
    url: "https://www.soundonsound.com",
    category: "Music",
    summary: "EQ, compression, and reverb chains explained for bedroom producers.",
    whyUseful: "The single biggest factor that separates demo-quality from release-quality.",
    actionStep: "Pull up a stem and try the 200Hz cut → de-ess → parallel comp chain.",
    timeToConsume: "11 min",
    difficulty: "Intermediate",
    tags: ["mixing","vocals"],
  },
  {
    id: "6",
    title: "Why good UI is mostly spacing",
    platform: "Article",
    url: "https://refactoringui.com",
    category: "Design",
    summary: "Practical rules from Refactoring UI on hierarchy, weight, and density.",
    whyUseful: "Gives non-designers a checklist that immediately raises the floor of their work.",
    actionStep: "Audit one screen of your product and double the whitespace around primary CTAs.",
    timeToConsume: "8 min",
    difficulty: "Beginner",
    tags: ["ui","whitespace"],
  },
  {
    id: "7",
    title: "Time-blocking that actually survives Tuesday",
    platform: "Newsletter",
    url: "https://blog.doist.com",
    category: "Productivity",
    summary: "A realistic system that accounts for interruptions and energy levels.",
    whyUseful: "Most productivity systems collapse on contact with reality. This one doesn't.",
    actionStep: "Block 90 minutes tomorrow morning for your single most important task.",
    timeToConsume: "7 min",
    difficulty: "Beginner",
    tags: ["focus","planning"],
  },
  {
    id: "8",
    title: "The default mode network and why you can't think on a phone",
    platform: "Long-read",
    url: "https://www.theatlantic.com",
    category: "Psychology",
    summary: "Neuroscience of boredom, wandering attention, and where insight comes from.",
    whyUseful: "Explains the cost of constant input and what to do about it without going off-grid.",
    actionStep: "Take a 20-minute walk today with no podcast, no music, no phone.",
    timeToConsume: "16 min",
    difficulty: "Intermediate",
    tags: ["attention","neuroscience"],
  },
  {
    id: "9",
    title: "Y Combinator's request for startups, decoded",
    platform: "Essay",
    url: "https://www.ycombinator.com",
    category: "Startups",
    summary: "What YC partners actually mean by each category and where the gaps are.",
    whyUseful: "Free signal on where serious capital thinks the next decade is going.",
    actionStep: "Pick one RFS category and write a one-page thesis for a company in it.",
    timeToConsume: "13 min",
    difficulty: "Intermediate",
    tags: ["yc","ideas"],
  },
  {
    id: "10",
    title: "Building an audience without becoming a content slave",
    platform: "Twitter thread",
    url: "https://twitter.com",
    category: "Creator Growth",
    summary: "A sustainable cadence model based on one heavy asset plus daily atomic posts.",
    whyUseful: "Avoids the burnout loop most creators hit at month 4.",
    actionStep: "Plan one long-form piece this week and 5 atomic posts derived from it.",
    timeToConsume: "6 min",
    difficulty: "Beginner",
    tags: ["audience","writing"],
  },
];
