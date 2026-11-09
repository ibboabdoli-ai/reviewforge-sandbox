// Small deterministic test double for transaction-scoped advisory locking.
// This file never opens a database connection.
export function createTransactionPool() {
  const active = new Map();
  return {
    isHeld(workspaceId) { return active.has(workspaceId); },
    connect() {
      let owner = null;
      let lockTimeoutMs = 250;
      let closed = false;
      return {
        async query(sql, values = []) {
          if (closed) throw new Error('CLOSED_CONNECTION');
          if (sql === 'BEGIN') return;
          if (sql.startsWith('SET LOCAL lock_timeout')) {
            lockTimeoutMs = Number(/'(\d+)ms'/.exec(sql)?.[1] ?? 250);
            return;
          }
          if (sql.startsWith('SET LOCAL idle_in_transaction_session_timeout')) return;
          if (sql.startsWith('SELECT pg_advisory_xact_lock')) {
            const workspaceId = values[0];
            if (!active.has(workspaceId)) {
              active.set(workspaceId, []);
              owner = workspaceId;
              return;
            }
            await new Promise((resolve, reject) => {
              const waiter = { resolve: () => { owner = workspaceId; resolve(); }, reject };
              active.get(workspaceId).push(waiter);
              setTimeout(() => {
                const queue = active.get(workspaceId);
                if (!queue) return;
                const at = queue.indexOf(waiter);
                if (at >= 0) { queue.splice(at, 1); reject(new Error('LOCK_TIMEOUT')); }
              }, lockTimeoutMs);
            });
            return;
          }
          if (sql === 'ROLLBACK') {
            if (owner) {
              const waiters = active.get(owner) || [];
              const next = waiters.shift();
              if (next) next.resolve();
              else active.delete(owner);
              owner = null;
            }
            return;
          }
          throw new Error('Unexpected synthetic query');
        },
        async close() { closed = true; }
      };
    }
  };
}
