import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, CheckCircle2, HelpCircle, Bookmark } from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { DEFAULT_SIGNALS, type Signal, CATEGORIES } from "@/lib/signals-data";
import type { QuizAnswer } from "./feed";

export const Route = createFileRoute("/progress")({
  head: () => ({ meta: [{ title: "Your progress · SignalFeed" }] }),
  component: ProgressPage,
});

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function computeStreak(records: { at: string }[]) {
  if (!records.length) return 0;
  const days = new Set(records.map((r) => r.at.slice(0, 10)));
  let streak = 0;
  const cur = new Date();
  if (!days.has(todayKey(cur))) {
    cur.setDate(cur.getDate() - 1);
    if (!days.has(todayKey(cur))) return 0;
  }
  while (days.has(todayKey(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

function ProgressPage() {
  const [points] = useLocalStorage<number>("sf:points", 0);
  const [learned] = useLocalStorage<{ id: string; at: string }[]>("sf:learned", []);
  const [answers] = useLocalStorage<QuizAnswer[]>("sf:answers", []);
  const [savedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const byId = useMemo(() => new Map(all.map((s) => [s.id, s])), [all]);

  const streak = computeStreak(learned);
  const correctCount = answers.filter((a) => a.correct).length;

  const perCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const l of learned) {
      const sig = byId.get(l.id);
      if (!sig) continue;
      counts.set(sig.category, (counts.get(sig.category) ?? 0) + 1);
    }
    return CATEGORIES.map((c) => ({ ...c, count: counts.get(c.name) ?? 0 })).sort(
      (a, b) => b.count - a.count,
    );
  }, [learned, byId]);

  const stats = [
    { icon: Flame, label: "Streak", value: `${streak}d` },
    { icon: CheckCircle2, label: "Learned", value: learned.length },
    { icon: HelpCircle, label: "Quick checks", value: `${correctCount}/${answers.length}` },
    { icon: Bookmark, label: "Saved", value: savedIds.length },
  ];

  // Light progress bar — every 50 points fills a tier
  const tierSize = 50;
  const tier = Math.floor(points / tierSize) + 1;
  const intoTier = points % tierSize;
  const tierPct = Math.min(100, Math.round((intoTier / tierSize) * 100));

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Your progress</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">
          {points} learning points
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tier {tier} · {tierSize - intoTier} points to next tier
        </p>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary/60">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tierPct}%` }}
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
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Top categories
        </h2>
        <div className="mt-3 divide-y divide-border/60 rounded-xl border border-border bg-card/40">
          {perCategory.map((c) => {
            const Icon = c.Icon;
            return (
              <div
                key={c.name}
                className="flex items-center justify-between px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-md bg-background/60 border border-border ${c.tone}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  <span className="text-[13px] font-medium truncate">{c.name}</span>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {c.count} learned
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {learned.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-signal" />
          <p className="mt-3 text-sm font-medium">Nothing learned yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Mark a signal as learned to start your streak.
          </p>
          <Link
            to="/feed"
            className="mt-4 inline-block text-sm text-signal underline-offset-4 hover:underline"
          >
            Open your feed →
          </Link>
        </div>
      )}
    </main>
  );
}
