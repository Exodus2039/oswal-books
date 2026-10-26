"use client";

import { useSyncExternalStore } from "react";
import { catalogs, type Locale, type MessageId } from "@/features/i18n/catalog";

const KEY = "oswal:locale";
const listeners = new Set<() => void>();
let current: Locale = "en";

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "hi";
}

function readStored(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(KEY);
    return isLocale(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

export function readLocale(): Locale {
  if (typeof window !== "undefined") current = readStored();
  return current;
}

export function setLocale(locale: Locale) {
  current = locale;
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    /* the switch still applies for this tab */
  }
  document.documentElement.lang = locale;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, readLocale, () => "en" as Locale);
}

export function useText(id: MessageId): string {
  return catalogs[useLocale()][id];
}

export function useCatalog() {
  const locale = useLocale();
  return catalogs[locale];
}
