import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { CATEGORIES, type Category, type FeedPost } from "@/lib/feed-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · SignalFeed" }] }),
  component: Admin,
});

const empty = {
  title: "", platform: "YouTube", url: "", category: "AI" as Category,
  summary: "", whyUseful: "", actionStep: "", timeToConsume: "10 min",
  difficulty: "Beginner" as FeedPost["difficulty"], tags: "",
};

function Admin() {
  const [posts, setPosts] = useLocalStorage<FeedPost[]>("sf:posts", []);
  const [form, setForm] = useState(empty);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.url || !form.summary) return;
    const post: FeedPost = {
      id: `c-${Date.now()}`,
      title: form.title,
      platform: form.platform,
      url: form.url,
      category: form.category,
      summary: form.summary,
      whyUseful: form.whyUseful,
      actionStep: form.actionStep,
      timeToConsume: form.timeToConsume,
      difficulty: form.difficulty,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    setPosts((prev) => [post, ...prev]);
    setForm(empty);
  };

  const remove = (id: string) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const inputCls = "w-full rounded-xl border border-border bg-input/40 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-signal/60 focus:ring-2 focus:ring-signal/20 transition";

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Curator</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Add to the feed</h1>
        <p className="mt-2 text-sm text-muted-foreground">Stored locally for now. Wire up Lovable Cloud later.</p>
      </header>

      <form onSubmit={submit} className="grid gap-3 rounded-2xl border border-border bg-card-gradient p-5">
        <input className={inputCls} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input className={inputCls} placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} />
          <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <textarea className={inputCls} rows={2} placeholder="Summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Why this is useful" value={form.whyUseful} onChange={(e) => setForm({ ...form, whyUseful: e.target.value })} />
        <textarea className={inputCls} rows={2} placeholder="Action step" value={form.actionStep} onChange={(e) => setForm({ ...form, actionStep: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Time (e.g. 10 min)" value={form.timeToConsume} onChange={(e) => setForm({ ...form, timeToConsume: e.target.value })} />
          <select className={inputCls} value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as FeedPost["difficulty"] })}>
            <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
          </select>
        </div>
        <input className={inputCls} placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <button type="submit" className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-3 text-sm font-semibold text-signal-foreground shadow-glow active:scale-[0.98] transition-transform">
          <Plus className="h-4 w-4" /> Publish to feed
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your posts ({posts.length})</h2>
        <div className="mt-3 grid gap-2">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.category} · {p.platform}</p>
              </div>
              <button onClick={() => remove(p.id)} className="rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {posts.length === 0 && (
            <p className="text-xs text-muted-foreground">No custom posts yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
