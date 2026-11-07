export function findIssuedInvoice(invoices, id) {
  if (!Array.isArray(invoices) || !Number.isSafeInteger(id) || id < 1) {
    throw new TypeError('Invalid invoice lookup');
  }
  return invoices.find(invoice =>
    invoice && invoice.id === id && invoice.state === 'issued') ?? null;
}
