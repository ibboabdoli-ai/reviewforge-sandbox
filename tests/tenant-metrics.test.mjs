import test from 'node:test';
import assert from 'node:assert/strict';
import { countTenantEvents } from '../src/lib/tenant-metrics.mjs';

test('counts only the requested tenant without modifying input events', () => {
  const entries = [
    { tenantId: 'north', status: 'queued' },
    { tenantId: 'south', status: 'failed' },
    { tenantId: 'north', status: 'completed' },
    { tenantId: 'north', status: 'unknown' }
  ];
  const snapshot = structuredClone(entries);
  assert.deepEqual(countTenantEvents(entries, 'north'),
    { queued: 1, completed: 1, failed: 0 });
  assert.deepEqual(countTenantEvents(entries, 'south'),
    { queued: 0, completed: 0, failed: 1 });
  assert.deepEqual(entries, snapshot);
});
test('invalid request is rejected', () => {
  assert.throws(() => countTenantEvents([], ''), TypeError);
  assert.throws(() => countTenantEvents(null, 'north'), TypeError);
});
