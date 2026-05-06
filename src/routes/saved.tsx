import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { QuestCard } from "@/components/QuestCard";
import { DEFAULT_QUESTS, type Quest } from "@/lib/quests-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import type { CompletionRecord } from "@/lib/progress";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved quests · SignalFeed" }] }),
  component: Saved,
});

function Saved() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customQuests] = useLocalStorage<Quest[]>("sf:custom-quests", []);
  const [history, setHistory] = useLocalStorage<CompletionRecord[]>("sf:history", []);
  const [, setXp] = useLocalStorage<number>("sf:xp", 0);

  const all = useMemo(() => [...customQuests, ...DEFAULT_QUESTS], [customQuests]);
  const saved = useMemo(() => all.filter((q) => savedIds.includes(q.id)), [all, savedIds]);
  const completedIds = useMemo(() => new Set(history.map((h) => h.id)), [history]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const complete = (id: string, reward: number) => {
    if (completedIds.has(id)) return;
    setHistory((prev) => [...prev, { id, xp: reward, completedAt: new Date().toISOString() }]);
    setXp((prev) => prev + reward);
  };

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Saved quests</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {saved.length} quest{saved.length === 1 ? "" : "s"} saved for later
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">Nothing saved yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the bookmark on any quest to save it for later.
          </p>
          <Link
            to="/quests"
            className="mt-5 inline-block text-sm text-signal underline-offset-4 hover:underline"
          >
            Go to today's quests →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((quest, i) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              index={i}
              saved
              completed={completedIds.has(quest.id)}
              onToggleSave={toggleSave}
              onComplete={complete}
            />
          ))}
        </div>
      )}
    </main>
  );
}
