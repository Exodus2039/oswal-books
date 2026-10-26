"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, trackSessionStart } from "@/features/analytics/get-analytics";
import type { VitalName } from "@/features/analytics/events";
import { useLocale } from "@/features/i18n/locale";

const VITALS = new Set<VitalName>(["LCP", "INP", "CLS"]);

function isVital(name: string): name is VitalName {
  return VITALS.has(name as VitalName);
}

export function ShellAnalytics() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    trackSessionStart(locale);
  }, [locale]);

  useEffect(() => {
    track({ name: "screen_view", route: pathname });
  }, [pathname]);

  useReportWebVitals((metric) => {
    if (!isVital(metric.name)) return;
    track({
      name: "web_vital",
      route: window.location.pathname,
      metric: metric.name,
      value: metric.value,
    });
  });

  return null;
}
