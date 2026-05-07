import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CATEGORIES,
  type Category,
  type ContentType,
  type Difficulty,
  type Signal,
} from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SignalFeed" }] }),
  component: Admin,
});

const CONTENT_TYPES: ContentType[] = ["Video", "Article", "Tool", "Idea", "News", "Tip"];

const empty = {
  title: "",
  category: "AI & Tech" as Category,
  contentType: "Tip" as ContentType,
  sourceName: "",
  sourceUrl: "",
  shortSummary: "",
  learnInsideApp: "",
  whyItMatters: "",
  quickCheckQuestion: "",
  options: "", // newline separated
  correctAnswer: 0,
  explanationAfterAnswer: "",
  optionalAction: "",
  estimatedTime: "10 min",
  difficulty: "Easy" as Difficulty,
  tags: "",
};

function Admin() {
  const [signals, setSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);
  const [form, setForm] = useState(empty);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const opts = form.options.split("\n").map((o) => o.trim()).filter(Boolean);
    if (!form.title || !form.shortSummary || !form.learnInsideApp || opts.length < 2) return;
    const signal: Signal = {
      id: `c-${Date.now()}`,
      title: form.title,
      category: form.category,
      contentType: form.contentType,
      sourceName: form.sourceName || undefined,
      sourceUrl: form.sourceUrl || undefined,
      shortSummary: form.shortSummary,
      learnInsideApp: form.learnInsideApp,
      whyItMatters: form.whyItMatters,
      quickCheckQuestion: form.quickCheckQuestion,
      quickCheckOptions: opts,
      correctAnswer: Math.min(Number(form.correctAnswer) || 0, opts.length - 1),
      explanationAfterAnswer: form.explanationAfterAnswer,
      optionalAction: form.optionalAction || undefined,
      estimatedTime: form.estimatedTime,
      difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setSignals((prev) => [signal, ...prev]);
    setForm(empty);
  };

  const remove = (id: string) => setSignals((prev) => prev.filter((s) => s.id !== id));

  const inputCls =
    "w-full rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-signal/60 focus:ring-2 focus:ring-signal/20 transition";

  return (
    <main className="min-h-screen pb-16 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Curator</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a signal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stored locally for now. Hidden from public navigation.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border bg-card-gradient p-5">
        <input
          className={inputCls}
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            className={inputCls}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
          >
            {CATEGORIES.map((c) => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
          <select
            className={inputCls}
            value={form.contentType}
            onChange={(e) => setForm({ ...form, contentType: e.target.value as ContentType })}
          >
            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input
          className={inputCls}
          placeholder="Source name (optional)"
          value={form.sourceName}
          onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
        />
        <input
          className={inputCls}
          placeholder="Source URL (optional)"
          value={form.sourceUrl}
          onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
        />
        <textarea className={inputCls} rows={2} placeholder="Short summary"
          value={form.shortSummary}
          onChange={(e) => setForm({ ...form, shortSummary: e.target.value })} />
        <textarea className={inputCls} rows={3} placeholder="Learn inside the app"
          value={form.learnInsideApp}
          onChange={(e) => setForm({ ...form, learnInsideApp: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Why it matters"
          value={form.whyItMatters}
          onChange={(e) => setForm({ ...form, whyItMatters: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Quick check question"
          value={form.quickCheckQuestion}
          onChange={(e) => setForm({ ...form, quickCheckQuestion: e.target.value })} />
        <textarea className={inputCls} rows={3} placeholder="Options (one per line)"
          value={form.options}
          onChange={(e) => setForm({ ...form, options: e.target.value })} />
        <input className={inputCls} type="number" min={0}
          placeholder="Correct answer index (0-based)"
          value={form.correctAnswer}
          onChange={(e) => setForm({ ...form, correctAnswer: Number(e.target.value) })} />
        <textarea className={inputCls} rows={2} placeholder="Explanation after answer"
          value={form.explanationAfterAnswer}
          onChange={(e) => setForm({ ...form, explanationAfterAnswer: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Optional action (optional)"
          value={form.optionalAction}
          onChange={(e) => setForm({ ...form, optionalAction: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Estimated time"
            value={form.estimatedTime}
            onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} />
          <select className={inputCls} value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
            <option>Easy</option><option>Medium</option><option>Deep</option>
          </select>
        </div>
        <input className={inputCls} placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <button
          type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-3 text-sm font-semibold text-signal-foreground shadow-glow active:scale-[0.98] transition-transform"
        >
          <Plus className="h-4 w-4" /> Publish signal
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your signals ({signals.length})
        </h2>
        <div className="mt-3 grid gap-2">
          {signals.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.category} · {s.contentType}</p>
              </div>
              <button
                onClick={() => remove(s.id)}
                className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {signals.length === 0 && (
            <p className="text-xs text-muted-foreground">No custom signals yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
