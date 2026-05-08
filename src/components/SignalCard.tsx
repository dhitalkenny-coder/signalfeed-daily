import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Sparkles,
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
  const [expandLearn, setExpandLearn] = useState(false);

  // If parent already recorded a correct answer, reflect it locally so the card
  // shows the success state on remount. We never lock the UI for wrong answers
  // — the user can always retry until they get it right.
  useEffect(() => {
    if (answeredCorrect === true && picked === null) {
      setPicked(signal.correctAnswer);
    }
  }, [answeredCorrect, signal.correctAnswer, picked]);

  const thumbGradient: Record<string, string> = {
    "AI & Tech": "from-cyan-500/25 via-sky-500/10 to-transparent",
    "Money": "from-emerald-500/25 via-teal-500/10 to-transparent",
    "Creativity": "from-purple-500/25 via-fuchsia-500/10 to-transparent",
    "News & Current Affairs": "from-slate-400/25 via-slate-500/10 to-transparent",
    "Mind & Philosophy": "from-indigo-500/25 via-violet-500/10 to-transparent",
    "Health & Lifestyle": "from-green-500/25 via-emerald-500/10 to-transparent",
    "Cooking & Skills": "from-orange-500/25 via-amber-500/10 to-transparent",
    "Business": "from-amber-500/20 via-yellow-500/5 to-transparent",
  };
  const grad = thumbGradient[signal.category] ?? "from-signal/15 to-transparent";

  const handlePick = (i: number) => {
    // Lock only on correct, allow retries on wrong.
    if (picked !== null && picked === signal.correctAnswer) return;
    setPicked(i);
    onAnswer(signal.id, i, i === signal.correctAnswer);
  };

  const resetCheck = () => setPicked(null);

  const isCorrect = picked !== null && picked === signal.correctAnswer;
  const isWrong = picked !== null && picked !== signal.correctAnswer;

  // Truncate learn content to ~140 chars when collapsed.
  const learnNeedsTruncate = signal.learnInsideApp.length > 160;
  const learnPreview = learnNeedsTruncate && !expandLearn
    ? signal.learnInsideApp.slice(0, 140).trimEnd() + "…"
    : signal.learnInsideApp;

  const checkBadgeText = isCorrect
    ? "Correct"
    : isWrong
    ? "Try again"
    : showCheck
    ? "Hide"
    : "Tap to answer";

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

      {/* Category thumbnail — polished gradient placeholder */}
      <div className={`relative mt-3 h-28 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br ${grad}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-background/60 backdrop-blur px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-foreground/70 border border-border/60">
          {signal.contentType}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className={`h-12 w-12 opacity-90 ${meta.tone}`} strokeWidth={1.5} />
        </div>
        <div className="absolute bottom-2 right-2 text-[10px] text-foreground/45 tracking-wider">
          {signal.estimatedTime}
        </div>
      </div>

      {/* Learn inside the app — collapsible */}
      <div className="mt-3 rounded-xl border border-border bg-background/30 px-3 py-2.5">
        <div className="text-[10.5px] font-medium uppercase tracking-widest text-foreground/70 flex items-center gap-1.5">
          <Lightbulb className="h-3 w-3 text-gold" /> Learn
        </div>
        <p className="mt-1 text-[13px] text-foreground/90 leading-relaxed">
          {learnPreview}
        </p>
        {learnNeedsTruncate && (
          <button
            onClick={() => setExpandLearn((v) => !v)}
            className="mt-1.5 inline-flex items-center gap-1 text-[11.5px] text-signal/90 hover:text-signal transition"
          >
            {expandLearn ? "Show less" : "Read more"}
            <ChevronDown
              className={`h-3 w-3 transition-transform ${expandLearn ? "rotate-180" : ""}`}
            />
          </button>
        )}
        <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
          <span className="text-foreground/70 font-medium">Why it matters: </span>
          {signal.whyItMatters}
        </p>
      </div>

      {/* Quick check */}
      <div
        className={`mt-3 rounded-xl border px-3.5 py-3 transition-all ${
          isCorrect
            ? "border-signal/50 bg-signal/[0.07] shadow-[0_0_0_1px_rgba(34,197,94,0.08),0_0_24px_-8px_rgba(34,197,94,0.35)]"
            : isWrong
            ? "border-destructive/40 bg-destructive/[0.05]"
            : "border-focus/30 bg-gradient-to-br from-focus/[0.08] to-focus/[0.02] shadow-[0_0_0_1px_rgba(56,189,248,0.04)]"
        }`}
      >
        <button
          onClick={() => setShowCheck((v) => !v)}
          className="w-full text-left flex items-center justify-between gap-2 group/qc"
        >
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.14em] flex items-center gap-1.5 ${
              isCorrect ? "text-signal" : isWrong ? "text-destructive" : "text-focus"
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-md ${
                isCorrect ? "bg-signal/15" : isWrong ? "bg-destructive/15" : "bg-focus/15"
              }`}
            >
              <HelpCircle className="h-3 w-3" />
            </span>
            Quick check
          </span>
          <span
            className={`text-[11px] inline-flex items-center gap-1 rounded-full px-2 py-0.5 transition-colors ${
              isCorrect
                ? "bg-signal/15 text-signal"
                : isWrong
                ? "bg-destructive/15 text-destructive"
                : "bg-focus/15 text-focus group-hover/qc:bg-focus/25"
            }`}
          >
            {checkBadgeText}
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
                  const optCorrect = i === signal.correctAnswer;
                  const optPicked = picked === i;
                  const reveal = picked !== null;
                  // After a wrong answer we let the user try again — keep buttons enabled.
                  const locked = isCorrect;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePick(i)}
                      disabled={locked}
                      className={`text-left text-[13px] rounded-lg border px-3 py-2 transition-all ${
                        reveal && optCorrect && (isCorrect || isWrong)
                          ? "border-signal/60 bg-signal/10 text-foreground"
                          : reveal && optPicked && !optCorrect
                          ? "border-destructive/60 bg-destructive/10 text-foreground"
                          : "border-border bg-background/40 text-foreground/85 hover:border-muted-foreground/50"
                      } ${locked ? "cursor-default" : "cursor-pointer"}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {reveal && optCorrect && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-signal" />
                        )}
                        {reveal && optPicked && !optCorrect && (
                          <XCircle className="h-3.5 w-3.5 text-destructive" />
                        )}
                        <span>{opt}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {isCorrect && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 flex items-start gap-2 rounded-lg bg-signal/10 border border-signal/30 px-2.5 py-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-signal shrink-0 mt-[1px]" />
                  <div className="text-[12px] text-foreground/90 leading-snug">
                    <span className="font-medium text-signal">Nice — saved to memory.</span>{" "}
                    <span className="text-muted-foreground">{signal.explanationAfterAnswer}</span>
                  </div>
                </motion.div>
              )}

              {isWrong && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 rounded-lg bg-destructive/[0.06] border border-destructive/30 px-2.5 py-2"
                >
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-destructive shrink-0 mt-[1px]" />
                    <div className="text-[12px] text-foreground/90 leading-snug">
                      <span className="font-medium">Not quite.</span>{" "}
                      <span className="text-muted-foreground">
                        Correct answer: {signal.quickCheckOptions[signal.correctAnswer]}. {signal.explanationAfterAnswer}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={resetCheck}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-background/50 px-2.5 py-1 text-[11.5px] text-foreground/85 hover:text-foreground hover:border-muted-foreground/50 transition"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Try again
                  </button>
                </motion.div>
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

      {/* Go deeper — credible source area */}
      {signal.sourceUrl ? (
        <a
          href={signal.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-background/20 px-3 py-2 hover:border-muted-foreground/40 hover:bg-background/30 transition"
        >
          <div className="min-w-0">
            <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3 text-signal/80" /> Go deeper
            </div>
            <p className="mt-0.5 text-[12.5px] text-foreground/85 truncate">
              {signal.sourceName ?? "Source available"}
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            {signal.contentType === "Video" ? "Watch" : "Read"}
            <ExternalLink className="h-3 w-3" />
          </span>
        </a>
      ) : (
        <div className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-widest text-muted-foreground/70">
          <ShieldCheck className="h-3 w-3" /> Based on common practice
        </div>
      )}

      {/* Meta + primary action */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" /> {signal.estimatedTime} · {signal.difficulty}
        </span>
        <button
          onClick={() => !learned && onMarkLearned(signal.id)}
          disabled={learned}
          className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-all active:scale-[0.98] ${
            learned
              ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
              : "border border-signal/40 text-signal hover:bg-signal/10"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {learned ? "Learned" : "Mark learned"}
        </button>
      </div>
    </motion.article>
  );
}
