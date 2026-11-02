import test from "node:test";
import assert from "node:assert/strict";
import { reserveTickets, remainingTickets } from "../src/lib/ticket-capacity.mjs";

test("ordinary reservation reduces remaining capacity", () => {
  assert.deepEqual(reserveTickets(10, 3, 2), { accepted: true, remaining: 5 });
});
test("overbooked reservations are declined", () => {
  assert.deepEqual(reserveTickets(10, 3, 8), { accepted: false, remaining: 7 });
});
test("invalid negative quantities are refused", () => {
  assert.throws(() => reserveTickets(10, 3, -1), RangeError);
});
test("remainingTickets reports exact available quantity", () => {
  assert.equal(remainingTickets(10, 3), 7);
});
