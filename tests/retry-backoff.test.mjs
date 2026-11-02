import test from "node:test";
import assert from "node:assert/strict";
import { cappedBackoffMs } from "../src/lib/retry-backoff.mjs";
test("retries double with an explicit millisecond cap", () => {
  assert.equal(cappedBackoffMs(1), 1000);
  assert.equal(cappedBackoffMs(2), 2000);
  assert.equal(cappedBackoffMs(6), 30000);
  assert.equal(cappedBackoffMs(12), 30000);
});
test("invalid attempts and bounds are rejected", () => {
  assert.throws(() => cappedBackoffMs(0), RangeError);
  assert.throws(() => cappedBackoffMs(13), RangeError);
  assert.throws(() => cappedBackoffMs(1, 4000, 2000), RangeError);
});
