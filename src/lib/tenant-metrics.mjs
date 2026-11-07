export function countTenantEvents(events, tenantId) {
  if (!Array.isArray(events) || typeof tenantId !== 'string' || !tenantId.trim()) {
    throw new TypeError('Invalid event metrics request');
  }
  const counts = { queued: 0, completed: 0, failed: 0 };
  for (const event of events) {
    if (event?.tenantId !== tenantId) continue;
    if (Object.hasOwn(counts, event.status)) counts[event.status]++;
  }
  return counts;
}
