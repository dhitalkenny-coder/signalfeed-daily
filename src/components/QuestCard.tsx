import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, Clock, ExternalLink, Sparkles, Zap } from "lucide-react";
import type { Quest } from "@/lib/quests-data";

interface Props {
  quest: Quest;
  index: number;
  saved: boolean;
  completed: boolean;
  onComplete: (id: string, xp: number) => void;
  onToggleSave: (id: string) => void;
}

export function QuestCard({ quest, index, saved, completed, onComplete, onToggleSave }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-elegant transition-all ${
        completed
          ? "border-signal/40 bg-signal/5"
          : "border-border bg-card-gradient"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/60 border border-border text-xl">
            {quest.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground truncate">
              {quest.category}
            </p>
            <p className="text-[11px] text-signal mt-0.5 inline-flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> +{quest.xpReward} XP
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleSave(quest.id)}
          aria-label={saved ? "Unsave" : "Save"}
          className={`shrink-0 rounded-lg p-2 transition-colors ${
            saved ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
        </button>
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug text-balance">
        {quest.questTitle}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{quest.summary}</p>

      <div className="mt-3 rounded-xl border border-signal/30 bg-signal/5 p-3 text-sm">
        <div className="text-[11px] font-medium uppercase tracking-widest text-signal flex items-center gap-1.5">
          <Zap className="h-3 w-3" /> Do this today
        </div>
        <p className="mt-1 text-foreground/90">{quest.doThisToday}</p>
      </div>

      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
        <span className="text-foreground/80 font-medium">Why it matters: </span>
        {quest.whyItMatters}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {quest.estimatedTime} · {quest.difficulty}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2">
        <button
          onClick={() => !completed && onComplete(quest.id, quest.xpReward)}
          disabled={completed}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
            completed
              ? "bg-signal/15 text-signal border border-signal/40 cursor-default"
              : "bg-signal-gradient text-signal-foreground shadow-glow"
          }`}
        >
          {completed ? (
            <>
              <Check className="h-4 w-4" /> Quest complete
            </>
          ) : (
            <>Complete Quest · +{quest.xpReward} XP</>
          )}
        </button>
        {quest.optionalSourceUrl && (
          <a
            href={quest.optionalSourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition"
          >
            Optional source: {quest.optionalSourceTitle ?? "Read / Watch"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
