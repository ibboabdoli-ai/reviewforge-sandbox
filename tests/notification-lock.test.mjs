import test from 'node:test';
import assert from 'node:assert/strict';
import { createTransactionPool } from '../src/lib/mock-transaction-pool.mjs';
import { withNotificationLock } from '../src/lib/notification-lock.mjs';

test('a successful action commits no changes and releases its workspace lock',async()=>{
  const pool=createTransactionPool();
  const answer=await withNotificationLock(pool.connect(),'workspace-a',async()=>42);
  assert.equal(answer,42);
  assert.equal(pool.isHeld('workspace-a'),false);
});

test('failing actions release the transaction lock',async()=>{
  const pool=createTransactionPool();
  await assert.rejects(withNotificationLock(pool.connect(),'workspace-a',async()=>{
    throw new Error('Synthetic failure');
  }),/Synthetic failure/);
  assert.equal(pool.isHeld('workspace-a'),false);
});

test('two fast actions can use independent workspace locks',async()=>{
  const pool=createTransactionPool();
  const values=await Promise.all([
    withNotificationLock(pool.connect(),'a',async()=>1),
    withNotificationLock(pool.connect(),'b',async()=>2)
  ]);
  assert.deepEqual(values,[1,2]);
});
