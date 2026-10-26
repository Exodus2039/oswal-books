import { Suspense } from "react";
import { ShellAnalytics } from "@/features/analytics/shell-analytics";
import { LocaleRoot } from "@/features/i18n/text";
import { BottomNav, BottomNavFallback } from "@/features/shell/bottom-nav";
import { AppHeader } from "@/features/shell/header";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-40 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:outline-2 focus:outline-offset-2 focus:outline-action"
      >
        Skip to content
      </a>
      <LocaleRoot />
      <Suspense fallback={null}>
        <ShellAnalytics />
      </Suspense>
      <AppHeader />
      <main
        id="content"
        className="px-4 py-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-10"
      >
        {children}
      </main>
      <Suspense fallback={<BottomNavFallback />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
