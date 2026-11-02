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
  return range.end - range.start;
}
