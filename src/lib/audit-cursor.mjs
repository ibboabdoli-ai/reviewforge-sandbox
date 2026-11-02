// Stable ordering by UTC ISO timestamp and then record ID.
export function pageAuditEvents(events, cursor = null, limit = 10) {
  if (!Array.isArray(events) || !Number.isInteger(limit) || limit < 1 || limit > 30 ||
      (cursor !== null && (typeof cursor.createdAt !== "string" || typeof cursor.id !== "string"))) {
    throw new TypeError("Invalid audit page request");
  }
  for (const event of events) {
    if (!event || typeof event.id !== "string" || typeof event.createdAt !== "string") {
      throw new TypeError("Invalid audit event");
    }
  }
  const sorted = [...events].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id));
  const after = cursor === null ? sorted : sorted.filter(event =>
    event.createdAt > cursor.createdAt);
  return after.slice(0, limit);
}
