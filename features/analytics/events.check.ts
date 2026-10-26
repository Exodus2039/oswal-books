import assert from "node:assert/strict";
import {
  confirmCode,
  memoryBucket,
  networkBucket,
  viewportBucket,
  type AnalyticsEvent,
  type AnalyticsSink,
} from "./events";
import { resetSessionStartForTests, setAnalyticsSink, track } from "./get-analytics";

const seen: AnalyticsEvent[] = [];
const sink: AnalyticsSink = {
  track(event) {
    seen.push(event);
    console.info("[oswal]", event.name, event);
  },
};
setAnalyticsSink(sink);
resetSessionStartForTests();

const play: AnalyticsEvent[] = [
  {
    name: "session_start",
    locale: "hi",
    viewport: viewportBucket(360),
    memory: memoryBucket(4),
    network: networkBucket("3g"),
    version: "0.1.0",
  },
  { name: "screen_view", route: "/matches/ind-aus" },
  { name: "match_open", matchId: "ind-aus", series: "t20i" },
  { name: "selection_made", marketId: "winner" },
  { name: "confirm_result", ok: false, code: confirmCode("feed/unavailable") },
  { name: "confirm_result", ok: true },
  { name: "receipt_view" },
  { name: "feed_stale", ageMs: 3000 },
  { name: "web_vital", route: "/matches/ind-aus", metric: "INP", value: 80 },
];

for (const event of play) track(event);

const names = seen.map((event) => event.name);
assert.deepEqual(names, [
  "session_start",
  "screen_view",
  "match_open",
  "selection_made",
  "confirm_result",
  "confirm_result",
  "receipt_view",
  "feed_stale",
  "web_vital",
]);

const text = JSON.stringify(seen);
assert.equal(text.includes("phone"), false);
assert.equal(text.includes("@"), false);
assert.equal(viewportBucket(360), "narrow");
assert.equal(memoryBucket(4), "low");
assert.equal(networkBucket("3g"), "slow");

console.log("analytics ok");
