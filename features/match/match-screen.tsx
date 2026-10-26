"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { confirmCode } from "@/features/analytics/events";
import { track } from "@/features/analytics/get-analytics";
import { formatCredits, formatPercent, formatWhen } from "@/features/feed/format";
import { MARKET_IDS, SERIES_LABEL, type MarketId } from "@/features/feed/types";
import { fill, sideLabel, teamLabel, type MessageId } from "@/features/i18n/catalog";
import { useCatalog, useLocale } from "@/features/i18n/locale";
import { FeedStatus } from "@/features/live/feed-status";
import { useFeed } from "@/features/live/use-feed";
import { LOCK_CREDITS, placeCall } from "@/features/match/confirm";
import { MarketBoundary } from "@/features/match/market-boundary";
import { rememberMatch } from "@/features/match/last-match";
import { receiptsSnapshot, saveReceipt, useReceipt } from "@/features/match/receipts";
import { setWalletBalance } from "@/features/wallet/wallet";
import { useWallet } from "@/features/wallet/use-wallet";
import { Button } from "@/shared/ui/button";

const MARKET_MESSAGE: Record<MarketId, MessageId> = {
  winner: "winner",
  runs: "runs",
  bowler: "bowler",
};

function useAfterHydration() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function CrashAfterPaint({ crash }: { crash: boolean }) {
  const ready = useAfterHydration();
  if (crash && ready) throw new Error("market/panel");
  return null;
}

function isMarketId(value: string | undefined): value is MarketId {
  return MARKET_IDS.some((id) => id === value);
}

