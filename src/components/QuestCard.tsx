import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, Clock, ExternalLink, Zap } from "lucide-react";
import { CATEGORY_META, type Quest } from "@/lib/quests-data";

interface Props {
  quest: Quest;
  index: number;
  saved: boolean;
  completed: boolean;
  onComplete: (id: string, xp: number) => void;
  onToggleSave: (id: string) => void;
}

export function QuestCard({ quest, index, saved, completed, onComplete, onToggleSave }: Props) {
  const meta = CATEGORY_META[quest.category];
  const Icon = meta.Icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
        completed
          ? "border-signal/30 bg-signal/[0.04]"
          : "border-border bg-card-gradient shadow-elegant"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/70 border border-border ${meta.tone}`}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground truncate">
              {quest.category}
            </p>
            <p className="text-[10.5px] mt-0.5 inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-1.5 py-0.5 text-gold">
              +{quest.xpReward} XP
            </p>
          </div>
        </div>
        <button
          onClick={() => onToggleSave(quest.id)}
          aria-label={saved ? "Unsave" : "Save"}
          className={`shrink-0 rounded-lg p-1.5 transition-colors ${
            saved ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {saved ? <BookmarkCheck className="h-[18px] w-[18px]" /> : <Bookmark className="h-[18px] w-[18px]" />}
        </button>
      </div>

      <h2 className="mt-3 text-[17px] font-semibold leading-snug text-balance">
        {quest.questTitle}
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{quest.summary}</p>

      <div className="mt-3 rounded-xl border border-signal/25 bg-signal/[0.06] px-3 py-2.5">
        <div className="text-[10.5px] font-medium uppercase tracking-widest text-signal flex items-center gap-1.5">
          <Zap className="h-3 w-3" /> Do this today
        </div>
        <p className="mt-1 text-[13.5px] text-foreground/90 leading-snug">{quest.doThisToday}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> {quest.estimatedTime} · {quest.difficulty}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2">
        <button
          onClick={() => !completed && onComplete(quest.id, quest.xpReward)}
          disabled={completed}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            completed
              ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
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
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition"
          >
            Optional source: {quest.optionalSourceTitle ?? "Read / Watch"}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
