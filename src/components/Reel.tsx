import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { CATEGORY_META, type Signal } from "@/lib/signals-data";

interface Props {
  signal: Signal;
  saved: boolean;
  learned: boolean;
  showSwipeHint?: boolean;
  onToggleSave: (id: string) => void;
  onMarkLearned: (id: string) => void;
  onAnswer: (id: string, qIndex: number, picked: number, correct: boolean) => void;
}

export function Reel({
  signal,
  saved,
  learned,
  showSwipeHint,
  onToggleSave,
  onMarkLearned,
  onAnswer,
}: Props) {
  const meta = CATEGORY_META[signal.category];
  const Icon = meta.Icon;
  const isVideo = !!signal.youtubeEmbedUrl;

  const [playVideo, setPlayVideo] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [showDeeper, setShowDeeper] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);
  const [hintVisible, setHintVisible] = useState(!!showSwipeHint);
  const advanceTimer = useRef<number | null>(null);

  const current = signal.questions[qIndex];
  const total = signal.questions.length;
  const allDone = results.length >= total && results.every((r) => r);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!showSwipeHint) return;
    const t = window.setTimeout(() => setHintVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [showSwipeHint]);

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === current.correctAnswer;
    onAnswer(signal.id, qIndex, i, correct);
    if (!correct) {
      setShake(true);
      window.setTimeout(() => setShake(false), 350);
      return;
    }
    advanceTimer.current = window.setTimeout(() => {
      setResults((r) => [...r, true]);
      setPicked(null);
      if (qIndex < total - 1) setQIndex((q) => q + 1);
    }, 1000);
  };

  const retry = () => setPicked(null);

  const watchOnYouTubeUrl = signal.sourceUrl
    ?? (signal.youtubeEmbedUrl ? signal.youtubeEmbedUrl.replace("/embed/", "/watch?v=").split("?")[0] : undefined);

  return (
    <section
      className="relative h-[100dvh] w-full snap-start snap-always overflow-hidden bg-background"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Video / visual area — 60% */}
      <div className="relative w-full" style={{ height: "60dvh" }}>
        <div className="absolute inset-0 bg-black">
          {isVideo && playVideo && !embedFailed ? (
            <iframe
              src={`${signal.youtubeEmbedUrl}${signal.youtubeEmbedUrl?.includes("?") ? "&" : "?"}autoplay=1`}
              title={signal.title}
              className="absolute inset-0 h-full w-full"
              allow="accelerated-sensors; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setEmbedFailed(true)}
            />
          ) : (
            <button
              type="button"
              onClick={() => isVideo && !embedFailed && setPlayVideo(true)}
              className={`group relative h-full w-full bg-gradient-to-br ${meta.gradient}`}
              aria-label={isVideo ? "Play video" : signal.title}
            >
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_60%)]" />

              <div className="absolute inset-0 flex items-center justify-center">
                {isVideo && !embedFailed ? (
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-signal text-signal-foreground shadow-glow transition-transform group-hover:scale-105 group-active:scale-95">
                    <Play className="h-9 w-9 ml-0.5" fill="currentColor" strokeWidth={0} />
                  </span>
                ) : (
                  <Icon className={`h-24 w-24 opacity-90 ${meta.tone}`} strokeWidth={1.2} />
                )}
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
            </button>
          )}
        </div>

        {/* Bookmark — top right */}
        <button
          onClick={() => onToggleSave(signal.id)}
          aria-label={saved ? "Unsave" : "Save"}
          className="absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/55 backdrop-blur border border-white/10 text-white hover:bg-black/70 transition"
        >
          {saved ? (
            <BookmarkCheck className="h-5 w-5 text-signal" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>

        {/* Watch on YouTube fallback */}
        {isVideo && embedFailed && watchOnYouTubeUrl && (
          <a
            href={watchOnYouTubeUrl}
            target="_blank"
            rel="noreferrer"
            className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur px-3 py-1.5 text-[11px] text-white border border-white/10"
          >
            <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
            Watch on YouTube
          </a>
        )}

        {/* Category chip — bottom-left */}
        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-white/90 border border-white/10">
          <Icon className={`h-3 w-3 ${meta.tone}`} strokeWidth={2} />
          {signal.category} · {signal.difficulty}
        </div>

        {/* Type chip — bottom-right */}
        <div className="absolute bottom-3 right-3 z-10 inline-flex items-center rounded-md bg-black/60 backdrop-blur px-2 py-1 text-[10.5px] uppercase tracking-[0.14em] text-white/90 border border-white/10">
          {signal.contentType}
        </div>

        {/* Swipe hint */}
        <AnimatePresence>
          {hintVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ y: { repeat: Infinity, duration: 1.6 }, opacity: { duration: 0.4 } }}
              className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/65 backdrop-blur px-3 py-1.5 text-[11px] text-white/90 border border-white/10"
            >
              Swipe up for next reel
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quiz / content area — 40% */}
      <div
        className="relative flex flex-col px-5 pt-3"
        style={{ height: "40dvh", paddingBottom: "calc(72px + env(safe-area-inset-bottom))" }}
      >
        <h2 className="text-[17px] font-semibold leading-tight tracking-tight text-foreground line-clamp-1">
          {signal.title}
        </h2>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground line-clamp-1">
          {signal.hook}
        </p>

        <div className="mt-2 flex items-center gap-1.5">
          {signal.questions.map((_, i) => {
            const done = results[i] === true;
            const active = i === qIndex && !allDone;
            return (
              <span
                key={i}
                className={`h-[3px] flex-1 rounded-full transition-colors ${
                  done ? "bg-signal" : active ? "bg-foreground/60" : "bg-border"
                }`}
              />
            );
          })}
        </div>

        <div className="mt-2.5 flex-1 min-h-0 flex flex-col">
          {!allDone ? (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-2 min-h-0"
            >
              <p className="text-[14px] font-medium text-foreground/95 leading-snug">
                {current.question}
              </p>
              <motion.div
                animate={shake ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
                className="grid gap-1.5"
              >
                {current.options.map((opt, i) => {
                  const isPicked = picked === i;
                  const isCorrectPick = picked !== null && i === current.correctAnswer;
                  const isWrongPick = isPicked && i !== current.correctAnswer;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePick(i)}
                      disabled={picked !== null && (isCorrectPick || picked === current.correctAnswer)}
                      className={`text-left rounded-xl border px-3.5 py-3 text-[14px] transition-all active:scale-[0.99] ${
                        isCorrectPick
                          ? "border-signal/70 bg-signal/15 text-foreground"
                          : isWrongPick
                          ? "border-destructive/70 bg-destructive/15 text-foreground"
                          : "border-border bg-card hover:border-muted-foreground/50 text-foreground/90"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        {isCorrectPick && <CheckCircle2 className="h-3.5 w-3.5 text-signal" />}
                        <span>{opt}</span>
                      </span>
                    </button>
                  );
                })}
              </motion.div>

              <AnimatePresence>
                {picked !== null && picked === current.correctAnswer && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[12px] text-signal/90 leading-snug"
                  >
                    {current.explanation}
                  </motion.p>
                )}
                {picked !== null && picked !== current.correctAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between gap-2 rounded-lg border border-destructive/40 bg-destructive/[0.06] px-2.5 py-1.5"
                  >
                    <span className="text-[12px] text-foreground/85">Not quite — try again.</span>
                    <button
                      onClick={retry}
                      className="rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] text-foreground/85 hover:text-foreground transition"
                    >
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2.5"
            >
              <div className="rounded-xl border border-signal/40 bg-signal/10 px-3.5 py-2.5">
                <p className="text-[13.5px] font-medium text-signal">
                  Nice — saved to memory.
                </p>
              </div>
              <button
                onClick={() => onMarkLearned(signal.id)}
                disabled={learned}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-[14px] font-semibold transition active:scale-[0.98] ${
                  learned
                    ? "bg-signal/10 text-signal border border-signal/30 cursor-default"
                    : "bg-signal text-signal-foreground shadow-md hover:bg-signal/90"
                }`}
              >
                <Check className="h-4 w-4" />
                {learned ? "Learned" : "Mark learned"}
              </button>
            </motion.div>
          )}
        </div>

        {(signal.sourceUrl || watchOnYouTubeUrl) && (
          <div className="mt-1.5">
            <button
              onClick={() => setShowDeeper((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition"
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
                  href={signal.sourceUrl ?? watchOnYouTubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 hover:border-muted-foreground/40 transition overflow-hidden"
                >
                  <span className="text-[12px] text-foreground/85 truncate">
                    {signal.sourceName ?? "Open source"}
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
    </section>
  );
}
