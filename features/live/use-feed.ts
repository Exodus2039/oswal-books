"use client";

import { useEffect, useState } from "react";
import { getLiveFeed } from "@/features/feed/get-live-feed";
import type { FeedSnapshot } from "@/features/feed/types";
import { feedListens } from "@/features/live/listen";
import { mergeBoard } from "@/features/live/merge-board";

/**
 * Holds the full board and subscribes only to `matchIds`.
 * Ticks are painted once per frame. A hidden tab unsubscribes.
 */
export function useFeed(matchIds: readonly string[]) {
  const [snapshot, setSnapshot] = useState<FeedSnapshot>(() => getLiveFeed().peek());
  const idsKey = matchIds.join("\n");

  useEffect(() => {
    const ids = idsKey ? idsKey.split("\n") : [];
    if (ids.length === 0) return;

    let frame = 0;
    let pending: FeedSnapshot | null = null;
    let stop = () => {};

    const flush = () => {
      frame = 0;
      const tick = pending;
      pending = null;
      if (!tick) return;
      setSnapshot((board) => mergeBoard(board, tick));
    };

    const listen = () => {
      stop();
      if (!feedListens(document.visibilityState)) return;
      stop = getLiveFeed().subscribe(ids, (tick) => {
        pending = tick;
        if (frame) return;
        frame = requestAnimationFrame(flush);
      });
    };

    listen();
    document.addEventListener("visibilitychange", listen);
    return () => {
      document.removeEventListener("visibilitychange", listen);
      if (frame) cancelAnimationFrame(frame);
      stop();
    };
  }, [idsKey]);

  function retry() {
    const feed = getLiveFeed();
    feed.setMode("live");
    setSnapshot(feed.getBoard());
  }

  return { snapshot, retry };
}
