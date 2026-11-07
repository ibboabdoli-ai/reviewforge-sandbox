import test from 'node:test';
import assert from 'node:assert/strict';
import { bookSeats } from '../src/services/seat-reservations.mjs';

function makeStore(initial) {
  let state = { ...initial };
  return {
    load: async () => ({ ...state }),
    save: async (_id, updated) => { state = { ...updated }; },
    snapshot: () => ({ ...state })
  };
}
test('booking uses remaining seats and refuses an over-capacity request', async () => {
  const store = makeStore({ capacity: 5, reserved: 1 });
  assert.deepEqual(await bookSeats(store, 'event-A', 3),
    { accepted: true, remaining: 1 });
  assert.equal(store.snapshot().reserved, 4);
  assert.deepEqual(await bookSeats(store, 'event-A', 2),
    { accepted: false, reason: 'full' });
});
test('missing events and malformed requests are rejected', async () => {
  const missing = { load: async () => null, save: async () => {} };
  assert.deepEqual(await bookSeats(missing, 'absent', 1),
    { accepted: false, reason: 'missing' });
  await assert.rejects(bookSeats(missing, 'absent', 0), TypeError);
});
