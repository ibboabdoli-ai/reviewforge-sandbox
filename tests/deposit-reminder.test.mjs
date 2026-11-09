import test from 'node:test';
import assert from 'node:assert/strict';
import { createTransactionPool } from '../src/lib/mock-transaction-pool.mjs';
import { createBookingRepository } from '../src/lib/booking-repository.mjs';
import { sendDepositReminder } from '../src/services/deposit-reminder.mjs';
import { confirmDeposit } from '../src/services/deposit-updates.mjs';

const workspace={id:'workspace-1',permissions:['request-deposit']};
const seed={id:'booking-1',workspaceId:'workspace-1',depositStatus:'pending',
  customerEmail:'test@example.invalid'};

test('sends a deposit reminder while the deposit is pending',async()=>{
  const messages=[];
  const result=await sendDepositReminder({pool:createTransactionPool(),
    repository:createBookingRepository([seed]),workspace,bookingId:seed.id,
    transport:{async send(m){messages.push(m);}}});
  assert.equal(result.status,'sent');
  assert.equal(messages.length,1);
});

test('confirmed deposits do not receive a later reminder',async()=>{
  const repository=createBookingRepository([seed]);
  assert.deepEqual(await confirmDeposit({repository,workspace,bookingId:seed.id}),{updated:true});
  const result=await sendDepositReminder({pool:createTransactionPool(),repository,workspace,
    bookingId:seed.id,transport:{async send(){throw new Error('should not send');}}});
  assert.deepEqual(result,{status:'skipped'});
});
