import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#1a1d24" },
      { title: "SignalFeed — Become 1% better every day" },
      { name: "description", content: "Pick what you want to improve and get small daily quests for learning, health, creativity, money, AI, confidence, and more." },
      { property: "og:title", content: "SignalFeed — Become 1% better every day" },
      { property: "og:description", content: "Small daily quests for learning, health, creativity, money, AI, confidence, and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "SignalFeed — Become 1% better every day" },
      { name: "twitter:description", content: "Small daily quests for learning, health, creativity, money, AI, confidence, and more." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/505dea72-de93-49ca-b60c-7827d3911154/id-preview-efb822b1--976c9241-cfec-4245-b355-58d4e5b80233.lovable.app-1777803609838.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/505dea72-de93-49ca-b60c-7827d3911154/id-preview-efb822b1--976c9241-cfec-4245-b355-58d4e5b80233.lovable.app-1777803609838.png" },
      { name: "twitter:card", content: "summary_large_image" },
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
