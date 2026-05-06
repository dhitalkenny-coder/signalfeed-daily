import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/quests-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Choose your goals · SignalFeed" }] }),
  component: Goals,
});

function Goals() {
  const navigate = useNavigate();
  const [selected, setSelected] = useLocalStorage<Category[]>("sf:goals", []);

  const toggle = (c: Category) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <main className="min-h-screen pb-36 px-6 pt-12 mx-auto max-w-md">
      <p className="text-xs uppercase tracking-[0.18em] text-signal">Step 01</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        What do you want to improve?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick at least 3 goals. You can change these anytime.
      </p>

      <div className="mt-7 grid grid-cols-2 gap-2.5">
        {CATEGORIES.map((c, i) => {
          const active = selected.includes(c.name);
          const Icon = c.Icon;
          return (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.025 }}
              onClick={() => toggle(c.name)}
              className={`relative rounded-2xl border p-3.5 text-left transition-all ${
                active
                  ? "border-signal/70 bg-signal/[0.07] shadow-glow"
                  : "border-border bg-card-gradient hover:border-muted-foreground/40"
              }`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-background/60 border border-border ${c.tone}`}>
                <Icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <div className="mt-2.5 text-[13.5px] font-medium leading-tight">{c.name}</div>
              <div className="mt-1 text-[11px] text-muted-foreground leading-snug">{c.blurb}</div>
              {active && (
                <span className="absolute right-2.5 top-2.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-signal text-signal-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="fixed inset-x-0 bottom-20 px-6">
        <div className="mx-auto max-w-md">
          <button
            disabled={selected.length < 3}
            onClick={() => navigate({ to: "/quests" })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-signal-gradient px-6 py-4 text-base font-semibold text-signal-foreground shadow-glow transition-all disabled:opacity-40 disabled:shadow-none active:scale-[0.98]"
          >
            {selected.length < 3 ? `Pick ${3 - selected.length} more` : "See today's quests"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
