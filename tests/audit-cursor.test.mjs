import test from "node:test";
import assert from "node:assert/strict";
import { pageAuditEvents } from "../src/lib/audit-cursor.mjs";
const events = [
  { id: "evt-03", createdAt: "2026-11-02T09:30:00Z" },
  { id: "evt-01", createdAt: "2026-11-02T09:00:00Z" },
  { id: "evt-02", createdAt: "2026-11-02T09:15:00Z" },
];
test("returns sorted pages with a distinct-timestamp cursor", () => {
  assert.deepEqual(pageAuditEvents(events, null, 2).map(e => e.id), ["evt-01", "evt-02"]);
  assert.deepEqual(pageAuditEvents(events, { id: "evt-02", createdAt: "2026-11-02T09:15:00Z" }, 2).map(e => e.id), ["evt-03"]);
});
test("rejects bad page limits and malformed event records", () => {
  assert.throws(() => pageAuditEvents(events, null, 0), TypeError);
  assert.throws(() => pageAuditEvents([{ id: 5, createdAt: "2026-11-02T09:00:00Z" }]), TypeError);
});
