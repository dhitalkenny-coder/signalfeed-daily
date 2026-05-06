export const LEVELS = [
  { level: 1, min: 0, max: 99 },
  { level: 2, min: 100, max: 249 },
  { level: 3, min: 250, max: 499 },
  { level: 4, min: 500, max: 999 },
  { level: 5, min: 1000, max: Infinity },
];

export function levelFromXP(xp: number) {
  const current = LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0];
  const next = LEVELS.find((l) => l.min > current.min);
  const intoLevel = xp - current.min;
  const span = next ? next.min - current.min : 1;
  const progressPct = next ? Math.min(100, Math.round((intoLevel / span) * 100)) : 100;
  return {
    level: current.level,
    nextLevelAt: next?.min ?? null,
    xpIntoLevel: intoLevel,
    xpForNext: next ? next.min - xp : 0,
    progressPct,
  };
}

export interface CompletionRecord {
  id: string;
  xp: number;
  completedAt: string; // ISO date
}

export function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function computeStreak(history: CompletionRecord[]): number {
  if (!history.length) return 0;
  const days = new Set(history.map((h) => h.completedAt.slice(0, 10)));
  let streak = 0;
  const cur = new Date();
  // If nothing today, allow yesterday to start the streak count
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
