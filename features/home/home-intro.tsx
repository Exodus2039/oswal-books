import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPercent } from "@/features/feed/format";
import { getLiveFeed } from "@/features/feed/get-live-feed";
import { SERIES_LABEL } from "@/features/feed/types";
import { LiveCount, T, TeamName } from "@/features/i18n/text";
import { ButtonLink } from "@/shared/ui/button";

function Bolt() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" className="shrink-0">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor" />
    </svg>
  );
}

function Trust({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-base font-semibold">
      <span
        className="inline-flex size-5 items-center justify-center rounded-full border border-sport-cricket text-sport-cricket"
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width="12" height="12">
          <path
            d="M5 12.5 9.5 17 19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </li>
  );
}

export function HomeIntro() {
  const board = getLiveFeed().peek();
  const featured = board.matches.find((match) => match.id === "ind-aus");
  const winner = featured?.markets.find((market) => market.id === "winner");
  const matchHref = featured ? `/matches/${featured.id}?market=winner` : "/live";

  return (
    <section className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:items-center lg:gap-10">
      <div className="flex flex-col gap-5">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-sport-cricket px-3 py-1 text-sm font-semibold tracking-wide text-sport-cricket">
          <Bolt />
          <T id="indiaCricket" />
        </p>
        <h1 className="text-4xl font-bold uppercase leading-[1.05] tracking-tight lg:text-5xl">
          <T id="headlineLead" />
          <br />
          <T id="headlineRest" />
        </h1>
        <p className="max-w-md text-base text-muted">
          <T id="intro" />
        </p>
        <div className="flex flex-col gap-3">
          <ButtonLink href="/about#whatsapp" variant="mark" className="w-full uppercase">
            <T id="joinWhatsapp" />
          </ButtonLink>
          <ButtonLink href="/live" variant="quiet" className="w-full uppercase tracking-wide">
            <T id="browseLive" />
          </ButtonLink>
        </div>
        <ul className="flex flex-col gap-2.5">
          <Trust>
            <T id="watchLive" />
          </Trust>
          <Trust>
            <T id="creditsLedger" />
          </Trust>
          <Trust>
            <T id="resultsVerified" />
          </Trust>
        </ul>
      </div>
      {featured ? (
        <article className="overflow-hidden rounded-2xl border-2 border-sport-cricket bg-surface shadow-[0_0_32px_rgba(61,190,134,0.28)]">
          <div className="relative">
            <Image
              src="/cricket-feature.webp"
              alt=""
              width={720}
              height={405}
              sizes="(min-width: 1024px) 36rem, 100vw"
              priority
              className="aspect-[16/9] h-auto w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent lg:hidden" />
            <div className="absolute inset-x-3 top-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-sm font-semibold">
                <span className="size-2 rounded-full bg-action motion-safe:animate-pulse" aria-hidden="true" />
                <T id="cricketLive" />
              </span>
              <span className="inline-flex items-center rounded-full bg-you px-2.5 py-1 text-sm font-semibold text-black">
                {SERIES_LABEL[featured.series]} · {featured.clockLabel}
              </span>
            </div>
            <Link
              href={matchHref}
              className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action lg:hidden"
            >
              <span className="absolute inset-x-0 bottom-0 px-4 pb-3">
                <span className="block text-lg font-semibold">
                  <TeamName id={featured.markets[0]?.selections[0]?.id ?? "home"} fallback={featured.homeName} />
                {" vs "}
                <TeamName id={featured.markets[0]?.selections[1]?.id ?? "away"} fallback={featured.awayName} />
                </span>
                <span className="mt-0.5 block font-mono text-base font-bold tabular-nums text-action">
                  {featured.score.line}
                </span>
              </span>
            </Link>
          </div>
          <div className="hidden flex-col gap-4 p-4 lg:flex">
            <Link
              href={matchHref}
              className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
            >
              <span className="block text-2xl font-bold tracking-tight">
                <TeamName id={featured.markets[0]?.selections[0]?.id ?? "home"} fallback={featured.homeName} />
                {" vs "}
                <TeamName id={featured.markets[0]?.selections[1]?.id ?? "away"} fallback={featured.awayName} />
              </span>
              <span className="mt-1 block font-mono text-xl font-bold tabular-nums text-action">
                {featured.score.line}
              </span>
            </Link>
            {winner ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-wide">
                    <T id="winner" />
                  </h2>
                  <p className="inline-flex h-7 items-center rounded-full bg-you px-2.5 text-sm font-bold text-black">
                    <LiveCount count={board.matches.length} />
                  </p>
                </div>
                <ul className="flex flex-col gap-2">
                  {winner.selections.map((selection) => {
                    const leading =
                      selection.percent ===
                      Math.max(...winner.selections.map((item) => item.percent));
                    return (
                      <li key={selection.id}>
                        <Link
                          href={`${matchHref}&selection=${selection.id}`}
                          className={`block min-h-14 rounded-xl border px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action motion-safe:transition-transform motion-safe:duration-100 active:scale-[0.99] ${
                            leading
                              ? "border-sport-cricket bg-background"
                              : "border-border bg-background"
                          }`}
                        >
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="min-w-0 break-words text-base font-semibold">
                              <TeamName id={selection.id} fallback={selection.label} />
                            </span>
                            <span
                              className={`shrink-0 font-mono text-lg font-bold tabular-nums ${
                                leading ? "text-action" : "text-foreground"
                              }`}
                            >
                              {formatPercent(selection.percent)}
                            </span>
                          </span>
                          <span
                            className="mt-2 block h-2 overflow-hidden rounded-full bg-border"
                            aria-hidden="true"
                          >
                            <span
                              className={`block h-full ${leading ? "bg-action" : "bg-sport-cricket/45"}`}
                              style={{
                                width: `${Math.min(100, Math.max(0, selection.percent))}%`,
                              }}
                            />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
            <Link
              href={matchHref}
              className="inline-flex min-h-11 items-center justify-between text-sm font-bold uppercase tracking-wide text-sport-cricket focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
            >
              <T id="viewMatch" />
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ) : null}
    </section>
  );
}
