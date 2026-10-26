import type { Wallet } from "@/features/feed/types";

/**
 * Single wallet store. Header, confirm, and the feed snapshot all read
 * through `readWallet`. Nothing else keeps a balance.
 */

const listeners = new Set<() => void>();

/** Demo balance so a 100-credit call can be placed. Refresh starts here again. */
let current: Wallet = { unit: "credits", balance: 1000 };

export function readWallet(): Wallet {
  return current;
}

export function subscribeWallet(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setWalletBalance(balance: number): void {
  if (current.balance === balance) return;
  current = { unit: "credits", balance };
  for (const listener of listeners) listener();
}
