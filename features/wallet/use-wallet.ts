"use client";

import { useSyncExternalStore } from "react";
import { readWallet, subscribeWallet } from "@/features/wallet/wallet";

export function useWallet() {
  return useSyncExternalStore(subscribeWallet, readWallet, readWallet);
}
