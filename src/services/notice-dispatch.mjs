export async function dispatchNotice(notice, store, transport) {
  if (!notice || typeof notice.id !== 'string' || !notice.id.trim() ||
      typeof notice.to !== 'string' || typeof notice.body !== 'string' ||
      !store || typeof store.withEventLock !== 'function' ||
      typeof store.wasSent !== 'function' || typeof store.markSent !== 'function' ||
      !transport || typeof transport.send !== 'function') {
    throw new TypeError('Invalid dispatch request');
  }
  return store.withEventLock(notice.id, async () => {
    if (await store.wasSent(notice.id)) return { status: 'duplicate' };
    await store.markSent(notice.id);
    await transport.send(notice.to, notice.body);
    return { status: 'sent' };
  });
}
