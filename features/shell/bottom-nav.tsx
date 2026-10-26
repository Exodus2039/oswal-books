"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CricketIcon,
  HomeIcon,
  LiveIcon,
  P2pIcon,
  ProfileIcon,
} from "@/features/shell/icons";
import type { MessageId } from "@/features/i18n/catalog";
import { useText } from "@/features/i18n/locale";
import { NAV_ITEMS, type RouteId } from "@/features/shell/routes";

const NAV_LABEL: Record<RouteId, MessageId> = {
  home: "navHome",
  live: "navLive",
  cricket: "navCricket",
  p2p: "navP2p",
  profile: "navProfile",
  match: "routeMatch",
  rankings: "navProfile",
  about: "routeAbout",
};

const ICONS: Record<RouteId, typeof HomeIcon> = {
  home: HomeIcon,
  live: LiveIcon,
  cricket: CricketIcon,
  p2p: P2pIcon,
  profile: ProfileIcon,
  match: HomeIcon,
  rankings: ProfileIcon,
  about: HomeIcon,
};

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNavFallback() {
  return <NavList pathname={null} />;
}

export function BottomNav() {
  const pathname = usePathname();
  return <NavList pathname={pathname} />;
}

function NavLabel({ id }: { id: RouteId }) {
  return useText(NAV_LABEL[id]);
}

function NavList({ pathname }: { pathname: string | null }) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex w-full max-w-5xl">
        {NAV_ITEMS.map((item) => {
          const current = pathname ? isCurrent(pathname, item.href) : false;
          const Icon = ICONS[item.id];
          return (
            <li key={item.id} className="flex-1">
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-12 flex-col items-center justify-center gap-0.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action ${
                  current ? "text-action" : "text-muted"
                }`}
              >
                <Icon />
                <span>
                  <NavLabel id={item.id} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
