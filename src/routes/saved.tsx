import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { SignalCard } from "@/components/SignalCard";
import { DEFAULT_SIGNALS, type Signal } from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import type { QuizAnswer } from "./feed";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved · SignalFeed" }] }),
  component: Saved,
});

function Saved() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);
  const [learned, setLearned] = useLocalStorage<{ id: string; at: string }[]>("sf:learned", []);
  const [answers, setAnswers] = useLocalStorage<QuizAnswer[]>("sf:answers", []);
  const [, setPoints] = useLocalStorage<number>("sf:points", 0);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const saved = useMemo(() => all.filter((s) => savedIds.includes(s.id)), [all, savedIds]);
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

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Library</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">Saved signals</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {saved.length} saved for later
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">Nothing saved yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the bookmark on any signal to save it for later.
          </p>
          <Link
            to="/feed"
            className="mt-5 inline-block text-sm text-signal underline-offset-4 hover:underline"
          >
            Go to your feed →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((signal, i) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              index={i}
              saved
              learned={learnedIds.has(signal.id)}
              answeredCorrect={answerMap.has(signal.id) ? answerMap.get(signal.id)! : null}
              onToggleSave={toggleSave}
              onMarkLearned={markLearned}
              onAnswer={onAnswer}
            />
          ))}
        </div>
      )}
    </main>
  );
}
