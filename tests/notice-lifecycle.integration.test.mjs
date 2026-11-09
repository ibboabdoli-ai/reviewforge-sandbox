import test from 'node:test';
import assert from 'node:assert/strict';
import { createBookingRepository } from '../src/lib/booking-repository.mjs';
import { createTransactionPool } from '../src/lib/mock-transaction-pool.mjs';
import { sendBookingNotice } from '../src/services/booking-notice.mjs';
import { sendDepositReminder } from '../src/services/deposit-reminder.mjs';
import { confirmDeposit } from '../src/services/deposit-updates.mjs';

// In-memory lifecycle integration. The nested cases are intentionally realistic
// test source: no database or provider receives these synthetic messages.
const workspace={
  id:'synthetic-ws',
  permissions:['notify-bookings','request-deposit']
};
const booking={
  id:'synthetic-booking',workspaceId:'synthetic-ws',
  status:'confirmed',depositStatus:'pending',
  customerName:'Synthetic Person',customerEmail:'test@example.invalid',
  appointmentDate:'2026-11-09'
};

test('a complete sequential booking-to-deposit workflow',async(t)=>{
  const pool=createTransactionPool();
  const repository=createBookingRepository([booking]);
  const deliveries=[];
  const transport={async send(message){deliveries.push(message);}};
  await t.test('sends the initial booking status notice',async()=>{
    const result=await sendBookingNotice({pool,repository,workspace,
      bookingId:booking.id,transport});
    assert.equal(result.status,'sent');
    assert.equal(deliveries.length,1);
    assert.equal(deliveries[0].to,booking.customerEmail);
    assert.match(deliveries[0].body,/Appointment for/);
  });
  await t.test('allows a deposit request before payment',async()=>{
    const result=await sendDepositReminder({pool,repository,workspace,
      bookingId:booking.id,transport});
    assert.equal(result.status,'sent');
    assert.equal(deliveries.length,2);
    assert.equal(deliveries[1].subject,'Deposit reminder');
  });
  await t.test('records the synthetic payment',async()=>{
    const response=await confirmDeposit({repository,workspace,bookingId:booking.id});
    assert.equal(response.updated,true);
    assert.equal(repository.snapshot(booking.id).depositStatus,'paid');
  });
  await t.test('does not send a new reminder after payment',async()=>{
    const result=await sendDepositReminder({pool,repository,workspace,
      bookingId:booking.id,transport});
    assert.equal(result.status,'skipped');
    assert.equal(deliveries.length,2);
  });
  await t.test('leaves the advisory lock released',async()=>{
    assert.equal(pool.isHeld(workspace.id),false);
  });
});

test('unknown booking IDs leave records unchanged',async()=>{
  const pool=createTransactionPool();
  const repository=createBookingRepository([booking]);
  const before=repository.snapshot(booking.id);
  const result=await sendBookingNotice({pool,repository,workspace,
    bookingId:'missing',transport:{async send(){throw new Error('invalid send');}}});
  assert.deepEqual(result,{status:'skipped'});
  assert.deepEqual(repository.snapshot(booking.id),before);
  assert.equal(pool.isHeld(workspace.id),false);
});
