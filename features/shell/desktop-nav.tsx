"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MessageId } from "@/features/i18n/catalog";
import { useText } from "@/features/i18n/locale";
import { NAV_ITEMS, type RouteId } from "@/features/shell/routes";

const NAV_LABEL: Partial<Record<RouteId, MessageId>> = {
  home: "navHome",
  live: "navLive",
  cricket: "navCricket",
  p2p: "navP2p",
};

const DESKTOP_NAV = NAV_ITEMS.filter((item) => item.id !== "profile");

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DesktopNavFallback() {
  return <DesktopLinks pathname={null} />;
}

export function DesktopNav() {
  return <DesktopLinks pathname={usePathname()} />;
}

function NavLabel({ id }: { id: RouteId }) {
  const message = NAV_LABEL[id] ?? "navHome";
  return useText(message);
}

function DesktopLinks({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Primary" className="hidden min-w-0 lg:block">
      <ul className="flex items-center gap-1">
        {DESKTOP_NAV.map((item) => {
          const current = pathname ? isCurrent(pathname, item.href) : false;
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action ${
                  current
                    ? "text-action underline decoration-2 underline-offset-8"
                    : "text-muted"
                }`}
              >
                {item.id === "live" ? (
                  <span className="size-1.5 rounded-full bg-action" aria-hidden="true" />
                ) : null}
                <NavLabel id={item.id} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
