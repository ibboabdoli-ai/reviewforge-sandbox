import test from "node:test";
import assert from "node:assert/strict";
import { withTaskLock } from "../src/lib/task-lock.mjs";

test("lock prevents a second same-key task from running concurrently", async () => {
  const locks = new Set();
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const first = withTaskLock(locks, "sample-task", async () => {
    await pending;
    return "finished";
  });
  assert.equal(locks.has("sample-task"), true);
  assert.deepEqual(await withTaskLock(locks, "sample-task", async () => "wrong"),
    { acquired: false, value: null });
  release();
  assert.deepEqual(await first, { acquired: true, value: "finished" });
  assert.equal(locks.has("sample-task"), false);
});
test("lock releases even if the task rejects", async () => {
  const locks = new Set();
  await assert.rejects(withTaskLock(locks, "sample-task", async () => {
    throw new Error("simulated failure");
  }), /simulated failure/);
  assert.equal(locks.has("sample-task"), false);
});
