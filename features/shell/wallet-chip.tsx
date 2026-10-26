"use client";

import { formatCredits } from "@/features/feed/format";
import { useWallet } from "@/features/wallet/use-wallet";

export function WalletChip() {
  const wallet = useWallet();
  const amount = formatCredits(wallet.balance);
  return (
    <span className="inline-flex h-10 min-w-0 max-w-36 shrink items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 text-sm">
      <span className="size-2.5 shrink-0 rounded-full bg-you" aria-hidden="true" />
      <span className="truncate font-mono tabular-nums">{amount}</span>
      <span className="sr-only">{wallet.unit}</span>
    </span>
  );
}
