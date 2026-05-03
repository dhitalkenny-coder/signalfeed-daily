import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { FeedCard } from "@/components/FeedCard";
import { MOCK_POSTS, type Category, type FeedPost } from "@/lib/feed-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Today's feed · SignalFeed" }] }),
  component: Feed,
});

function Feed() {
  const [interests] = useLocalStorage<Category[]>("sf:interests", []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customPosts] = useLocalStorage<FeedPost[]>("sf:posts", []);

  const allPosts = useMemo(() => [...customPosts, ...MOCK_POSTS], [customPosts]);

  const todays = useMemo(() => {
    const filtered = interests.length
      ? allPosts.filter((p) => interests.includes(p.category))
      : allPosts;
    return (filtered.length ? filtered : allPosts).slice(0, 10);
  }, [allPosts, interests]);

  const toggleSave = (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const today = new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });

  return (
    <main className="min-h-screen pb-28 px-5 pt-10 mx-auto max-w-md">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-xs uppercase tracking-[0.18em] text-signal">{today}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Today's signal</h1>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-card-gradient px-4 py-3">
          <span className="text-sm text-muted-foreground">Daily limit</span>
          <span className="text-sm font-medium">{todays.length} / 10 useful posts</span>
        </div>
        {!interests.length && (
          <p className="mt-3 text-xs text-muted-foreground">
            <Link to="/interests" className="text-signal underline-offset-4 hover:underline">Pick interests</Link>
            {" "}to personalize this feed.
          </p>
        )}
      </motion.header>

      <div className="grid gap-4">
        {todays.map((post, i) => (
          <FeedCard
            key={post.id}
            post={post}
            index={i}
            saved={savedIds.includes(post.id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-10 rounded-2xl border border-border bg-card-gradient p-5 text-center"
      >
        <p className="text-sm font-medium">That's the signal for today.</p>
        <p className="mt-1 text-xs text-muted-foreground">Come back tomorrow. Go build something.</p>
      </motion.div>
    </main>
  );
}
