// Isolated in-memory callback coordination used only by this sandbox.
export async function deliverOnce(event, seenIds, publish) {
  if (!event || typeof event.id !== "string" || !event.id ||
      !(seenIds instanceof Set) || typeof publish !== "function") {
    throw new TypeError("Invalid delivery request");
  }
  if (seenIds.has(event.id)) {
    return { delivered: false, duplicate: true };
  }
  seenIds.add(event.id);
  await publish(event);
  return { delivered: true, duplicate: false };
}

export function isTerminalDeliveryError(code) {
  return code === "INVALID_PAYLOAD" || code === "PERMISSION_DENIED";
}
