import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNotice,recipientAddress } from '../src/lib/notice-format.mjs';
import { canPerform } from '../src/lib/workspace-capabilities.mjs';

test('formats a safe customer notice without HTML special characters',()=>{
  assert.equal(formatNotice({customerName:'<Ada>',appointmentDate:'2026-11-09'}),
    'Appointment for Ada on 2026-11-09');
});

test('normalizes a recipient and rejects unsupported values',()=>{
  assert.equal(recipientAddress('  person@example.invalid '),'person@example.invalid');
  assert.equal(recipientAddress('not-email'),null);
});

test('requires an allowlisted workspace capability',()=>{
  const workspace={permissions:['notify-bookings','fake-admin']};
  assert.equal(canPerform(workspace,'notify-bookings'),true);
  assert.equal(canPerform(workspace,'fake-admin'),false);
});
