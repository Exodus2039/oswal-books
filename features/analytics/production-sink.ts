import type { AnalyticsSink } from "@/features/analytics/events";

/** Swap this file when a real collector exists. It records nothing. */
export function productionSink(): AnalyticsSink {
  return {
    track() {},
  };
}
