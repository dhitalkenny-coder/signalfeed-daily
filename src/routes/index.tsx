import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookmarkCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SignalFeed — Useful internet, without the garbage" },
      { name: "description", content: "Get 10 handpicked videos, tools, and ideas every day — curated to help you learn, build, and improve without wasting your life." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-hero pb-24">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-md px-6 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          Private beta · invite only
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight text-balance"
        >
          Useful internet,<br />
          <span className="bg-signal-gradient bg-clip-text text-transparent">without the garbage.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-5 text-base leading-relaxed text-muted-foreground"
        >
          Get 10 handpicked videos, tools, and ideas every day — curated to help you
          learn, build, and improve without wasting your life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-col gap-3"
        >
          <Link
            to="/interests"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-signal-gradient px-6 py-4 text-base font-semibold text-signal-foreground shadow-glow transition-transform active:scale-[0.98]"
          >
            Join the beta
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/feed"
            className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            See today's feed →
          </Link>
        </motion.div>

        <div className="mt-16 grid gap-3">
          {[
            { icon: Sparkles, title: "10 a day. That's it.", body: "No infinite scroll. No dopamine slot machine. A finite, finishable feed." },
            { icon: Zap, title: "Every post has an action step.", body: "Don't just consume. Apply something the same day you read it." },
            { icon: BookmarkCheck, title: "Build a personal library.", body: "Save the signal, ditch the noise, revisit when it matters." },
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
          For builders, creators, students, and entrepreneurs.
        </p>
      </div>
    </main>
  );
}
