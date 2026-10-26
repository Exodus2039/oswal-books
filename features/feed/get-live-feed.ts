import type { LiveFeed } from "@/features/feed/live-feed";
import { createMockFeed } from "@/features/feed/mock-feed";

let singleton: LiveFeed | undefined;

/**
 * The only feed the screens import.
 * Replace `createMockFeed()` with the socket feed when the backend exists.
 */
export function getLiveFeed(): LiveFeed {
  if (!singleton) singleton = createMockFeed();
  return singleton;
}
