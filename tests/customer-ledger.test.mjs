import test from "node:test";
import assert from "node:assert/strict";
import { sumCustomerCents } from "../src/lib/customer-ledger.mjs";
test("isolates customers and supports signed credits", () => {
  const entries = [
    {customerId:"blue",amountCents:1200},
    {customerId:"red",amountCents:5000},
    {customerId:"blue",amountCents:-350},
  ];
  assert.equal(sumCustomerCents(entries, "blue"), 850);
  assert.equal(sumCustomerCents(entries, "red"), 5000);
  assert.equal(sumCustomerCents(entries, "none"), 0);
});
test("rejects malformed amounts and overflow", () => {
  assert.throws(() => sumCustomerCents([{customerId:"blue",amountCents:NaN}], "blue"), TypeError);
  assert.throws(() => sumCustomerCents([
    {customerId:"blue",amountCents:Number.MAX_SAFE_INTEGER},
    {customerId:"blue",amountCents:1},
  ], "blue"), RangeError);
});
