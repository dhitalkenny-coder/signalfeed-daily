import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Reel } from "@/components/Reel";
import { DEFAULT_SIGNALS, type Category, type Signal } from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Feed · SignalFeed" }] }),
  component: Feed,
});

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}
function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

function pickFeed(all: Signal[], interests: Category[]) {
  const pool = interests.length ? all.filter((s) => interests.includes(s.category)) : all;
  const source = pool.length ? pool : all;
  const seed = todayKey();
  return [...source].sort((a, b) => hash(a.id + seed) - hash(b.id + seed));
}

export interface QuizAnswer {
  id: string;       // signal id
  qIndex: number;   // question index
  picked: number;
  correct: boolean;
  at: string;
}

function Feed() {
  const [interests] = useLocalStorage<Category[]>("sf:interests", []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [learned, setLearned] = useLocalStorage<{ id: string; at: string }[]>("sf:learned", []);
  const [answers, setAnswers] = useLocalStorage<QuizAnswer[]>("sf:answers", []);
  const [watched, setWatched] = useLocalStorage<{ id: string; at: string }[]>("sf:watched", []);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const feed = useMemo(() => pickFeed(all, interests), [all, interests]);
  const learnedIds = useMemo(() => new Set(learned.map((l) => l.id)), [learned]);

  const toggleSave = (id: string) =>
    setSavedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const markLearned = (id: string) => {
    if (learnedIds.has(id)) return;
    setLearned((p) => [...p, { id, at: new Date().toISOString() }]);
    setWatched((p) =>
      p.some((w) => w.id === id) ? p : [...p, { id, at: new Date().toISOString() }],
    );
  };

  const onAnswer = (id: string, qIndex: number, picked: number, correct: boolean) => {
    setAnswers((prev) => {
      if (prev.some((a) => a.id === id && a.qIndex === qIndex && a.correct)) return prev;
      return [...prev, { id, qIndex, picked, correct, at: new Date().toISOString() }];
    });
    setWatched((p) =>
      p.some((w) => w.id === id) ? p : [...p, { id, at: new Date().toISOString() }],
    );
  };

  return (
    <main
      className="fixed inset-0 overflow-y-scroll bg-background"
      style={{ scrollSnapType: "y mandatory", overscrollBehaviorY: "contain" }}
    >
      {feed.map((signal) => (
        <Reel
          key={signal.id}
          signal={signal}
          saved={savedIds.includes(signal.id)}
          learned={learnedIds.has(signal.id)}
          onToggleSave={toggleSave}
          onMarkLearned={markLearned}
          onAnswer={onAnswer}
        />
      ))}
      {/* End sentinel */}
      <section
        className="relative h-[100dvh] w-full snap-start flex items-center justify-center px-8"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="text-center">
          <p className="text-base font-medium">That's your feed for today.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Come back tomorrow for fresh reels.
          </p>
        </div>
      </section>
    </main>
  );
}
