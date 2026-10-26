/** Domain types for the play loop. Screens import these from this module only. */

/** Oswal Books is cricket only. */
export const SPORT_IDS = ["cricket"] as const;

export type SportId = (typeof SPORT_IDS)[number];

export const SPORT_LABEL: Record<SportId, string> = {
  cricket: "Cricket",
};

/** What the board groups by: an international or a domestic competition. */
export const SERIES_IDS = ["t20i", "ipl", "wpl", "ranji"] as const;

export type SeriesId = (typeof SERIES_IDS)[number];

export const SERIES_LABEL: Record<SeriesId, string> = {
  t20i: "T20I",
  ipl: "IPL",
  wpl: "WPL",
  ranji: "Ranji Trophy",
};

/** Market ids are also the `market` query param on `/matches/[id]`. */
export const MARKET_IDS = ["winner", "runs", "bowler"] as const;

export type MarketId = (typeof MARKET_IDS)[number];

export type Selection = {
  id: string;
  label: string;
  /** Share of the pool, already summed on the server. 0–100. */
  percent: number;
  /** Pool size in credits, already summed on the server. */
  poolCredits: number;
};

export type Market = {
  id: MarketId;
  title: string;
  /** Fee in credits. Zero is a real value and must be shown. */
  feeCredits: number;
  selections: Selection[];
};

export type Score = {
  /** Server-formatted score line. The client does not assemble it. */
  line: string;
  /** Bumps when the feed ticks this match. Display text can stay put. */
  revision: number;
};

export type Match = {
  id: string;
  sport: SportId;
  series: SeriesId;
  /** Server clock such as "14.2 overs" or "Day 2". */
  clockLabel: string;
  homeName: string;
  awayName: string;
  score: Score;
  markets: Market[];
};

export type Wallet = {
  unit: "credits";
  balance: number;
};

export type Receipt = {
  id: string;
  matchId: string;
  marketId: MarketId;
  selectionId: string;
  creditsLocked: number;
  feeCredits: number;
  createdAt: number;
};

export type FeedMode = "live" | "stale" | "empty" | "error";

export type FeedSnapshot = {
  mode: FeedMode;
  /** Epoch ms of the last live tick. Frozen while stale or in error. */
  updatedAt: number;
  ageMs: number;
  errorCode?: string;
  matches: readonly Match[];
  wallet: Wallet;
};
