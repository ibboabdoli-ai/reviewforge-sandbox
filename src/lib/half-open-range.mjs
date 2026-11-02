// Intervals are [start, end): touching endpoints do not overlap.
function assertRange(range) {
  if (!range || !Number.isSafeInteger(range.start) ||
      !Number.isSafeInteger(range.end) || range.start >= range.end) {
    throw new RangeError("Expected a nonempty integer interval");
  }
}
export function overlapsHalfOpen(left, right) {
  assertRange(left);
  assertRange(right);
  return left.start < right.end && right.start < left.end;
}
export function duration(range) {
  assertRange(range);
  const result = range.end - range.start;
  if (!Number.isSafeInteger(result)) throw new RangeError("Duration exceeds safe integer range");
  return result;
}
