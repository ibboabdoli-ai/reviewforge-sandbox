import test from "node:test";
import assert from "node:assert/strict";
import { overlapsHalfOpen, duration } from "../src/lib/half-open-range.mjs";
test("adjacent half-open ranges do not overlap", () => {
  assert.equal(overlapsHalfOpen({start:0,end:10},{start:10,end:20}), false);
  assert.equal(overlapsHalfOpen({start:0,end:11},{start:10,end:20}), true);
  assert.equal(overlapsHalfOpen({start:10,end:20},{start:0,end:11}), true);
});
test("duration and invalid empty ranges", () => {
  assert.equal(duration({start:-5,end:5}), 10);
  assert.throws(() => duration({start:5,end:5}), RangeError);
  assert.throws(() => duration({start:-Number.MAX_SAFE_INTEGER,end:Number.MAX_SAFE_INTEGER}), RangeError);
});
