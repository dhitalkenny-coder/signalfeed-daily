import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, ArrowLeft } from "lucide-react";
import {
  CATEGORIES,
  DIFFICULTIES,
  type Category,
  type Difficulty,
} from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/interests")({
  head: () => ({ meta: [{ title: "Build your feed · SignalFeed" }] }),
  component: Interests,
});

function Interests() {
  const navigate = useNavigate();
  const [selected, setSelected] = useLocalStorage<Category[]>("sf:interests", []);
  const [difficulty, setDifficulty] = useLocalStorage<Difficulty | null>("sf:difficulty", null);
  const [step, setStep] = useState<1 | 2>(1);

  const toggle = (c: Category) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <main className="min-h-[100dvh] pb-36 px-6 pt-12 mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Step 0{step}</p>
        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
        )}
        {step === 1 && (
          <Link to="/" className="text-[12px] text-muted-foreground hover:text-foreground">
            Skip
          </Link>
        )}
      </div>

      {step === 1 ? (
        <>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-balance">
            What do you want to level up?
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick the areas you want your feed to focus on.
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground/80">Pick at least 2 categories.</p>

          <div className="mt-6 grid gap-2.5">
            {CATEGORIES.map((c, i) => {
              const active = selected.includes(c.name);
              const Icon = c.Icon;
              return (
                <motion.button
                  key={c.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.025 }}
                  onClick={() => toggle(c.name)}
                  className={`relative rounded-2xl border p-3.5 text-left transition-all ${
                    active
                      ? "border-signal/70 bg-signal/[0.07] shadow-glow"
                      : "border-border bg-card-gradient hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background/60 border border-border ${c.tone}`}>
                      <Icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium leading-tight">{c.name}</div>
                      <div className="mt-1 text-[11.5px] text-muted-foreground leading-snug truncate">
                        {c.examples.join(", ")}
                      </div>
                    </div>
                    {active && (
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal text-signal-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="fixed inset-x-0 bottom-20 px-6">
            <div className="mx-auto max-w-md">
              <button
                disabled={selected.length < 2}
                onClick={() => setStep(2)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-signal px-6 py-4 text-base font-semibold text-signal-foreground shadow-md transition-all disabled:opacity-40 disabled:shadow-none active:scale-[0.98] hover:bg-signal/90"
              >
                {selected.length < 2 ? `Pick ${2 - selected.length} more` : "Next: pick your level"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="mt-2 text-[28px] font-semibold tracking-tight text-balance">
            Choose your starting level
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You can change this later in your feed.
          </p>

          <div className="mt-6 grid gap-3">
            {DIFFICULTIES.map((d, i) => {
              const active = difficulty === d.name;
              return (
                <motion.button
                  key={d.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  onClick={() => setDifficulty(d.name)}
                  className={`rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? "border-signal/70 bg-signal/[0.07] shadow-glow"
                      : "border-border bg-card-gradient hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[15px] font-semibold">{d.name}</div>
                    {active && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-signal text-signal-foreground">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13px] text-muted-foreground leading-snug">"{d.line}"</p>
                </motion.button>
              );
            })}
          </div>

          <div className="fixed inset-x-0 bottom-20 px-6">
            <div className="mx-auto max-w-md">
              <button
                disabled={!difficulty}
                onClick={() => navigate({ to: "/feed" })}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-signal px-6 py-4 text-base font-semibold text-signal-foreground shadow-md transition-all disabled:opacity-40 disabled:shadow-none active:scale-[0.98] hover:bg-signal/90"
              >
                Build my feed
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
