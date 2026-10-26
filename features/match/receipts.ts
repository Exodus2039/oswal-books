"use client";

import { useSyncExternalStore } from "react";
import type { MarketId, Receipt } from "@/features/feed/types";

const KEY = "oswal:receipts";
const EMPTY: readonly Receipt[] = [];

let cache: readonly Receipt[] = EMPTY;
const listeners = new Set<() => void>();

function readStorage(): readonly Receipt[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed as Receipt[];
  } catch {
    return EMPTY;
  }
}

function publish(next: readonly Receipt[]) {
  cache = next;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(KEY, JSON.stringify(next));
  }
  for (const listener of listeners) listener();
}

export function subscribeReceipts(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function receiptsSnapshot(): readonly Receipt[] {
  if (cache === EMPTY && typeof window !== "undefined") cache = readStorage();
  return cache;
}

export function receiptsServerSnapshot(): readonly Receipt[] {
  return EMPTY;
}

export function saveReceipt(receipt: Receipt) {
  const current = receiptsSnapshot().filter(
    (item) => !(item.matchId === receipt.matchId && item.marketId === receipt.marketId),
  );
  publish([...current, receipt]);
}

export function useReceipt(matchId: string, marketId: MarketId): Receipt | null {
  const receipts = useSyncExternalStore(
    subscribeReceipts,
    receiptsSnapshot,
    receiptsServerSnapshot,
  );
  return receipts.find((item) => item.matchId === matchId && item.marketId === marketId) ?? null;
}
