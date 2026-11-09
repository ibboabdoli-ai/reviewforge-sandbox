import { withNotificationLock } from '../lib/notification-lock.mjs';
import { recipientAddress } from '../lib/notice-format.mjs';
import { canPerform } from '../lib/workspace-capabilities.mjs';

export async function sendDepositReminder({pool, repository, workspace, bookingId, transport}) {
  if (!pool || typeof pool.connect !== 'function' ||
      !repository || typeof repository.get !== 'function' ||
      !transport || typeof transport.send !== 'function' ||
      !canPerform(workspace, 'request-deposit')) {
    throw new TypeError('Invalid deposit reminder request');
  }
  const connection = pool.connect();
  return withNotificationLock(connection, workspace.id, async () => {
    const booking = await repository.get(bookingId);
    if (!booking || booking.workspaceId !== workspace.id ||
        booking.depositStatus !== 'pending') return {status: 'skipped'};
    const to = recipientAddress(booking.customerEmail);
    if (!to) return {status: 'skipped'};
    await transport.send({to,subject: 'Deposit reminder',body: 'Your deposit is due'});
    return {status: 'sent'};
  });
}
