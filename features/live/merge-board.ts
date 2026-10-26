import type { FeedSnapshot } from "@/features/feed/types";

/** Fold a partial tick into the full board. Off-screen matches keep their last score. */
export function mergeBoard(board: FeedSnapshot, tick: FeedSnapshot): FeedSnapshot {
  if (tick.mode === "empty") return { ...tick, matches: [] };
  const updates = new Map(tick.matches.map((match) => [match.id, match]));
  const matches = board.matches.map((match) => updates.get(match.id) ?? match);
  for (const match of tick.matches) {
    if (!matches.some((item) => item.id === match.id)) matches.push(match);
  }
  return { ...tick, matches };
}

export type BoardPhase = "loading" | "empty" | "ready";

export function boardPhase(snapshot: FeedSnapshot | null): BoardPhase {
  if (!snapshot) return "loading";
  if (snapshot.matches.length === 0) return "empty";
  return "ready";
}
