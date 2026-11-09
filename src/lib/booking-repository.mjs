// Synthetic in-memory records. No production data or live services.
export function createBookingRepository(seed = []) {
  const rows = new Map(seed.map(row => [row.id, { ...row }]));
  return {
    async get(id) { return rows.has(id) ? { ...rows.get(id) } : null; },
    async markDepositPaid(id) {
      const row = rows.get(id);
      if (!row) return false;
      rows.set(id, { ...row, depositStatus: 'paid' });
      return true;
    },
    snapshot(id) { return rows.has(id) ? { ...rows.get(id) } : null; }
  };
}
