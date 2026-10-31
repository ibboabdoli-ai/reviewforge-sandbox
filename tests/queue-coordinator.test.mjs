import test from "node:test";
import assert from "node:assert/strict";
import { nextAttemptAt, completeTask } from "../src/lib/queue-coordinator.mjs";

test("schedules a retry for a positive delay", () => {
  const now = Date.UTC(2026, 9, 30, 12, 0, 0);
  assert.ok(nextAttemptAt(now, 15) > now);
});

test("rejects negative retry durations", () => {
  assert.throws(() => nextAttemptAt(Date.UTC(2026, 9, 30), -1), TypeError);
});

test("saves job completion and notifies the worker", async () => {
  const events = [];
  const saveState = async (id, data) => {
    events.push({ action: "saved", id, status: data.status });
  };
  const emitCompletion = id => events.push({ action: "emitted", id });
  const result = await completeTask("job-101", saveState, emitCompletion);
  assert.deepEqual(result, { ok: true, id: "job-101" });
  assert.deepEqual(events, [
    { action: "saved", id: "job-101", status: "completed" },
    { action: "emitted", id: "job-101" },
  ]);
});
