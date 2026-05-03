import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/feed-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/interests")({
  head: () => ({ meta: [{ title: "Choose your interests · SignalFeed" }] }),
  component: Interests,
});

function Interests() {
  const navigate = useNavigate();
  const [selected, setSelected] = useLocalStorage<Category[]>("sf:interests", []);

  const toggle = (c: Category) =>
    setSelected((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  return (
    <main className="min-h-screen pb-32 px-6 pt-12 mx-auto max-w-md">
      <p className="text-xs uppercase tracking-[0.18em] text-signal">Step 01</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance">
        What should we send you?
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Pick at least 3. You can change these anytime.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {CATEGORIES.map((c, i) => {
          const active = selected.includes(c);
          return (
            <motion.button
              key={c}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              onClick={() => toggle(c)}
              className={`relative rounded-2xl border p-4 text-left transition-all ${
                active
                  ? "border-signal bg-signal/10 shadow-glow"
                  : "border-border bg-card-gradient hover:border-muted-foreground/40"
              }`}
            >
              <span className="text-sm font-medium">{c}</span>
              {active && (
                <span className="absolute right-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full bg-signal text-signal-foreground">
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
            onClick={() => navigate({ to: "/feed" })}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-signal-gradient px-6 py-4 text-base font-semibold text-signal-foreground shadow-glow transition-all disabled:opacity-40 disabled:shadow-none active:scale-[0.98]"
          >
            {selected.length < 3 ? `Pick ${3 - selected.length} more` : "See today's feed"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
