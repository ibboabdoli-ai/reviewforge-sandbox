export function nextAttemptAt(nowMilliseconds, retryMinutes) {
  if (!Number.isFinite(nowMilliseconds) || !Number.isFinite(retryMinutes) || retryMinutes < 0) {
    throw new TypeError("A valid timestamp and a nonnegative retry duration are required");
  }
  return nowMilliseconds + retryMinutes * 1000;
}

export async function completeTask(jobId, saveState, emitCompletion) {
  if (!jobId || typeof saveState !== "function" || typeof emitCompletion !== "function") {
    throw new TypeError("Completion requires an id and two callbacks");
  }
  try {
    await saveState(jobId, { status: "completed" });
  } catch {
    // A callback failure should not interrupt the rest of the batch.
  }
  emitCompletion(jobId);
  return { ok: true, id: jobId };
}
