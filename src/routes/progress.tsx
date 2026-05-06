import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Trophy, Sparkles, CheckCircle2 } from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  type CompletionRecord,
  computeStreak,
  levelFromXP,
} from "@/lib/progress";
import { DEFAULT_QUESTS, type Quest, CATEGORIES } from "@/lib/quests-data";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Your progress · SignalFeed" }] }),
  component: ProgressPage,
});

function ProgressPage() {
  const [xp] = useLocalStorage<number>("sf:xp", 0);
  const [history] = useLocalStorage<CompletionRecord[]>("sf:history", []);
  const [customQuests] = useLocalStorage<Quest[]>("sf:custom-quests", []);

  const all = useMemo(() => [...customQuests, ...DEFAULT_QUESTS], [customQuests]);
  const byId = useMemo(() => new Map(all.map((q) => [q.id, q])), [all]);

  const level = levelFromXP(xp);
  const streak = computeStreak(history);

  const perCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const h of history) {
      const q = byId.get(h.id);
      if (!q) continue;
      counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
    }
    return CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) ?? 0 })).sort(
      (a, b) => b.count - a.count,
    );
  }, [history, byId]);

  const stats = [
    { icon: Trophy, label: "Level", value: level.level },
    { icon: Sparkles, label: "Total XP", value: xp },
    { icon: Flame, label: "Streak", value: `${streak}d` },
    { icon: CheckCircle2, label: "Completed", value: history.length },
  ];

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Your progress</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Level {level.level}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {level.nextLevelAt
            ? `${level.xpForNext} XP to Level ${level.level + 1}`
            : "Max level reached. Legend mode."}
        </p>

        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level.progressPct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="h-full bg-signal-gradient"
          />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card-gradient p-4"
          >
            <s.icon className="h-4 w-4 text-signal" />
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          By category
        </h2>
        <div className="mt-3 grid gap-2">
          {perCategory.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{c.icon}</span>
                <span className="text-sm font-medium">{c.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {c.count} quest{c.count === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {history.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm font-medium">No quests completed yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete your first quest to start your streak.
          </p>
          <Link
            to="/quests"
            className="mt-4 inline-block text-sm text-signal underline-offset-4 hover:underline"
          >
            Go to today's quests →
          </Link>
        </div>
      )}
    </main>
  );
}
