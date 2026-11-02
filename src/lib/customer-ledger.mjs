// Signed integer cents allow credits and refunds as negative amounts.
export function sumCustomerCents(entries, customerId) {
  if (!Array.isArray(entries) || typeof customerId !== "string" || !customerId) {
    throw new TypeError("Invalid ledger request");
  }
  let cents = 0;
  for (const entry of entries) {
    if (!entry || typeof entry.customerId !== "string" ||
        !Number.isSafeInteger(entry.amountCents)) {
      throw new TypeError("Malformed ledger entry");
    }
    if (entry.customerId !== customerId) continue;
    cents += entry.amountCents;
    if (!Number.isSafeInteger(cents)) throw new RangeError("Ledger total overflow");
  }
  return cents;
}
