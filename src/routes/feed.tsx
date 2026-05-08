import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { SignalCard } from "@/components/SignalCard";
import { DEFAULT_SIGNALS, type Category, type Signal } from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";
function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Smart Feed · SignalFeed" }] }),
  component: Feed,
});

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function pickFeed(all: Signal[], interests: Category[], n = 14) {
  const pool = interests.length ? all.filter((s) => interests.includes(s.category)) : all;
  const source = pool.length ? pool : all;
  const seed = todayKey();
  return source
    .map((s) => ({ s, k: hash(s.id + seed) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.s)
    .slice(0, n);
}

export interface QuizAnswer {
  id: string;
  picked: number;
  correct: boolean;
  at: string;
}

function Feed() {
  const [interests] = useLocalStorage<Category[]>("sf:interests", []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [learned, setLearned] = useLocalStorage<{ id: string; at: string }[]>("sf:learned", []);
  const [answers, setAnswers] = useLocalStorage<QuizAnswer[]>("sf:answers", []);
  const [points, setPoints] = useLocalStorage<number>("sf:points", 0);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const feed = useMemo(() => pickFeed(all, interests, 14), [all, interests]);
  const learnedIds = useMemo(() => new Set(learned.map((l) => l.id)), [learned]);
  const answerMap = useMemo(() => {
    const m = new Map<string, boolean>();
    for (const a of answers) m.set(a.id, a.correct);
    return m;
  }, [answers]);

  const toggleSave = (id: string) =>
    setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const markLearned = (id: string) => {
    if (learnedIds.has(id)) return;
    setLearned((p) => [...p, { id, at: new Date().toISOString() }]);
    setPoints((p) => p + 5);
  };

  const onAnswer = (id: string, picked: number, correct: boolean) => {
    setAnswers((prev) => {
      if (prev.some((a) => a.id === id)) return prev;
      return [...prev, { id, picked, correct, at: new Date().toISOString() }];
    });
    if (correct) setPoints((p) => p + 2);
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const learnedToday = feed.filter((s) => learnedIds.has(s.id)).length;

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-5"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-signal">{today}</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">Smart Feed</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Useful signals to scroll, learn, and remember.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card-gradient px-4 py-3 text-sm">
          <span className="text-muted-foreground">Learned today</span>
          <span className="font-medium">{learnedToday}</span>
        </div>
        {!interests.length && (
          <Link
            to="/interests"
            className="mt-2 inline-block text-xs text-signal underline-offset-4 hover:underline"
          >
            Pick interests for a sharper feed →
          </Link>
        )}
      </motion.header>

      <div className="grid gap-4">
        {feed.map((signal, i) => (
          <SignalCard
            key={signal.id}
            signal={signal}
            index={i}
            saved={savedIds.includes(signal.id)}
            learned={learnedIds.has(signal.id)}
            answeredCorrect={answerMap.has(signal.id) ? answerMap.get(signal.id)! : null}
            onToggleSave={toggleSave}
            onMarkLearned={markLearned}
            onAnswer={onAnswer}
          />
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card-gradient p-5 text-center">
        <p className="text-sm font-medium">That's your feed for today.</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Come back tomorrow for fresh signals · {points} learning points so far
        </p>
      </div>
    </main>
  );
}
