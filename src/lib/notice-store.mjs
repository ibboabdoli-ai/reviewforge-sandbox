// Synthetic in-memory fixture with per-event serialization; never a production store.
export function createNoticeStore() {
  const sent = new Set();
  const locks = new Map();
  return {
    async withEventLock(id, work) {
      const previous = locks.get(id) || Promise.resolve();
      let unlock;
      const next = new Promise(resolve => { unlock = resolve; });
      locks.set(id, next);
      await previous;
      try { return await work(); }
      finally { unlock(); if (locks.get(id) === next) locks.delete(id); }
    },
    async wasSent(id) { return sent.has(id); },
    async markSent(id) { sent.add(id); },
    snapshot() { return [...sent]; }
  };
}
