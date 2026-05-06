import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { QuestCard } from "@/components/QuestCard";
import { DEFAULT_QUESTS, type Category, type Quest } from "@/lib/quests-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import { type CompletionRecord, todayKey } from "@/lib/progress";

export const Route = createFileRoute("/quests")({
  head: () => ({ meta: [{ title: "Today's quests · SignalFeed" }] }),
  component: Quests,
});

function pickDaily(all: Quest[], goals: Category[], n = 10) {
  const pool = goals.length ? all.filter((q) => goals.includes(q.category)) : all;
  const source = pool.length ? pool : all;
  const seed = todayKey();
  // Deterministic-ish shuffle by sorting on a hash of (id+seed)
  const hashed = source
    .map((q) => ({ q, k: hash(q.id + seed) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.q);
  return hashed.slice(0, n);
}

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

function Quests() {
  const [goals] = useLocalStorage<Category[]>("sf:goals", []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [history, setHistory] = useLocalStorage<CompletionRecord[]>("sf:history", []);
  const [xp, setXp] = useLocalStorage<number>("sf:xp", 0);
  const [customQuests] = useLocalStorage<Quest[]>("sf:custom-quests", []);
  const [toast, setToast] = useState<string | null>(null);

  const all = useMemo(() => [...customQuests, ...DEFAULT_QUESTS], [customQuests]);
  const todays = useMemo(() => pickDaily(all, goals, 10), [all, goals]);
  const completedIds = useMemo(() => new Set(history.map((h) => h.id)), [history]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const complete = (id: string, reward: number) => {
    if (completedIds.has(id)) return;
    setHistory((prev) => [
      ...prev,
      { id, xp: reward, completedAt: new Date().toISOString() },
    ]);
    setXp((prev) => prev + reward);
    setToast(`Quest complete · +${reward} XP`);
    setTimeout(() => setToast(null), 2200);
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const doneToday = todays.filter((q) => completedIds.has(q.id)).length;

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-signal">{today}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Today's quests</h1>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card-gradient px-4 py-3">
          <span className="text-sm text-muted-foreground">Daily progress</span>
          <span className="text-sm font-medium">
            {doneToday} / {todays.length} complete
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Total XP: <span className="text-foreground font-medium">{xp}</span></span>
          {!goals.length && (
            <Link to="/goals" className="text-signal underline-offset-4 hover:underline">
              Pick goals →
            </Link>
          )}
        </div>
      </motion.header>

      <div className="grid gap-4">
        {todays.map((quest, i) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            index={i}
            saved={savedIds.includes(quest.id)}
            completed={completedIds.has(quest.id)}
            onToggleSave={toggleSave}
            onComplete={complete}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 rounded-2xl border border-border bg-card-gradient p-5 text-center"
      >
        <p className="text-sm font-medium">That's the quest list for today.</p>
        <p className="mt-1 text-xs text-muted-foreground">Come back tomorrow. Keep the streak alive.</p>
      </motion.div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 inset-x-0 mx-auto w-fit z-50 inline-flex items-center gap-2 rounded-full bg-signal-gradient px-4 py-2.5 text-sm font-semibold text-signal-foreground shadow-glow"
          >
            <Sparkles className="h-4 w-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
