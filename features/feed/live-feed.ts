import type { FeedMode, FeedSnapshot } from "@/features/feed/types";

/**
 * The only read path for scores and markets.
 * Pages depend on this interface. A socket implementation replaces the mock
 * by changing `getLiveFeed`, not the screens.
 */
export interface LiveFeed {
  /**
   * Full board for first paint. Does not read the clock and does not start a timer.
   * Safe to call during server render.
   */
  peek(): FeedSnapshot;
  /** Full board for first paint. Does not start a timer. */
  getBoard(): FeedSnapshot;
  /**
   * Live ticks for these match ids only. The snapshot's `matches` list is
   * just those ids. Off-screen ids are not revised.
   */
  subscribe(
    matchIds: readonly string[],
    listener: (snapshot: FeedSnapshot) => void,
  ): () => void;
  setMode(mode: FeedMode): void;
}
