import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { FeedCard } from "@/components/FeedCard";
import { MOCK_POSTS, type FeedPost } from "@/lib/feed-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved · SignalFeed" }] }),
  component: Saved,
});

function Saved() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customPosts] = useLocalStorage<FeedPost[]>("sf:posts", []);

  const all = useMemo(() => [...customPosts, ...MOCK_POSTS], [customPosts]);
  const saved = useMemo(() => all.filter((p) => savedIds.includes(p.id)), [all, savedIds]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Library</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Saved signal</h1>
        <p className="mt-2 text-sm text-muted-foreground">{saved.length} item{saved.length === 1 ? "" : "s"}</p>
      </header>

      {saved.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">Nothing saved yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Tap the bookmark on any post in your feed.</p>
          <Link to="/feed" className="mt-5 inline-block text-sm text-signal underline-offset-4 hover:underline">
            Go to today's feed →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {saved.map((post, i) => (
            <FeedCard key={post.id} post={post} index={i} saved onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </main>
  );
}
