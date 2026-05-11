import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Bookmark, Play, X } from "lucide-react";
import { CATEGORY_META, DEFAULT_SIGNALS, type Signal } from "@/lib/signals-data";
import { useLocalStorage } from "@/lib/use-local-storage";

export const Route = createFileRoute("/saved")({
  head: () => ({ meta: [{ title: "Saved · SignalFeed" }] }),
  component: Saved,
});

function Saved() {
  const [savedIds, setSavedIds] = useLocalStorage<string[]>("sf:saved", []);
  const [customSignals] = useLocalStorage<Signal[]>("sf:custom-signals", []);

  const all = useMemo(() => [...customSignals, ...DEFAULT_SIGNALS], [customSignals]);
  const saved = useMemo(() => all.filter((s) => savedIds.includes(s.id)), [all, savedIds]);

  const remove = (id: string) =>
    setSavedIds((p) => p.filter((x) => x !== id));

  return (
    <main className="min-h-[100dvh] pb-28 px-5 pt-10 mx-auto max-w-md">
      <header className="mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-signal">Library</p>
        <h1 className="mt-2 text-[28px] font-semibold tracking-tight">Saved reels</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {saved.length} saved for later
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-border p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm font-medium">Nothing saved yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tap the bookmark on any reel to save it.
          </p>
          <Link
            to="/feed"
            className="mt-5 inline-block text-sm text-signal underline-offset-4 hover:underline"
          >
            Go to your feed →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3">
          {saved.map((s) => {
            const meta = CATEGORY_META[s.category];
            const Icon = meta.Icon;
            return (
              <li
                key={s.id}
                className="group relative flex gap-3 rounded-2xl border border-border bg-card overflow-hidden"
              >
                <Link
                  to="/feed"
                  className={`relative h-24 w-28 shrink-0 bg-gradient-to-br ${meta.gradient}`}
                  aria-label={`Watch ${s.title}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {s.youtubeEmbedUrl ? (
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-signal text-signal-foreground">
                        <Play className="h-4 w-4 ml-0.5" fill="currentColor" strokeWidth={0} />
                      </span>
                    ) : (
                      <Icon className={`h-7 w-7 ${meta.tone}`} strokeWidth={1.6} />
                    )}
                  </div>
                </Link>
                <div className="flex-1 min-w-0 py-2.5 pr-2.5">
                  <p className="text-[13.5px] font-medium leading-snug line-clamp-2">
                    {s.title}
                  </p>
                  <p className="mt-1 text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
                    {s.category} · {s.difficulty} · {s.contentType}
                  </p>
                  {s.sourceName && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground/80 truncate">
                      {s.sourceName}
                    </p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <Link
                      to="/feed"
                      className="inline-flex items-center gap-1 rounded-md border border-signal/40 bg-signal/10 px-2 py-1 text-[11px] text-signal hover:bg-signal/15 transition"
                    >
                      <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
                      Watch
                    </Link>
                    <button
                      onClick={() => remove(s.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition"
                      aria-label="Remove from saved"
                    >
                      <X className="h-3 w-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
