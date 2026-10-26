"use client";

import { useSyncExternalStore } from "react";

const KEY = "oswal:last-match";

export function rememberMatch(id: string) {
  sessionStorage.setItem(KEY, id);
}

function subscribe(listener: () => void) {
  window.addEventListener("focus", listener);
  return () => window.removeEventListener("focus", listener);
}

export function useLastMatch(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => sessionStorage.getItem(KEY),
    () => null,
  );
}
