// Customer billing summaries, with calendar months defined in UTC.
export function sumMonthlyCharges(entries, { customerId, year, month }) {
  if (!Array.isArray(entries) || typeof customerId !== "string" || !customerId ||
      !Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new TypeError("Invalid monthly summary request");
  }
  return entries
    .filter(entry => entry && entry.customerId === customerId &&
      new Date(entry.occurredAt).getUTCMonth() === month - 1)
    .reduce((total, entry) => total + entry.amountCents, 0);
}

export function centsToText(amountCents) {
  if (!Number.isSafeInteger(amountCents)) {
    throw new TypeError("Money must be an integer number of cents");
  }
  const sign = amountCents < 0 ? "-" : "";
  const absolute = Math.abs(amountCents);
  return sign + Math.floor(absolute / 100) + "." +
    String(absolute % 100).padStart(2, "0");
}
