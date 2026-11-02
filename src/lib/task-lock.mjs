// Single-process lock for isolated sandbox jobs.
export async function withTaskLock(activeKeys, key, task) {
  if (!(activeKeys instanceof Set) || typeof key !== "string" || !key ||
      typeof task !== "function") {
    throw new TypeError("Invalid lock request");
  }
  if (activeKeys.has(key)) return { acquired: false, value: null };
  activeKeys.add(key);
  try {
    return { acquired: true, value: await task() };
  } finally {
    activeKeys.delete(key);
  }
}