export function MatchScreen({
  id,
  marketValue,
  selectionId,
  crashPanel = false,
}: {
  id: string;
  marketValue?: string;
  selectionId?: string;
  crashPanel?: boolean;
}) {
  const copy = useCatalog();
  const locale = useLocale();
  const { snapshot, retry } = useFeed([id]);
  const wallet = useWallet();
  const match = snapshot.matches.find((item) => item.id === id) ?? null;
  const knownMarket = isMarketId(marketValue) ? marketValue : undefined;
  const marketOnMatch = match?.markets.find((item) => item.id === knownMarket);
  const market = marketOnMatch ?? match?.markets[0] ?? null;
  const selection = market?.selections.find((item) => item.id === selectionId) ?? null;
  const receipt = useReceipt(id, market?.id ?? "winner");
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    rememberMatch(id);
  }, [id]);

  const openId = match?.id;
  const openSeries = match?.series;
  const openMarketId = market?.id;

  useEffect(() => {
    if (!openId || !openSeries) return;
    track({ name: "match_open", matchId: openId, series: openSeries });
  }, [openId, openSeries]);

  useEffect(() => {
    if (!openMarketId || !selectionId) return;
    track({ name: "selection_made", marketId: openMarketId });
  }, [openMarketId, selectionId]);

  useEffect(() => {
    if (!receipt) return;
    track({ name: "receipt_view" });
  }, [receipt]);

  function onConfirm() {
    if (!match || !market || !selection) return;
    if (pending.current) return;
    if (receiptsSnapshot().some((item) => item.matchId === id && item.marketId === market.id)) {
      return;
    }
    pending.current = true;
    setBusy(true);
    const result = placeCall({
      match,
      marketId: market.id,
      selectionId: selection.id,
      balance: wallet.balance,
      feedMode: snapshot.mode,
    });
    if (result.ok) {
      setWalletBalance(result.nextBalance);
      saveReceipt(result.receipt);
      setFailure(null);
      track({ name: "confirm_result", ok: true });
    } else {
      setFailure(result.code);
      track({ name: "confirm_result", ok: false, code: confirmCode(result.code) });
    }
    pending.current = false;
    setBusy(false);
  }

  if (!match || !market) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{copy.routeMatch}</h1>
        <p className="text-base text-muted" role="status">
          {copy.notInPlay}
        </p>
        <Link
          href="/live"
          className="inline-flex min-h-12 w-fit items-center rounded-xl border border-border px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
        >
          {copy.backToLive}
        </Link>
      </div>
    );
  }

  const unknownMarket = Boolean(marketValue) && !marketOnMatch;

  const leadPercent = Math.max(...market.selections.map((item) => item.percent));

  return (
    <article className="mx-auto flex w-full max-w-6xl flex-col gap-5 pb-28">
      <div className="flex flex-col gap-4">
        <header className="flex flex-col gap-2">
          <p className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-sm font-semibold">
              <span className="size-2 rounded-full bg-action motion-safe:animate-pulse" aria-hidden="true" />
              {copy.cricketLive}
            </span>
            <span className="inline-flex items-center rounded-full bg-you px-2.5 py-1 text-sm font-semibold text-black">
              {SERIES_LABEL[match.series]} · {match.clockLabel}
            </span>
          </p>
          <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
            {sideLabel(locale, match.homeName)}
            <span className="font-normal text-muted"> vs </span>
            {sideLabel(locale, match.awayName)}
          </h1>
          <p className="font-mono text-2xl font-bold tabular-nums text-action">{match.score.line}</p>
        </header>
        <FeedStatus snapshot={snapshot} onRetry={retry} />
      </div>
      <MarketBoundary
        retryHref={`/matches/${id}?market=${market.id}${selection ? `&selection=${selection.id}` : ""}`}
      >
      <section
        className="flex flex-col gap-4 rounded-2xl border-2 border-sport-cricket bg-surface p-4 shadow-[0_0_32px_rgba(61,190,134,0.28)]"
        aria-label={copy[MARKET_MESSAGE[market.id]]}
      >
        <CrashAfterPaint crash={crashPanel} />
        <div role="tablist" aria-label="Markets" className="flex flex-wrap gap-2">
          {match.markets.map((item) => {
            const current = item.id === market.id;
            return (
              <Link
                key={item.id}
                href={`/matches/${id}?market=${item.id}`}
                role="tab"
                aria-selected={current}
                className={`inline-flex min-h-10 items-center rounded-full px-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action ${
                  current
                    ? "bg-action text-action-foreground"
                    : "border border-border bg-background text-foreground"
                }`}
              >
                {copy[MARKET_MESSAGE[item.id]]}
              </Link>
            );
          })}
        </div>
        {unknownMarket ? (
          <p className="text-base text-muted">{fill(copy.unknownMarket, { market: market.id })}</p>
        ) : null}
        <h2 className="text-sm font-bold uppercase tracking-wide">
          {copy[MARKET_MESSAGE[market.id]]}
        </h2>
        <ul className="flex flex-col gap-2 lg:grid lg:grid-cols-2">
          {market.selections.map((item) => {
            const current = item.id === selection?.id;
            const hot = current || (!selection && item.percent === leadPercent);
            return (
              <li key={item.id}>
                <Link
                  href={`/matches/${id}?market=${market.id}&selection=${item.id}`}
                  aria-current={current ? "true" : undefined}
                  className={`block min-h-14 rounded-xl border px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action motion-safe:transition-transform motion-safe:duration-100 active:scale-[0.99] ${
                    hot ? "border-sport-cricket bg-background" : "border-border bg-background"
                  }`}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 break-words text-base font-semibold">
                      {teamLabel(locale, item.id, item.label)}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-lg font-bold tabular-nums ${
                        hot ? "text-action" : "text-foreground"
                      }`}
                    >
                      {formatPercent(item.percent)}
                    </span>
                  </span>
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-border" aria-hidden="true">
                    <span
                      className={`block h-full ${hot ? "bg-action" : "bg-sport-cricket/45"}`}
                      style={{ width: `${Math.min(100, Math.max(0, item.percent))}%` }}
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="font-mono text-sm tabular-nums text-muted">
          {fill(copy.pool, {
            credits: formatCredits(market.selections[0]?.poolCredits ?? Number.NaN),
          })}
        </p>
      </section>
      </MarketBoundary>
      <div className="fixed inset-x-0 bottom-[calc(3.25rem+env(safe-area-inset-bottom))] z-30 border-t border-sport-cricket bg-background px-4 py-3 lg:bottom-0">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {receipt ? (
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">{copy.callPlaced}</h2>
              <p className="text-base">
                {copy[MARKET_MESSAGE[receipt.marketId]]} ·{" "}
                {teamLabel(
                  locale,
                  receipt.selectionId,
                  market.selections.find((item) => item.id === receipt.selectionId)?.label ??
                    receipt.selectionId,
                )}
              </p>
              <p className="font-mono text-sm tabular-nums text-muted">
                {fill(copy.creditsLocked, {
                  credits: formatCredits(receipt.creditsLocked),
                  fee: formatCredits(receipt.feeCredits),
                })}
              </p>
              <p className="font-mono text-sm tabular-nums text-muted">
                <time dateTime={new Date(receipt.createdAt).toISOString()}>
                  {formatWhen(receipt.createdAt)}
                </time>
              </p>
            </div>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                {selection ? (
                  <>
                    <p className="break-words text-lg font-bold">
                      {teamLabel(locale, selection.id, selection.label)}
                    </p>
                    <p className="font-mono text-sm tabular-nums text-muted">
                      <span className="text-action">{formatPercent(selection.percent)}</span>
                      {" · "}
                      {fill(copy.feeLock, {
                        fee: formatCredits(market.feeCredits),
                        lock: formatCredits(LOCK_CREDITS),
                      })}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-bold">{copy.pickSide}</p>
                )}
                {failure ? (
                  <p className="text-base text-muted" role="alert">
                    {failure === "wallet/short"
                      ? copy.walletShort
                      : failure === "feed/unavailable"
                        ? copy.feedUnavailable
                        : copy.pickMissing}{" "}
                    <span className="font-mono text-sm tabular-nums">
                      {fill(copy.code, { code: failure })}
                    </span>
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                className="w-full sm:w-48"
                disabled={!selection || busy}
                onClick={onConfirm}
              >
                {failure ? copy.retry : copy.confirm}
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
