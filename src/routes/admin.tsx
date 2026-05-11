import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CATEGORIES,
  DIFFICULTIES,
  type Category,
  type ContentType,
  type Difficulty,
  type Signal,
  type QuizQuestion,
} from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SignalFeed" }] }),
  component: Admin,
});

const CONTENT_TYPES: ContentType[] = ["Shorts", "Video", "Article", "Tool", "Idea", "News", "Tip"];

type DraftQuestion = { question: string; options: string; correctAnswer: number; explanation: string };

const emptyQ = (): DraftQuestion => ({
  question: "",
  options: "",
  correctAnswer: 0,
  explanation: "",
});

const empty = {
  title: "",
  hook: "",
  category: "Skills" as Category,
  difficulty: "Beginner" as Difficulty,
  contentType: "Shorts" as ContentType,
  youtubeEmbedUrl: "",
  sourceName: "",
  sourceUrl: "",
  tags: "",
  questions: [emptyQ(), emptyQ()],
};

function Admin() {
  const [signals, setSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);
  const [form, setForm] = useState(empty);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const questions: QuizQuestion[] = form.questions.flatMap((q) => {
      const options = q.options.split("\n").map((o) => o.trim()).filter(Boolean);
      if (!q.question || options.length < 2) return [] as QuizQuestion[];
      return [{
        question: q.question,
        options,
        correctAnswer: Math.min(Number(q.correctAnswer) || 0, options.length - 1),
        explanation: q.explanation,
      }];
    });

    if (!form.title || !questions.length) return;

    const signal: Signal = {
      id: `c-${Date.now()}`,
      title: form.title,
      hook: form.hook,
      category: form.category,
      difficulty: form.difficulty,
      contentType: form.contentType,
      youtubeEmbedUrl: form.youtubeEmbedUrl || undefined,
      sourceName: form.sourceName || undefined,
      sourceUrl: form.sourceUrl || undefined,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined,
      questions,
    };
    setSignals((prev) => [signal, ...prev]);
    setForm(empty);
  };

  const remove = (id: string) => setSignals((prev) => prev.filter((s) => s.id !== id));

  const inputCls =
    "w-full rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-signal/60 focus:ring-2 focus:ring-signal/20 transition";

  const setQ = (i: number, patch: Partial<DraftQuestion>) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, idx) => (idx === i ? { ...q, ...patch } : q)),
    }));

  return (
    <main className="min-h-[100dvh] pb-16 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Curator</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add a reel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Stored locally. Hidden from public navigation.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border bg-card-gradient p-5">
        <input className={inputCls} placeholder="Title"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={inputCls} placeholder="One-line hook"
          value={form.hook} onChange={(e) => setForm({ ...form, hook: e.target.value })} />
        <div className="grid grid-cols-3 gap-2">
          <select className={inputCls} value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
            {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
          <select className={inputCls} value={form.difficulty}
            onChange={(e) => setForm({ ...form, difficulty: e.target.value as Difficulty })}>
            {DIFFICULTIES.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
          </select>
          <select className={inputCls} value={form.contentType}
            onChange={(e) => setForm({ ...form, contentType: e.target.value as ContentType })}>
            {CONTENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <input className={inputCls} placeholder="YouTube embed URL (https://www.youtube.com/embed/ID?...)"
          value={form.youtubeEmbedUrl} onChange={(e) => setForm({ ...form, youtubeEmbedUrl: e.target.value })} />
        <input className={inputCls} placeholder="Source name (optional)"
          value={form.sourceName} onChange={(e) => setForm({ ...form, sourceName: e.target.value })} />
        <input className={inputCls} placeholder="Source URL (optional)"
          value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} />
        <input className={inputCls} placeholder="Tags (comma separated)"
          value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />

        {form.questions.map((q, i) => (
          <div key={i} className="grid gap-2 rounded-xl border border-border bg-background/40 p-3">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Question {i + 1}</p>
            <input className={inputCls} placeholder="Question"
              value={q.question} onChange={(e) => setQ(i, { question: e.target.value })} />
            <textarea className={inputCls} rows={3} placeholder="Options (one per line, 3 ideal)"
              value={q.options} onChange={(e) => setQ(i, { options: e.target.value })} />
            <input className={inputCls} type="number" min={0} placeholder="Correct option index (0-based)"
              value={q.correctAnswer} onChange={(e) => setQ(i, { correctAnswer: Number(e.target.value) })} />
            <input className={inputCls} placeholder="Short explanation"
              value={q.explanation} onChange={(e) => setQ(i, { explanation: e.target.value })} />
          </div>
        ))}

        <button type="submit"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-3 text-sm font-semibold text-signal-foreground shadow-glow active:scale-[0.98] transition-transform">
          <Plus className="h-4 w-4" /> Publish reel
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Your reels ({signals.length})
        </h2>
        <div className="mt-3 grid gap-2">
          {signals.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">{s.category} · {s.difficulty} · {s.contentType}</p>
              </div>
              <button onClick={() => remove(s.id)}
                className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {signals.length === 0 && (
            <p className="text-xs text-muted-foreground">No custom reels yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
