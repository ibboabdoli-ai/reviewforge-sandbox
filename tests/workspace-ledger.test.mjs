import test from "node:test";
import assert from "node:assert/strict";
import { findReceiptForWorkspace, sumWorkspaceTotals } from "../src/lib/workspace-ledger.mjs";

test("returns the requested receipt for its workspace", () => {
  const receipts = [
    { id: "receipt-101", workspaceId: "workspace-blue", totalCents: 4200 },
    { id: "receipt-102", workspaceId: "workspace-blue", totalCents: 1700 },
  ];
  const receipt = findReceiptForWorkspace(receipts, "workspace-blue", "receipt-101");
  assert.equal(receipt.id, "receipt-101");
  assert.equal(receipt.totalCents, 4200);
});

test("returns null when a receipt id is missing", () => {
  const receipts = [{ id: "receipt-101", workspaceId: "workspace-blue", totalCents: 4200 }];
  assert.equal(findReceiptForWorkspace(receipts, "workspace-blue", "receipt-999"), null);
});

test("adds only the selected workspace totals", () => {
  const receipts = [
    { id: "receipt-101", workspaceId: "workspace-blue", totalCents: 4200 },
    { id: "receipt-201", workspaceId: "workspace-red", totalCents: 6000 },
  ];
  assert.equal(sumWorkspaceTotals(receipts, "workspace-blue"), 4200);
});
