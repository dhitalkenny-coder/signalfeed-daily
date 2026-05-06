import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CATEGORIES, type Category, type Difficulty, type Quest } from "@/lib/quests-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SignalFeed" }] }),
  component: Admin,
});

const empty = {
  questTitle: "",
  category: "AI & Technology" as Category,
  summary: "",
  whyItMatters: "",
  doThisToday: "",
  difficulty: "Beginner" as Difficulty,
  xpReward: 10,
  estimatedTime: "10 min",
  optionalSourceTitle: "",
  optionalSourceUrl: "",
  tags: "",
  icon: "✨",
};

function Admin() {
  const [quests, setQuests] = useLocalStorage<Quest[]>("sf:custom-quests", []);
  const [form, setForm] = useState(empty);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.questTitle || !form.summary || !form.doThisToday) return;
    const quest: Quest = {
      id: `c-${Date.now()}`,
      questTitle: form.questTitle,
      category: form.category,
      summary: form.summary,
      whyItMatters: form.whyItMatters,
      doThisToday: form.doThisToday,
      difficulty: form.difficulty,
      xpReward: Number(form.xpReward) || 10,
      estimatedTime: form.estimatedTime,
      optionalSourceTitle: form.optionalSourceTitle || undefined,
      optionalSourceUrl: form.optionalSourceUrl || undefined,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      icon: form.icon || "✨",
    };
    setQuests((prev) => [quest, ...prev]);
    setForm(empty);
  };

  const remove = (id: string) => setQuests((prev) => prev.filter((q) => q.id !== id));

  const inputCls =
    "w-full rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-signal/60 focus:ring-2 focus:ring-signal/20 transition";

  return (
    <main className="min-h-screen pb-16 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Curator</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a quest</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stored locally for now. Hidden from public navigation.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border bg-card-gradient p-5">
        <input
          className={inputCls}
          placeholder="Quest title"
          value={form.questTitle}
          onChange={(e) => setForm({ ...form, questTitle: e.target.value })}
        />
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <input
            className={inputCls}
            placeholder="Icon"
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
          />
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className={inputCls}
          rows={2}
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <textarea
          className={inputCls}
          rows={2}
          placeholder="Why it matters"
          value={form.whyItMatters}
          onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })}
        />
        <textarea
          className={inputCls}
          rows={2}
          placeholder="Do this today"
          value={form.doThisToday}
          onChange={(e) => setForm({ ...form, doThisToday: e.target.value })}
        />
        <div className="grid grid-cols-3 gap-3">
          <select
            className={inputCls}
            value={form.difficulty}
            onChange={(e) =>
              setForm({ ...form, difficulty: e.target.value as Difficulty })
            }
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input
            className={inputCls}
            type="number"
            placeholder="XP"
            value={form.xpReward}
            onChange={(e) => setForm({ ...form, xpReward: Number(e.target.value) })}
          />
          <input
            className={inputCls}
            placeholder="Time"
            value={form.estimatedTime}
            onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
          />
        </div>
        <input
          className={inputCls}
          placeholder="Optional source title"
          value={form.optionalSourceTitle}
          onChange={(e) => setForm({ ...form, optionalSourceTitle: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Optional source URL"
          value={form.optionalSourceUrl}
          onChange={(e) => setForm({ ...form, optionalSourceUrl: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-3 text-sm font-semibold text-signal-foreground shadow-glow active:scale-[0.98] transition-transform"
        >
          <Plus className="h-4 w-4" /> Publish quest
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your quests ({quests.length})
        </h2>
        <div className="mt-3 grid gap-2">
          {quests.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {q.icon} {q.questTitle}
                </p>
                <p className="text-xs text-muted-foreground">
                  {q.category} · +{q.xpReward} XP
                </p>
              </div>
              <button
                onClick={() => remove(q.id)}
                className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {quests.length === 0 && (
            <p className="text-xs text-muted-foreground">No custom quests yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
