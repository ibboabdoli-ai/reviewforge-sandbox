import test from 'node:test';
import assert from 'node:assert/strict';
import { createNoticeStore } from '../src/lib/notice-store.mjs';
import { dispatchNotice } from '../src/services/notice-dispatch.mjs';

const notice = { id: 'n-42', to: 'test@example.invalid', body: 'Synthetic notice' };

test('delivers a notice once and rejects a later duplicate', async () => {
  const store = createNoticeStore();
  let attempts = 0;
  const transport = { async send() { attempts++; } };
  assert.deepEqual(await dispatchNotice(notice, store, transport), { status: 'sent' });
  assert.deepEqual(await dispatchNotice(notice, store, transport), { status: 'duplicate' });
  assert.equal(attempts, 1);
  assert.deepEqual(store.snapshot(), ['n-42']);
});

test('rejects malformed notices', async () => {
  await assert.rejects(dispatchNotice({ id: '' }, createNoticeStore(), { send() {} }), TypeError);
});
