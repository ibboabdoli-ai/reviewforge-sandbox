import test from "node:test";
import assert from "node:assert/strict";
import { sumMonthlyCharges, centsToText } from "../src/lib/monthly-summary.mjs";

test("monthly total includes only requested customer and month", () => {
  const charges = [
    { customerId: "blue", occurredAt: "2026-11-02T10:00:00Z", amountCents: 500 },
    { customerId: "blue", occurredAt: "2026-10-30T10:00:00Z", amountCents: 200 },
    { customerId: "red", occurredAt: "2026-11-02T10:00:00Z", amountCents: 800 },
  ];
  assert.equal(sumMonthlyCharges(charges, { customerId: "blue", year: 2026, month: 11 }), 500);
});
test("money text keeps negative amounts and leading zero cents", () => {
  assert.equal(centsToText(405), "4.05");
  assert.equal(centsToText(-7), "-0.07");
});
