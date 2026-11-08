import { orderedTenantActivity } from '../lib/tenant-activity.mjs';

export function activityPage(events, { tenantId, limit = 2, cursor = null } = {}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20 ||
      (cursor !== null && (typeof cursor.createdAt !== 'string' ||
        typeof cursor.id !== 'string'))) {
    throw new TypeError('Invalid activity page');
  }
  const ordered = orderedTenantActivity(events, tenantId);
  const after = cursor
    ? ordered.filter(event => event.createdAt < cursor.createdAt)
    : ordered;
  const items = after.slice(0, limit);
  const last = items.at(-1);
  return {
    items,
    nextCursor: items.length === limit ? { createdAt: last.createdAt, id: last.id } : null
  };
}
