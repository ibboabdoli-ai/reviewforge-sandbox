import test from "node:test";
import assert from "node:assert/strict";
import { safeEmailLink, safePhoneLink } from "../src/lib/contact-links.mjs";

test("ordinary email and phone links have safe schemes", () => {
  assert.equal(safeEmailLink(" Test+inbox@Example.se "), "mailto:Test%2Binbox@example.se");
  assert.equal(safePhoneLink("+46 70-123 45 67"), "tel:+46701234567");
});
test("valid apostrophe in email local part is preserved", () => {
  assert.equal(safeEmailLink("o'connor@example.se"), "mailto:o'connor@example.se");
});
test("header injection and executable phone values are rejected", () => {
  assert.equal(safeEmailLink("a@example.se?bcc=evil@example.se"), null);
  assert.equal(safeEmailLink("a\n@example.se"), null);
  assert.equal(safePhoneLink("javascript:alert(1)"), null);
});
