import { createHmac, timingSafeEqual } from "node:crypto";
// Caller provides a trusted nonempty secret and an untrusted digest string.
export function verifySignedBody(body, secret, suppliedDigest) {
  if (typeof body !== "string" || typeof secret !== "string" || !secret) {
    throw new TypeError("Body and shared secret must be supplied");
  }
  if (typeof suppliedDigest !== "string" || !/^[a-f0-9]{64}$/i.test(suppliedDigest)) {
    return false;
  }
  const calculated = createHmac("sha256", secret).update(body, "utf8").digest();
  const provided = Buffer.from(suppliedDigest, "hex");
  return provided.length === calculated.length && timingSafeEqual(calculated, provided);
}
