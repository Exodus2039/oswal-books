"use client";

import { useEffect } from "react";
import { fill, teamLabel } from "@/features/i18n/catalog";
import { useLocale, useText } from "@/features/i18n/locale";
import type { MessageId } from "@/features/i18n/catalog";

export function T({ id }: { id: MessageId }) {
  return useText(id);
}

export function TeamName({ id, fallback }: { id: string; fallback: string }) {
  return teamLabel(useLocale(), id, fallback);
}

export function LiveCount({ count }: { count: number }) {
  return fill(useText("liveCount"), { count });
}

export function LocaleRoot() {
  const locale = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
