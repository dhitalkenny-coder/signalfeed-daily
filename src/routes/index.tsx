import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play, HelpCircle, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignalFeed — Still want to scroll? Make it useful." },
      {
        name: "description",
        content: "Useful reels without the garbage. Watch, learn, remember.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-hero pb-24">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-md px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          Educational reels
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-balance"
        >
          Still want to scroll?{" "}
          <span
            className="bg-signal-gradient bg-clip-text"
            style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}
          >
            Make it useful.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-base leading-relaxed text-muted-foreground"
        >
          Useful reels without the garbage. Watch, learn, remember.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-col gap-3"
        >
          <Link
            to="/feed"
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-signal hover:bg-signal/90 px-5 py-3.5 text-[15px] font-semibold text-signal-foreground shadow-md transition-all active:scale-[0.98]"
          >
            Peek at today's feed
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/interests"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card/40 px-4 py-2.5 text-sm text-foreground/85 hover:text-foreground hover:border-signal/40 transition-colors"
          >
            Choose your interests first
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-3">
          {[
            { icon: Play, title: "Watch useful reels.", body: "One full-screen reel at a time. No garbage in between." },
            { icon: HelpCircle, title: "Answer quick questions.", body: "Two or three taps prove you actually got it." },
            { icon: Brain, title: "Actually remember what you learned.", body: "Save the gold. Build a real library, not noise." },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
              className="rounded-2xl border border-border bg-card-gradient p-5"
            >
              <f.icon className="h-5 w-5 text-signal" />
              <h3 className="mt-3 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Useful scrolling, not doomscrolling.
        </p>
      </div>
    </main>
  );
}
