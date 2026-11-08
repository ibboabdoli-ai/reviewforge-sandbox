import test from 'node:test';
import assert from 'node:assert/strict';
import { activityPage } from '../src/services/activity-feed.mjs';

const entries = [
  { id: 'e3', tenantId: 'north', state: 'published', createdAt: '2026-11-08T12:00:00Z' },
  { id: 'e1', tenantId: 'north', state: 'published', createdAt: '2026-11-08T10:00:00Z' },
  { id: 'e2', tenantId: 'north', state: 'published', createdAt: '2026-11-08T11:00:00Z' },
  { id: 'secret', tenantId: 'south', state: 'published', createdAt: '2026-11-08T13:00:00Z' }
];

test('lists a page and follows a cursor for distinct timestamps', () => {
  const first = activityPage(entries, { tenantId: 'north', limit: 2 });
  assert.deepEqual(first.items.map(e => e.id), ['e3', 'e2']);
  const second = activityPage(entries, { tenantId: 'north', limit: 2, cursor: first.nextCursor });
  assert.deepEqual(second.items.map(e => e.id), ['e1']);
});

test('does not return another tenant or allow invalid page sizes', () => {
  assert.deepEqual(activityPage(entries, { tenantId: 'south' }).items.map(e => e.id), ['secret']);
  assert.throws(() => activityPage(entries, { tenantId: 'north', limit: 0 }), TypeError);
});
