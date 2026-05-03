import { Link, useLocation } from "@tanstack/react-router";
import { Home, Bookmark, Sparkles, Upload } from "lucide-react";

const items = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/interests", label: "Interests", icon: Sparkles },
  { to: "/admin", label: "Admin", icon: Upload },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
                active ? "text-signal" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 1.8} />
              <span className="tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
