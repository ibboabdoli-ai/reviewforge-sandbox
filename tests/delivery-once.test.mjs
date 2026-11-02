import test from "node:test";
import assert from "node:assert/strict";
import { deliverOnce, isTerminalDeliveryError } from "../src/lib/delivery-once.mjs";

test("first notification is delivered once", async () => {
  const seen = new Set(), sent = [];
  assert.deepEqual(await deliverOnce({ id: "evt-101" }, seen, async e => sent.push(e.id)),
    { delivered: true, duplicate: false });
  assert.deepEqual(sent, ["evt-101"]);
});
test("duplicate notification is not published twice", async () => {
  const seen = new Set(["evt-101"]);
  let calls = 0;
  assert.deepEqual(await deliverOnce({ id: "evt-101" }, seen, async () => { calls++; }),
    { delivered: false, duplicate: true });
  assert.equal(calls, 0);
});
test("terminal error classification is explicit", () => {
  assert.equal(isTerminalDeliveryError("INVALID_PAYLOAD"), true);
  assert.equal(isTerminalDeliveryError("TIMEOUT"), false);
});
