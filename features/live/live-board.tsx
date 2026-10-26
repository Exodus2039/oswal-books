"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatPercent } from "@/features/feed/format";
import { SERIES_LABEL, type Match, type Selection } from "@/features/feed/types";
import { TeamName, T } from "@/features/i18n/text";
import { FeedStatus } from "@/features/live/feed-status";
import { boardPhase } from "@/features/live/merge-board";
import { useFeed } from "@/features/live/use-feed";
import { useLastMatch } from "@/features/match/last-match";
import { sportEdge } from "@/shared/ui/card";

function useRowRefs(idsKey: string, onVisible: (ids: string[]) => void) {
  const nodes = useRef(new Map<string, Element>());
  const visible = useRef(new Set<string>());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let changed = false;
        for (const entry of entries) {
          const id = entry.target.getAttribute("data-match-id");
          if (!id) continue;
          if (entry.isIntersecting) {
            if (!visible.current.has(id)) {
              visible.current.add(id);
              changed = true;
            }
          } else if (visible.current.delete(id)) {
            changed = true;
          }
        }
        if (changed) onVisible([...visible.current].sort());
      },
      { threshold: 0.2 },
    );
    for (const node of nodes.current.values()) observer.observe(node);
    return () => observer.disconnect();
  }, [idsKey, onVisible]);

  function refFor(id: string) {
    return (node: HTMLAnchorElement | null) => {
      if (node) nodes.current.set(id, node);
      else {
        nodes.current.delete(id);
        visible.current.delete(id);
      }
    };
  }

  return refFor;
}

function Split({ selections }: { selections: readonly Selection[] }) {
  if (selections.length === 2) {
    const [home, away] = selections;
    if (!home || !away) return null;
    const width = Math.min(100, Math.max(0, home.percent));
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="min-w-0 break-words">
            <TeamName id={home.id} fallback={home.label} />{" "}
            <span className="font-mono tabular-nums">{formatPercent(home.percent)}</span>
          </span>
          <span className="min-w-0 break-words text-right">
            <span className="font-mono tabular-nums">{formatPercent(away.percent)}</span>{" "}
            <TeamName id={away.id} fallback={away.label} />
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
          <div className="h-full bg-action" style={{ width: `${width}%` }} />
        </div>
      </div>
    );
  }

  return (
    <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
      {selections.map((selection) => (
        <span key={selection.id}>
          {selection.label}{" "}
          <span className="font-mono tabular-nums">{formatPercent(selection.percent)}</span>
        </span>
      ))}
    </p>
  );
}

function MatchRow({
  match,
  last,
  rowRef,
}: {
  match: Match;
  last: boolean;
  rowRef: (node: HTMLAnchorElement | null) => void;
}) {
  const winner = match.markets.find((market) => market.id === "winner");
  return (
    <Link
      href={`/matches/${match.id}?market=winner`}
      data-match-id={match.id}
      ref={rowRef}
      className={`block rounded-xl border border-border border-l-2 bg-surface p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action ${sportEdge[match.sport]}`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-muted">
          {SERIES_LABEL[match.series]} · {match.clockLabel}
          {last ? " · Last opened" : ""}
        </p>
        <p className="shrink-0 text-right font-mono text-sm tabular-nums">{match.score.line}</p>
      </div>
      <p className="mt-2 text-base font-semibold">
        {match.homeName}
        <span className="font-normal text-muted"> vs </span>
        {match.awayName}
      </p>
      {winner ? (
        <div className="mt-3">
          <Split selections={winner.selections} />
        </div>
      ) : null}
    </Link>
  );
}

export function LiveListSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading matches">
      {["one", "two", "three", "four"].map((key) => (
        <div key={key} className="h-28 rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}

export function LiveBoard({
  pinLast = false,
  heading = "h1",
}: {
  pinLast?: boolean;
  heading?: "h1" | "h2";
}) {
  const lastId = useLastMatch();
  const [visible, setVisible] = useState<string[]>([]);
  const { snapshot, retry } = useFeed(visible);
  const phase = boardPhase(snapshot);
  const ids = snapshot.matches.map((match) => match.id);
  const refFor = useRowRefs(ids.join("\n"), setVisible);

  const matches = [...snapshot.matches];
  if (pinLast && lastId) {
    matches.sort((a, b) => {
      if (a.id === lastId) return -1;
      if (b.id === lastId) return 1;
      return 0;
    });
  }

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <header className="flex flex-wrap items-center gap-2">
        <span className="size-2 rounded-full bg-action" aria-hidden="true" />
        {heading === "h1" ? (
          <h1 className="text-2xl font-semibold tracking-tight">
            <T id="liveNow" />
          </h1>
        ) : (
          <h2 className="text-2xl font-semibold tracking-tight">
            <T id="liveNow" />
          </h2>
        )}
        <p className="inline-flex h-7 items-center rounded-full border border-border px-2 font-mono text-sm tabular-nums text-muted">
          {snapshot.matches.length} matches
        </p>
      </header>
      <FeedStatus snapshot={snapshot} onRetry={retry} />
      {phase === "loading" ? <LiveListSkeleton /> : null}
      {phase === "empty" ? (
        <p className="text-base text-muted" role="status">
          No matches in play.
        </p>
      ) : null}
      {phase === "ready" ? (
        <ul className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
          {matches.map((match) => (
            <li key={match.id}>
              <MatchRow
                match={match}
                last={Boolean(pinLast && lastId && match.id === lastId)}
                rowRef={refFor(match.id)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
