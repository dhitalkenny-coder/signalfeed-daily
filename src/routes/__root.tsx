import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a1d24" },
      { title: "SignalFeed — Useful internet, without the garbage" },
      { name: "description", content: "10 handpicked videos, tools, and ideas every day. Curated to help you learn, build, and improve." },
      { property: "og:title", content: "SignalFeed" },
      { property: "og:description", content: "Useful internet, without the garbage." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: () => (
    <>
      <Outlet />
      <BottomNav />
    </>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body className="min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
