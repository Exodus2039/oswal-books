import type { Locale } from "@/features/i18n/catalog";

export const APP_VERSION = "0.1.0";

export type ViewportBucket = "narrow" | "regular" | "wide";
export type MemoryBucket = "low" | "typical" | "unknown";
export type NetworkBucket = "slow" | "fast" | "unknown";
export type VitalName = "LCP" | "INP" | "CLS";

export type ConfirmCode =
  | "feed/unavailable"
  | "wallet/short"
  | "market/unknown"
  | "selection/missing";

/** Measurement events. No name, phone, or free-text note. */
export type AnalyticsEvent =
  | {
      name: "session_start";
      locale: Locale;
      viewport: ViewportBucket;
      memory: MemoryBucket;
      network: NetworkBucket;
      version: string;
    }
  | { name: "screen_view"; route: string }
  | { name: "match_open"; matchId: string; series: string }
  | { name: "selection_made"; marketId: string }
  | { name: "confirm_result"; ok: true }
  | { name: "confirm_result"; ok: false; code: ConfirmCode }
  | { name: "receipt_view" }
  | { name: "feed_stale"; ageMs: number }
  | { name: "web_vital"; route: string; metric: VitalName; value: number };

export interface AnalyticsSink {
  track(event: AnalyticsEvent): void;
}

export function viewportBucket(width: number): ViewportBucket {
  if (width < 768) return "narrow";
  if (width < 1200) return "regular";
  return "wide";
}

export function memoryBucket(deviceMemory: number | undefined): MemoryBucket {
  if (deviceMemory === undefined || !Number.isFinite(deviceMemory)) return "unknown";
  if (deviceMemory <= 4) return "low";
  return "typical";
}

export function networkBucket(effectiveType: string | undefined): NetworkBucket {
  if (!effectiveType) return "unknown";
  if (effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g") {
    return "slow";
  }
  if (effectiveType === "4g") return "fast";
  return "unknown";
}

export function confirmCode(code: string): ConfirmCode {
  if (
    code === "feed/unavailable" ||
    code === "wallet/short" ||
    code === "market/unknown" ||
    code === "selection/missing"
  ) {
    return code;
  }
  return "selection/missing";
}
