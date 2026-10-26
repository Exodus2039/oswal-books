import type { FeedMode, MarketId, Match, Receipt } from "@/features/feed/types";

export const LOCK_CREDITS = 100;

export type ConfirmResult =
  | { ok: true; receipt: Receipt; nextBalance: number }
  | { ok: false; code: string };

export function placeCall(input: {
  match: Match;
  marketId: MarketId;
  selectionId: string;
  balance: number;
  feedMode: FeedMode;
  now?: number;
  receiptId?: string;
}): ConfirmResult {
  const now = input.now ?? Date.now();
  const receiptId = input.receiptId ?? `rcpt-${input.match.id}-${input.marketId}-${now}`;
  if (input.feedMode === "error" || input.feedMode === "empty") {
    return { ok: false, code: "feed/unavailable" };
  }
  const market = input.match.markets.find((item) => item.id === input.marketId);
  if (!market) return { ok: false, code: "market/unknown" };
  const selection = market.selections.find((item) => item.id === input.selectionId);
  if (!selection) return { ok: false, code: "selection/missing" };
  if (!Number.isFinite(input.balance) || input.balance < LOCK_CREDITS + market.feeCredits) {
    return { ok: false, code: "wallet/short" };
  }
  return {
    ok: true,
    nextBalance: input.balance - LOCK_CREDITS - market.feeCredits,
    receipt: {
      id: receiptId,
      matchId: input.match.id,
      marketId: market.id,
      selectionId: selection.id,
      creditsLocked: LOCK_CREDITS,
      feeCredits: market.feeCredits,
      createdAt: now,
    },
  };
}

export function confirmFailureCopy(code: string): string {
  if (code === "wallet/short") return "Not enough credits. Your pick is still selected.";
  if (code === "feed/unavailable") return "The score feed is down. Your pick is still selected.";
  return "That pick is not on this market. Your pick is still selected.";
}
