"use client";

import type { ReactNode } from "react";
import type { MessageId } from "@/features/i18n/catalog";
import { useText } from "@/features/i18n/locale";
import { ROUTES, type RouteId } from "@/features/shell/routes";

const TITLE: Record<RouteId, MessageId> = {
  home: "routeHome",
  live: "routeLive",
  cricket: "routeCricket",
  match: "routeMatch",
  p2p: "routeP2p",
  rankings: "routeRankings",
  profile: "routeProfile",
  about: "routeAbout",
};

const JOB: Record<RouteId, MessageId> = {
  home: "jobHome",
  live: "jobLive",
  cricket: "jobCricket",
  match: "jobMatch",
  p2p: "jobP2p",
  rankings: "jobRankings",
  profile: "jobProfile",
  about: "jobAbout",
};

export function RouteScreen({
  routeId,
  children,
}: {
  routeId: RouteId;
  children?: ReactNode;
}) {
  const route = ROUTES[routeId];
  const title = useText(TITLE[routeId]);
  const job = useText(JOB[routeId]);
  const parked = useText("parked");
  return (
    <article className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {route.parked ? (
            <span className="inline-flex h-7 items-center rounded-full border border-border px-2 text-sm text-muted">
              {parked}
            </span>
          ) : null}
        </div>
        <p className="max-w-2xl text-base text-muted">{job}</p>
      </header>
      {children}
    </article>
  );
}
