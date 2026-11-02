// Delays are milliseconds; attempts begin at 1, capped at 12.
export function cappedBackoffMs(attempt, initialMs = 1000, maximumMs = 30000) {
  if (!Number.isSafeInteger(attempt) || attempt < 1 || attempt > 12 ||
      !Number.isSafeInteger(initialMs) || initialMs < 1 ||
      !Number.isSafeInteger(maximumMs) || maximumMs < initialMs) {
    throw new RangeError("Invalid retry schedule");
  }
  return Math.min(maximumMs, initialMs * 2 ** (attempt - 1));
}
