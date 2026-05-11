import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Flame, Sparkles, CheckCircle2, Eye, Bookmark, GraduationCap } from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { DEFAULT_SIGNALS, type Signal, CATEGORIES, type Category } from "@/lib/signals-data";
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

// Soft level mapping — not XP grind
function levelFor(points: number): { level: number; pct: number; nextAt: number } {
  // Level 1: 0-9, Level 2: 10-24, Level 3: 25-49, Level 4: 50-99, Level 5: 100+
  const tiers = [0, 10, 25, 50, 100, 200];
  let level = 1;
  for (let i = 1; i < tiers.length; i++) {
    if (points >= tiers[i]) level = i + 1;
  }
  const lo = tiers[level - 1];
  const hi = tiers[Math.min(level, tiers.length - 1)] || lo + 100;
  const pct = level >= tiers.length ? 100 : Math.min(100, ((points - lo) / (hi - lo)) * 100);
  return { level: Math.min(level, 5), pct, nextAt: hi };
}

function ProgressPage() {
  const [watched] = useLocalStorage<{ id: string; at: string }[]>("sf:watched", []);
  const [learned] = useLocalStorage<{ id: string; at: string }[]>("sf:learned", []);
  const [answers] = useLocalStorage<QuizAnswer[]>("sf:answers", []);
  const [savedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const byId = useMemo(() => new Map(all.map((s) => [s.id, s])), [all]);

  const streak = computeStreak(watched);
  const correctCount = answers.filter((a) => a.correct).length;
  const today = todayKey();
  const reelsWatchedToday = new Set(
    watched.filter((w) => w.at.slice(0, 10) === today).map((w) => w.id),
  ).size;
  const correctToday = answers.filter((a) => a.correct && a.at.slice(0, 10) === today).length;
  const learnedToday = learned.filter((l) => l.at.slice(0, 10) === today).length;

  const categoryPoints = useMemo(() => {
    const pts = new Map<Category, number>();
    const add = (c: Category | undefined, n: number) => {
      if (!c) return;
      pts.set(c, (pts.get(c) ?? 0) + n);
    };
    for (const w of watched) add(byId.get(w.id)?.category, 1);
    for (const a of answers) if (a.correct) add(byId.get(a.id)?.category, 2);
    for (const l of learned) add(byId.get(l.id)?.category, 3);
    for (const id of savedIds) add(byId.get(id)?.category, 1);
    return CATEGORIES.map((c) => ({ ...c, points: pts.get(c.name) ?? 0 })).sort(
      (a, b) => b.points - a.points,
    );
  }, [watched, answers, learned, savedIds, byId]);

  const todayStats = [
    { icon: Eye, label: "Reels watched", value: reelsWatchedToday },
    { icon: CheckCircle2, label: "Correct answers", value: correctToday },
    { icon: GraduationCap, label: "Reels learned", value: learnedToday },
    { icon: Bookmark, label: "Saved", value: savedIds.length },
  ];

  const overallStats = [
    { icon: Flame, label: "Current streak", value: `${streak}d` },
    { icon: GraduationCap, label: "Total learned", value: learned.length },
    { icon: CheckCircle2, label: "Correct (all-time)", value: correctCount },
  ];

  return (
    <main className="min-h-[100dvh] pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Your progress</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">Building useful knowledge</h1>
        <p className="mt-1 text-sm text-muted-foreground">A little useful scrolling, every day.</p>
      </header>

      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Today
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {todayStats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-card-gradient p-4"
          >
            <s.icon className="h-4 w-4 text-signal" />
            <p className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <h2 className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Overall
      </h2>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {overallStats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card-gradient p-3">
            <s.icon className="h-4 w-4 text-signal" />
            <p className="mt-2 text-xl font-semibold tracking-tight">{s.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Category progress
        </h2>
        <div className="mt-3 grid gap-2">
          {categoryPoints.map((c) => {
            const Icon = c.Icon;
            const { level, pct } = levelFor(c.points);
            return (
              <div
                key={c.name}
                className="rounded-xl border border-border bg-card/40 px-3.5 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md bg-background/60 border border-border ${c.tone}`}>
                      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                    </span>
                    <span className="text-[13.5px] font-medium truncate">{c.name}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">
                    Level {level}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
                  <div
                    className="h-full bg-signal/80 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {watched.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-6 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-signal" />
          <p className="mt-3 text-sm font-medium">No reels yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Watch a reel and answer a quick check to start your streak.
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
