import { Link, useLocation } from "@tanstack/react-router";
import { Home, Compass, Bookmark, BarChart3 } from "lucide-react";

const items = [
  { to: "/feed", label: "Feed", icon: Home },
  { to: "/interests", label: "Interests", icon: Compass },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/progress", label: "Progress", icon: BarChart3 },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname === "/" || pathname.startsWith("/admin")) return null;
  const onFeed = pathname.startsWith("/feed");
  return (
    <nav
      className={`fixed bottom-0 inset-x-0 z-50 ${
        onFeed
          ? "bg-gradient-to-t from-background via-background/85 to-transparent"
          : "border-t border-border bg-background/85 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto max-w-md grid grid-cols-4">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-3 text-[11px] transition-colors ${
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
