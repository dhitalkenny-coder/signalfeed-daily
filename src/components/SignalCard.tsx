import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { CATEGORY_META, type Signal } from "@/lib/signals-data";

interface Props {
  signal: Signal;
  index: number;
  saved: boolean;
  learned: boolean;
  answeredCorrect: boolean | null;
  onMarkLearned: (id: string) => void;
  onToggleSave: (id: string) => void;
  onAnswer: (id: string, optionIndex: number, correct: boolean) => void;
}

export function SignalCard({
  signal,
  index,
  saved,
  learned,
  answeredCorrect,
  onMarkLearned,
  onToggleSave,
  onAnswer,
}: Props) {
  const meta = CATEGORY_META[signal.category];
  const Icon = meta.Icon;
  const [picked, setPicked] = useState<number | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  const thumbGradient: Record<string, string> = {
    "AI & Tech": "from-cyan-500/20 via-sky-500/10 to-transparent",
    "Money": "from-emerald-500/20 via-teal-500/10 to-transparent",
    "Creativity": "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    "News & Current Affairs": "from-slate-400/20 via-slate-500/10 to-transparent",
    "Mind & Philosophy": "from-indigo-500/20 via-violet-500/10 to-transparent",
    "Health & Lifestyle": "from-green-500/20 via-emerald-500/10 to-transparent",
    "Cooking & Skills": "from-orange-500/20 via-amber-500/10 to-transparent",
    "Business": "from-amber-500/15 via-yellow-500/5 to-transparent",
  };
  const grad = thumbGradient[signal.category] ?? "from-signal/15 to-transparent";

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    onAnswer(signal.id, i, i === signal.correctAnswer);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border p-4 transition-all ${
        learned
          ? "border-signal/30 bg-signal/[0.04]"
          : "border-border bg-card-gradient shadow-elegant"
      }`}
    >
      {/* Header chips */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background/70 border border-border ${meta.tone}`}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex flex-col">
            <span className="text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground truncate">
              {signal.category}
            </span>
            <span className="text-[10.5px] mt-0.5 inline-flex w-fit items-center rounded-full border border-border bg-background/40 px-1.5 py-0.5 text-muted-foreground">
              {signal.contentType}
            </span>
          </div>
        </div>
        <button
          onClick={() => onToggleSave(signal.id)}
          aria-label={saved ? "Unsave" : "Save"}
          className={`shrink-0 rounded-lg p-1.5 transition-colors ${
            saved ? "text-signal" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {saved ? <BookmarkCheck className="h-[18px] w-[18px]" /> : <Bookmark className="h-[18px] w-[18px]" />}
        </button>
      </div>

      {/* Title */}
      <h2 className="mt-3 text-[17px] font-semibold leading-snug text-balance">
        {signal.title}
      </h2>
      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
        {signal.shortSummary}
      </p>

      {/* Category thumbnail — gradient placeholder */}
      <div className={`relative mt-3 h-24 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${grad}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Icon className={`h-10 w-10 opacity-80 ${meta.tone}`} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            {signal.contentType}
          </span>
        </div>
      </div>

      {/* Learn inside the app */}
      <div className="mt-3 rounded-xl border border-border bg-background/30 px-3 py-2.5">
        <div className="text-[10.5px] font-medium uppercase tracking-widest text-foreground/70 flex items-center gap-1.5">
          <Lightbulb className="h-3 w-3 text-gold" /> Learn
        </div>
        <p className="mt-1 text-[13px] text-foreground/90 leading-relaxed">{signal.learnInsideApp}</p>
        <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
          <span className="text-foreground/70 font-medium">Why it matters: </span>
          {signal.whyItMatters}
        </p>
      </div>

      {/* Quick check */}
      <div className="mt-3 rounded-xl border border-focus/30 bg-gradient-to-br from-focus/[0.08] to-focus/[0.02] px-3.5 py-3 shadow-[0_0_0_1px_rgba(56,189,248,0.04)]">
        <button
          onClick={() => setShowCheck((v) => !v)}
          className="w-full text-left flex items-center justify-between gap-2 group/qc"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-focus flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-focus/15">
              <HelpCircle className="h-3 w-3" />
            </span>
            Quick check
          </span>
          <span className={`text-[11px] inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors ${
            answeredCorrect === true
              ? "bg-signal/15 text-signal"
              : answeredCorrect === false
              ? "bg-destructive/15 text-destructive"
              : "bg-focus/15 text-focus group-hover/qc:bg-focus/25"
          }`}>
            {showCheck ? "Hide" : answeredCorrect === null ? "Tap to answer" : answeredCorrect ? "Correct" : "Try again"}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {showCheck && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="mt-2 text-[13px] text-foreground/90 leading-snug">
                {signal.quickCheckQuestion}
              </p>
              <div className="mt-2 grid gap-1.5">
                {signal.quickCheckOptions.map((opt, i) => {
                  const isCorrect = i === signal.correctAnswer;
                  const isPicked = picked === i;
                  const reveal = picked !== null;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePick(i)}
                      disabled={picked !== null}
                      className={`text-left text-[13px] rounded-lg border px-3 py-2 transition-all ${
                        reveal && isCorrect
                          ? "border-signal/60 bg-signal/10 text-foreground"
                          : reveal && isPicked && !isCorrect
                          ? "border-destructive/60 bg-destructive/10 text-foreground"
                          : "border-border bg-background/40 text-foreground/85 hover:border-muted-foreground/50"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {picked !== null && (
                <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
                  {signal.explanationAfterAnswer}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Optional action */}
      {signal.optionalAction && (
        <div className="mt-3 rounded-xl border border-border/70 bg-background/20 px-3 py-2">
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" /> Try this · optional
          </div>
          <p className="mt-1 text-[12.5px] text-foreground/80 leading-snug">{signal.optionalAction}</p>
        </div>
      )}

      {/* Meta */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3 w-3" /> {signal.estimatedTime} · {signal.difficulty}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 grid gap-2">
        <button
          onClick={() => !learned && onMarkLearned(signal.id)}
          disabled={learned}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all active:scale-[0.98] ${
            learned
              ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
              : "bg-signal-gradient text-signal-foreground shadow-glow"
          }`}
        >
          {learned ? (
            <>
              <Check className="h-4 w-4" /> Learned
            </>
          ) : (
            <>Mark learned</>
          )}
        </button>
        {signal.sourceUrl && (
          <a
            href={signal.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] text-muted-foreground hover:text-foreground transition"
          >
            {signal.contentType === "Video" ? "Watch" : "Read"} source
            {signal.sourceName ? `: ${signal.sourceName}` : ""}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
