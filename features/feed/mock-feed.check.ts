import assert from "node:assert/strict";
import { createMockFeed } from "./mock-feed";
import { readWallet, setWalletBalance } from "../wallet/wallet";

async function main() {
  const start = 1_700_000_000_000;
  let clock = start;
  const feed = createMockFeed(() => clock);

  const board = feed.getBoard();
  assert.equal(board.matches.length, 4);
  assert.equal(board.wallet, readWallet());
  assert.equal(board.matches[0]?.markets[0]?.selections[0]?.percent, 64);
  assert.equal(board.matches[0]?.markets[0]?.selections[1]?.percent, 36);

  const india = board.matches[0];
  const other = board.matches[1];
  assert.ok(india && other);

  let seen = 0;
  const stop = feed.subscribe([india.id], (snapshot) => {
    seen += 1;
    if (seen === 1) {
      assert.equal(snapshot.matches.length, 1);
      assert.equal(snapshot.matches[0]?.id, india.id);
    }
    assert.equal(snapshot.wallet, readWallet());
  });

  assert.equal(seen, 1);
  assert.equal(feed.getBoard().matches[1]?.score.revision, 0);

  clock += 1000;
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const after = feed.getBoard();
  assert.equal(after.matches[0]?.score.revision, 1);
  assert.equal(after.matches[1]?.score.revision, 0);
  assert.equal(after.matches[0]?.score.line, "168/4 · target 185");

  feed.setMode("stale");
  const staleAt = feed.getBoard().updatedAt;
  clock += 5000;
  await new Promise((resolve) => setTimeout(resolve, 1100));
  const stale = feed.getBoard();
  assert.equal(stale.mode, "stale");
  assert.equal(stale.updatedAt, staleAt);
  assert.equal(stale.matches[0]?.score.revision, 1);
  assert.ok(stale.ageMs >= 5000);

  feed.setMode("empty");
  assert.equal(feed.getBoard().matches.length, 0);
  assert.equal(feed.peek().ageMs, 0);
  assert.equal(feed.getBoard().wallet.balance, 1000);

  feed.setMode("error");
  const failed = feed.getBoard();
  assert.equal(failed.mode, "error");
  assert.equal(failed.errorCode, "feed/unavailable");
  assert.equal(failed.matches.length, 4);
  assert.equal(failed.matches[0]?.score.line, "168/4 · target 185");

  setWalletBalance(25);
  assert.equal(feed.getBoard().wallet.balance, 25);
  assert.equal(readWallet().balance, 25);

  stop();
  const revision = feed.getBoard().matches[0]?.score.revision;
  feed.setMode("live");
  clock += 1000;
  await new Promise((resolve) => setTimeout(resolve, 1100));
  assert.equal(feed.getBoard().matches[0]?.score.revision, revision);

  setWalletBalance(1000);
  console.log("mock feed ok");
}

void main();
