import type { LiveFeed } from "@/features/feed/live-feed";
import type { FeedMode, FeedSnapshot, Match } from "@/features/feed/types";
import { readWallet } from "@/features/wallet/wallet";

const TICK_MS = 1000;
const ERROR_CODE = "feed/unavailable";

const SEED: readonly Match[] = [
  {
    id: "ind-aus",
    sport: "cricket",
    series: "t20i",
    clockLabel: "14.2 overs",
    homeName: "India",
    awayName: "Australia",
    score: { line: "168/4 · target 185", revision: 0 },
    markets: [
      {
        id: "winner",
        title: "Who will win?",
        feeCredits: 0,
        selections: [
          { id: "india", label: "India", percent: 64, poolCredits: 185_000 },
          { id: "australia", label: "Australia", percent: 36, poolCredits: 185_000 },
        ],
      },
      {
        id: "runs",
        title: "Will India score 180+ runs?",
        feeCredits: 0,
        selections: [
          { id: "yes", label: "Yes (180+)", percent: 58, poolCredits: 95_000 },
          { id: "no", label: "No (under 180)", percent: 42, poolCredits: 95_000 },
        ],
      },
      {
        id: "bowler",
        title: "Who will take the most wickets?",
        feeCredits: 0,
        selections: [
          { id: "bumrah", label: "Jasprit Bumrah", percent: 48, poolCredits: 120_000 },
          { id: "siraj", label: "Mohammed Siraj", percent: 31, poolCredits: 120_000 },
          { id: "other", label: "Other bowler", percent: 21, poolCredits: 120_000 },
        ],
      },
    ],
  },
  {
    id: "rcb-mi",
    sport: "cricket",
    series: "ipl",
    clockLabel: "16.4 overs",
    homeName: "Royal Challengers Bengaluru",
    awayName: "Mumbai Indians",
    score: { line: "142/6 · target 178", revision: 0 },
    markets: [
      {
        id: "winner",
        title: "Who will win?",
        feeCredits: 0,
        selections: [
          { id: "rcb", label: "Royal Challengers Bengaluru", percent: 55, poolCredits: 210_000 },
          { id: "mi", label: "Mumbai Indians", percent: 45, poolCredits: 210_000 },
        ],
      },
    ],
  },
  {
    id: "dc-gt",
    sport: "cricket",
    series: "wpl",
    clockLabel: "12.1 overs",
    homeName: "Delhi Capitals",
    awayName: "Gujarat Titans",
    score: { line: "98/3 · target 156", revision: 0 },
    markets: [
      {
        id: "winner",
        title: "Who will win?",
        feeCredits: 0,
        selections: [
          { id: "dc", label: "Delhi Capitals", percent: 47, poolCredits: 64_000 },
          { id: "gt", label: "Gujarat Titans", percent: 53, poolCredits: 64_000 },
        ],
      },
    ],
  },
  {
    id: "mum-tn",
    sport: "cricket",
    series: "ranji",
    clockLabel: "Day 2",
    homeName: "Mumbai",
    awayName: "Tamil Nadu",
    score: { line: "312/7", revision: 0 },
    markets: [
      {
        id: "winner",
        title: "Who will win?",
        feeCredits: 0,
        selections: [
          { id: "mumbai", label: "Mumbai", percent: 62, poolCredits: 18_000 },
          { id: "tamil-nadu", label: "Tamil Nadu", percent: 38, poolCredits: 18_000 },
        ],
      },
    ],
  },
];

type Subscription = {
  matchIds: ReadonlySet<string>;
  listener: (snapshot: FeedSnapshot) => void;
};

export function createMockFeed(now: () => number = Date.now): LiveFeed {
  let mode: FeedMode = "live";
  let updatedAt = 0;
  let errorCode: string | undefined;
  let matches = SEED.map((match) => structuredClone(match));
  let timer: ReturnType<typeof setInterval> | undefined;
  const subscriptions = new Set<Subscription>();

  function snapshotFor(
    ids: ReadonlySet<string> | "all",
    frozen: boolean,
  ): FeedSnapshot {
    const at = frozen ? updatedAt : now();
    const board = mode === "empty" ? [] : matches;
    const visible =
      ids === "all" ? board : board.filter((match) => ids.has(match.id));
    return {
      mode,
      updatedAt,
      ageMs: frozen ? 0 : Math.max(0, at - updatedAt),
      errorCode: mode === "error" ? errorCode : undefined,
      matches: visible,
      wallet: readWallet(),
    };
  }

  function emit() {
    for (const subscription of subscriptions) {
      subscription.listener(snapshotFor(subscription.matchIds, false));
    }
  }

  function stopTimer() {
    if (timer === undefined) return;
    clearInterval(timer);
    timer = undefined;
  }

  function tick() {
    if (mode !== "live") return;
    const watched = new Set<string>();
    for (const subscription of subscriptions) {
      for (const id of subscription.matchIds) watched.add(id);
    }
    if (watched.size === 0) return;
    updatedAt = now();
    matches = matches.map((match) => {
      if (!watched.has(match.id)) return match;
      return {
        ...match,
        score: { ...match.score, revision: match.score.revision + 1 },
      };
    });
    emit();
  }

  function ensureTimer() {
    if (timer !== undefined || subscriptions.size === 0) return;
    timer = setInterval(tick, TICK_MS);
  }

  return {
    peek() {
      return snapshotFor("all", true);
    },
    getBoard() {
      return snapshotFor("all", false);
    },
    subscribe(matchIds, listener) {
      const subscription: Subscription = {
        matchIds: new Set(matchIds),
        listener,
      };
      subscriptions.add(subscription);
      ensureTimer();
      listener(snapshotFor(subscription.matchIds, false));
      return () => {
        subscriptions.delete(subscription);
        if (subscriptions.size === 0) stopTimer();
      };
    },
    setMode(next) {
      mode = next;
      if (next === "error") {
        errorCode = ERROR_CODE;
      } else {
        errorCode = undefined;
      }
      if (next === "live") updatedAt = now();
      emit();
    },
  };
}

