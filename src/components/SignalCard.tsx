import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Play,
  ShieldCheck,
  XCircle,
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

const thumbGradient: Record<string, string> = {
  "AI & Tech": "from-cyan-500/30 via-sky-600/15 to-transparent",
  "Money": "from-emerald-500/30 via-teal-600/15 to-transparent",
  "Creativity": "from-purple-500/30 via-fuchsia-600/15 to-transparent",
  "News & Current Affairs": "from-slate-400/25 via-slate-600/15 to-transparent",
  "Mind & Philosophy": "from-indigo-500/30 via-violet-600/15 to-transparent",
  "Health & Lifestyle": "from-green-500/30 via-emerald-600/15 to-transparent",
  "Cooking & Skills": "from-orange-500/30 via-amber-600/15 to-transparent",
  "Business": "from-amber-500/25 via-yellow-600/10 to-transparent",
};

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
  const grad = thumbGradient[signal.category] ?? "from-signal/15 to-transparent";

  const [picked, setPicked] = useState<number | null>(null);
  const [playVideo, setPlayVideo] = useState(false);
  const [showDeeper, setShowDeeper] = useState(false);

  useEffect(() => {
    if (answeredCorrect === true && picked === null) {
      setPicked(signal.correctAnswer);
    }
  }, [answeredCorrect, signal.correctAnswer, picked]);

  const isCorrect = picked !== null && picked === signal.correctAnswer;
  const isWrong = picked !== null && picked !== signal.correctAnswer;
  const attempted = picked !== null || answeredCorrect !== null;

  const handlePick = (i: number) => {
    if (isCorrect) return;
    setPicked(i);
    onAnswer(signal.id, i, i === signal.correctAnswer);
  };

  const resetCheck = () => setPicked(null);

  const isVideo = !!signal.videoUrl;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 6) * 0.03, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-2xl border transition-all ${
        learned
          ? "border-signal/30 bg-signal/[0.04]"
          : "border-border bg-card shadow-elegant"
      }`}
    >
      {/* Video / thumbnail — dominant top area (~16:9) */}
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        {isVideo && playVideo ? (
          <iframe
            src={`${signal.videoUrl}?autoplay=1&rel=0&modestbranding=1`}
            title={signal.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => isVideo && setPlayVideo(true)}
            className={`group relative h-full w-full bg-gradient-to-br ${grad}`}
            aria-label={isVideo ? "Play video" : signal.title}
          >
            {/* subtle grid */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.08),transparent_60%)]" />

            {/* big icon */}
            {!isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={`h-16 w-16 opacity-90 ${meta.tone}`} strokeWidth={1.4} />
              </div>
            )}

            {/* play button for video */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-signal text-signal-foreground shadow-glow transition-transform group-hover:scale-105 group-active:scale-95">
                  <Play className="h-7 w-7 ml-0.5" fill="currentColor" strokeWidth={0} />
                </span>
              </div>
            )}

            {/* category chip top-left */}
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-md bg-background/70 backdrop-blur px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-foreground/80 border border-border/60">
              <Icon className={`h-3 w-3 ${meta.tone}`} strokeWidth={2} />
              {signal.category}
            </div>

            {/* type chip top-right */}
            <div className="absolute top-2.5 right-2.5 inline-flex items-center rounded-md bg-background/70 backdrop-blur px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-foreground/80 border border-border/60">
              {signal.contentType}
            </div>

            {/* duration bottom-right */}
            <div className="absolute bottom-2.5 right-2.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10.5px] text-white/90 tracking-wide">
              {signal.estimatedTime}
            </div>
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title — one line */}
        <h2 className="text-[17px] font-semibold leading-snug text-balance line-clamp-2">
          {signal.title}
        </h2>

        {/* One-line hook */}
        <p className="mt-1.5 text-[13.5px] text-muted-foreground leading-snug line-clamp-2">
          {signal.shortSummary}
        </p>

        {/* Quick check — always visible inline */}
        <div
          className={`mt-3.5 rounded-xl border px-3.5 py-3 transition-all ${
            isCorrect
              ? "border-signal/50 bg-signal/[0.07]"
              : isWrong
              ? "border-destructive/40 bg-destructive/[0.05]"
              : "border-border bg-background/30"
          }`}
        >
          <p className="text-[13px] text-foreground/95 leading-snug font-medium">
            {signal.quickCheckQuestion}
          </p>
          <div className="mt-2.5 grid gap-1.5">
            {signal.quickCheckOptions.map((opt, i) => {
              const optCorrect = i === signal.correctAnswer;
              const optPicked = picked === i;
              const reveal = picked !== null;
              return (
                <button
                  key={i}
                  onClick={() => handlePick(i)}
                  disabled={isCorrect}
                  className={`text-left text-[13px] rounded-lg border px-3 py-2.5 transition-all active:scale-[0.99] ${
                    reveal && optCorrect && (isCorrect || isWrong)
                      ? "border-signal/60 bg-signal/15 text-foreground"
                      : reveal && optPicked && !optCorrect
                      ? "border-destructive/60 bg-destructive/15 text-foreground"
                      : "border-border bg-background/40 text-foreground/85 hover:border-muted-foreground/50"
                  } ${isCorrect ? "cursor-default" : "cursor-pointer"}`}
                >
                  <span className="inline-flex items-center gap-2">
                    {reveal && optCorrect && (isCorrect || isWrong) && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-signal shrink-0" />
                    )}
                    {reveal && optPicked && !optCorrect && (
                      <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}
                    <span>{opt}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence initial={false}>
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2.5 flex items-start gap-2 rounded-lg bg-signal/10 border border-signal/30 px-2.5 py-2"
              >
                <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-[1px]" />
                <p className="text-[12.5px] text-foreground/90 leading-snug">
                  <span className="font-medium text-signal">Correct.</span>{" "}
                  <span className="text-muted-foreground">
                    {signal.explanationAfterAnswer}
                  </span>
                </p>
              </motion.div>
            )}
            {isWrong && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2.5 flex items-center justify-between gap-2 rounded-lg bg-destructive/[0.06] border border-destructive/30 px-2.5 py-2"
              >
                <span className="text-[12.5px] text-foreground/85">
                  Not quite — try again.
                </span>
                <button
                  onClick={resetCheck}
                  className="shrink-0 rounded-md border border-border bg-background/50 px-2 py-1 text-[11.5px] text-foreground/85 hover:text-foreground hover:border-muted-foreground/50 transition"
                >
                  Retry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action row: Save + Mark learned */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            onClick={() => onToggleSave(signal.id)}
            aria-label={saved ? "Unsave" : "Save"}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] transition ${
              saved
                ? "border-signal/40 bg-signal/10 text-signal"
                : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {saved ? "Saved" : "Save"}
          </button>

          <button
            onClick={() => attempted && !learned && onMarkLearned(signal.id)}
            disabled={!attempted || learned}
            title={!attempted ? "Try the Quick Check first" : undefined}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition active:scale-[0.98] ${
              learned
                ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
                : attempted
                ? "border border-signal/40 text-signal hover:bg-signal/10"
                : "border border-border bg-background/30 text-muted-foreground/60 cursor-not-allowed"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            {learned ? "Learned" : "Mark learned"}
          </button>
        </div>

        {/* Optional: Go deeper — collapsed by default */}
        {signal.sourceUrl && (
          <div className="mt-2.5">
            <button
              onClick={() => setShowDeeper((v) => !v)}
              className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground hover:text-foreground transition"
            >
              <ShieldCheck className="h-3 w-3 text-signal/80" />
              Go deeper
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showDeeper ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {showDeeper && (
                <motion.a
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  href={signal.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-border/70 bg-background/30 px-2.5 py-2 hover:border-muted-foreground/40 transition overflow-hidden"
                >
                  <span className="text-[12px] text-foreground/85 truncate">
                    {signal.sourceName ?? signal.sourceUrl}
                  </span>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    Open
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.article>
  );
}
