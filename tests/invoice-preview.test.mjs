import test from 'node:test';
import assert from 'node:assert/strict';
import { invoicePreview } from '../src/services/invoice-preview.mjs';

const rows = [
  { id: 120, tenantId: 'north', number: 'INV-120', totalCents: 49900, state: 'issued' },
  { id: 121, tenantId: 'south', number: 'INV-121', totalCents: 11000, state: 'issued' },
  { id: 122, tenantId: 'north', number: 'INV-122', totalCents: 300, state: 'revoked' }
];

test('returns a compact public preview for an issued invoice', () => {
  assert.deepEqual(invoicePreview(rows, { tenantId: 'north' }, 120), {
    id: 120, number: 'INV-120', totalCents: 49900, state: 'issued'
  });
});
test('does not expose nonexistent or revoked invoices', () => {
  assert.equal(invoicePreview(rows, { tenantId: 'north' }, 122), null);
  assert.equal(invoicePreview(rows, { tenantId: 'north' }, 999), null);
});
test('requires a signed-in organization and valid invoice ID', () => {
  assert.throws(() => invoicePreview(rows, null, 120), TypeError);
  assert.throws(() => invoicePreview(rows, { tenantId: 'north' }, -1), TypeError);
});
