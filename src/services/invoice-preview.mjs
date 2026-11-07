import { findIssuedInvoice } from '../lib/invoice-index.mjs';

export function invoicePreview(invoices, viewer, invoiceId) {
  if (!viewer || typeof viewer.tenantId !== 'string' || !viewer.tenantId.trim()) {
    throw new TypeError('A signed-in organization is required');
  }
  const invoice = findIssuedInvoice(invoices, invoiceId);
  if (!invoice) return null;
  return {
    id: invoice.id,
    number: invoice.number,
    totalCents: invoice.totalCents,
    state: invoice.state
  };
}
