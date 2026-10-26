import assert from "node:assert/strict";
import { createMockFeed } from "./feed/mock-feed";
import { setWalletBalance } from "./wallet/wallet";
import { boardPhase, mergeBoard } from "./live/merge-board";
import { placeCall } from "./match/confirm";

const feed = createMockFeed(() => 1_700_000_000_000);
const board = feed.peek();
assert.equal(boardPhase(null), "loading");
assert.equal(boardPhase({ ...board, matches: [] }), "empty");
assert.equal(boardPhase(board), "ready");

const india = board.matches[0];
const other = board.matches[1];
assert.ok(india && other);

const merged = mergeBoard(board, {
  ...board,
  matches: [{ ...india, score: { ...india.score, revision: 4 } }],
});
assert.equal(merged.matches[0]?.score.revision, 4);
assert.equal(merged.matches[1]?.score.revision, other.score.revision);
assert.equal(merged.matches.length, board.matches.length);

setWalletBalance(1000);
const placed = placeCall({
  match: india,
  marketId: "winner",
  selectionId: "india",
  balance: 1000,
  feedMode: "live",
  now: 1_700_000_000_000,
  receiptId: "rcpt-1",
});
assert.equal(placed.ok, true);
if (placed.ok) {
  assert.equal(placed.receipt.creditsLocked, 100);
  assert.equal(placed.receipt.feeCredits, 0);
  assert.equal(placed.nextBalance, 900);
  assert.equal(placed.receipt.selectionId, "india");
}

const again = placeCall({
  match: india,
  marketId: "winner",
  selectionId: "india",
  balance: 50,
  feedMode: "live",
  now: 1,
  receiptId: "rcpt-2",
});
assert.deepEqual(again, { ok: false, code: "wallet/short" });

const down = placeCall({
  match: india,
  marketId: "winner",
  selectionId: "india",
  balance: 1000,
  feedMode: "error",
  now: 1,
  receiptId: "rcpt-3",
});
assert.deepEqual(down, { ok: false, code: "feed/unavailable" });

setWalletBalance(1000);
console.log("play loop ok");
