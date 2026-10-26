import {
  APP_VERSION,
  memoryBucket,
  networkBucket,
  viewportBucket,
  type AnalyticsEvent,
  type AnalyticsSink,
} from "@/features/analytics/events";
import { productionSink } from "@/features/analytics/production-sink";
import type { Locale } from "@/features/i18n/catalog";

function devSink(): AnalyticsSink {
  return {
    track(event) {
      console.info("[oswal]", event.name, event);
    },
  };
}

let sink: AnalyticsSink =
  process.env.NODE_ENV === "production" ? productionSink() : devSink();
let sessionStarted = false;

export function setAnalyticsSink(next: AnalyticsSink) {
  sink = next;
}

export function track(event: AnalyticsEvent) {
  sink.track(event);
}

export function trackSessionStart(locale: Locale) {
  if (sessionStarted || typeof window === "undefined") return;
  sessionStarted = true;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string };
  };
  track({
    name: "session_start",
    locale,
    viewport: viewportBucket(window.innerWidth),
    memory: memoryBucket(nav.deviceMemory),
    network: networkBucket(nav.connection?.effectiveType),
    version: APP_VERSION,
  });
}

export function resetSessionStartForTests() {
  sessionStarted = false;
}
