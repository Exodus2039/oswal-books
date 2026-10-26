import { Suspense } from "react";
import Link from "next/link";
import { DesktopNav, DesktopNavFallback } from "@/features/shell/desktop-nav";
import { Notifications } from "@/features/shell/notifications";
import { ProfileIcon } from "@/features/shell/icons";
import { WalletChip } from "@/features/shell/wallet-chip";
import { T } from "@/features/i18n/text";
import { ButtonLink } from "@/shared/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-3 px-4 lg:h-16">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg pr-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-action text-action-foreground">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M8.2 8.4c1.6 1.2 1.6 6 0 7.2M15.8 8.4c-1.6 1.2-1.6 6 0 7.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-sm font-bold tracking-[0.14em]">OSWAL</span>
          <span className="rounded-md bg-you px-1.5 py-0.5 text-[0.65rem] font-bold tracking-wide text-black">
            BOOKS
          </span>
        </Link>
        <Suspense fallback={<DesktopNavFallback />}>
          <DesktopNav />
        </Suspense>
        <div className="ml-auto flex items-center gap-1">
          <WalletChip />
          <Notifications />
          <Link
            href="/profile"
            aria-label="Profile"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action lg:hidden"
          >
            <ProfileIcon />
          </Link>
          <Link
            href="/about#whatsapp"
            className="hidden h-10 items-center gap-1.5 rounded-full border border-border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action lg:inline-flex"
          >
            <ProfileIcon />
            <T id="signIn" />
          </Link>
          <div className="hidden lg:block">
            <ButtonLink href="/live" className="h-10 min-h-10 px-3">
              <T id="playNow" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
