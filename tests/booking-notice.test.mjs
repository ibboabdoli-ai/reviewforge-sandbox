import test from 'node:test';
import assert from 'node:assert/strict';
import { createTransactionPool } from '../src/lib/mock-transaction-pool.mjs';
import { createBookingRepository } from '../src/lib/booking-repository.mjs';
import { sendBookingNotice } from '../src/services/booking-notice.mjs';

const workspace={id:'workspace-1',permissions:['notify-bookings']};
const row={id:'booking-1',workspaceId:'workspace-1',status:'confirmed',
  customerName:'Test Customer',customerEmail:'test@example.invalid',appointmentDate:'2026-11-09'};

test('sends a formatted booking confirmation for an authorized workspace',async()=>{
  const pool=createTransactionPool();
  const calls=[];
  const result=await sendBookingNotice({pool,repository:createBookingRepository([row]),
    workspace,bookingId:'booking-1',transport:{async send(msg){calls.push(msg);}}});
  assert.deepEqual(result,{status:'sent'});
  assert.equal(calls[0].to,'test@example.invalid');
  assert.match(calls[0].body,/2026-11-09/);
  assert.equal(pool.isHeld('workspace-1'),false);
});

test('does not reveal bookings from another workspace',async()=>{
  const pool=createTransactionPool();
  const result=await sendBookingNotice({pool,repository:createBookingRepository([row]),
    workspace:{...workspace,id:'workspace-2'},bookingId:'booking-1',
    transport:{async send(){throw new Error('should not send');}}});
  assert.deepEqual(result,{status:'skipped'});
});

test('releases the lock when the transport reports failure',async()=>{
  const pool=createTransactionPool();
  await assert.rejects(sendBookingNotice({pool,repository:createBookingRepository([row]),
    workspace,bookingId:'booking-1',
    transport:{async send(){throw new Error('transient failure');}}}),/transient failure/);
  assert.equal(pool.isHeld('workspace-1'),false);
});
