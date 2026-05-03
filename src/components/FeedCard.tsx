import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, Clock, Zap } from "lucide-react";
import type { FeedPost } from "@/lib/feed-data";

interface Props {
  post: FeedPost;
  index: number;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

export function FeedCard({ post, index, saved, onToggleSave }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card-gradient p-5 shadow-elegant"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-signal" />
          {post.category}
        </span>
        <span>{post.platform}</span>
      </div>

      <h2 className="mt-3 text-xl font-semibold leading-snug text-balance">
        {post.title}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{post.summary}</p>

      <div className="mt-4 rounded-xl border border-border/70 bg-background/40 p-3 text-sm">
        <div className="text-[11px] font-medium uppercase tracking-widest text-signal">Why it's useful</div>
        <p className="mt-1 text-foreground/90">{post.whyUseful}</p>
      </div>

      <div className="mt-3 rounded-xl border border-signal/30 bg-signal/5 p-3 text-sm">
        <div className="text-[11px] font-medium uppercase tracking-widest text-signal flex items-center gap-1.5">
          <Zap className="h-3 w-3" /> Action step
        </div>
        <p className="mt-1 text-foreground/90">{post.actionStep}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((t) => (
          <span key={t} className="rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
            #{t}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {post.timeToConsume} · {post.difficulty}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-signal-gradient px-4 py-2.5 text-sm font-medium text-signal-foreground transition-transform active:scale-[0.98] shadow-glow"
        >
          Open <ExternalLink className="h-4 w-4" />
        </a>
        <button
          onClick={() => onToggleSave(post.id)}
          aria-label={saved ? "Unsave" : "Save"}
          className={`inline-flex items-center justify-center rounded-xl border px-3.5 transition-colors ${
            saved
              ? "border-signal/60 bg-signal/10 text-signal"
              : "border-border bg-secondary/60 text-foreground hover:bg-secondary"
          }`}
        >
          {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>
    </motion.article>
  );
}
