import assert from "node:assert/strict";
import { createMockFeed } from "./feed/mock-feed";
import { feedListens } from "./live/listen";
import { mergeBoard } from "./live/merge-board";
import { placeCall } from "./match/confirm";

assert.equal(feedListens("hidden"), false);
assert.equal(feedListens("visible"), true);

const feed = createMockFeed(() => 1_700_000_000_000);
const board = feed.peek();
const india = board.matches[0];
assert.ok(india);

const down = mergeBoard(board, {
  ...board,
  mode: "error",
  errorCode: "feed/unavailable",
  matches: [],
});
assert.equal(down.mode, "error");
assert.equal(down.errorCode, "feed/unavailable");
assert.equal(down.matches[0]?.score.line, india.score.line);

const back = mergeBoard(down, { ...board, mode: "live", matches: [india] });
assert.equal(back.matches[0]?.score.line, india.score.line);
assert.equal(back.matches.length, down.matches.length);

const failed = placeCall({
  match: india,
  marketId: "winner",
  selectionId: "india",
  balance: 1000,
  feedMode: "error",
  now: 1_700_000_000_000,
});
assert.equal(failed.ok, false);
if (!failed.ok) assert.equal(failed.code, "feed/unavailable");

console.log("resilience ok");
