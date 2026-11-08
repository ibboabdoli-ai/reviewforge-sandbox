export function orderedTenantActivity(events, tenantId) {
  if (!Array.isArray(events) || typeof tenantId !== 'string' || !tenantId.trim()) {
    throw new TypeError('Invalid tenant activity request');
  }
  return events
    .filter(event => event.tenantId === tenantId && event.state === 'published')
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
}
