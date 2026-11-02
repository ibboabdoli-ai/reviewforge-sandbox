import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifySignedBody } from "../src/lib/hmac-verify.mjs";
test("valid SHA-256 HMAC succeeds while modifications fail", () => {
  const secret = "sandbox-only-synthetic-key", body = "test-event";
  const sig = createHmac("sha256", secret).update(body).digest("hex");
  assert.equal(verifySignedBody(body, secret, sig), true);
  assert.equal(verifySignedBody(body+"-changed", secret, sig), false);
  assert.equal(verifySignedBody(body, secret, "wrong"), false);
});
test("missing shared secret is rejected", () => {
  assert.throws(() => verifySignedBody("test", "", "0".repeat(64)), TypeError);
});
