import test from 'node:test';
import assert from 'node:assert/strict';
import { orderedTenantActivity } from '../src/lib/tenant-activity.mjs';

test('sorts only published entries belonging to the requested tenant', () => {
  const events = [
    { id: 'n1', tenantId: 'north', state: 'published', createdAt: '2026-11-08T09:00:00Z' },
    { id: 's1', tenantId: 'south', state: 'published', createdAt: '2026-11-08T12:00:00Z' },
    { id: 'n2', tenantId: 'north', state: 'draft', createdAt: '2026-11-08T13:00:00Z' }
  ];
  assert.deepEqual(orderedTenantActivity(events, 'north').map(e => e.id), ['n1']);
  assert.equal(events.length, 3);
});
