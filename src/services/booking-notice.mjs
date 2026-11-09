import { withNotificationLock } from '../lib/notification-lock.mjs';
import { formatNotice, recipientAddress } from '../lib/notice-format.mjs';
import { canPerform } from '../lib/workspace-capabilities.mjs';

export async function sendBookingNotice({pool, repository, workspace, bookingId, transport}) {
  if (!pool || typeof pool.connect !== 'function' ||
      !repository || typeof repository.get !== 'function' ||
      !transport || typeof transport.send !== 'function' ||
      !canPerform(workspace, 'notify-bookings')) {
    throw new TypeError('Invalid booking notice request');
  }
  const connection = pool.connect();
  return withNotificationLock(connection, workspace.id, async () => {
    const booking = await repository.get(bookingId);
    if (!booking || booking.workspaceId !== workspace.id || booking.status !== 'confirmed') {
      return { status: 'skipped' };
    }
    const to = recipientAddress(booking.customerEmail);
    if (!to) return { status: 'skipped' };
    await transport.send({to, subject: 'Booking confirmed',
      body: formatNotice({ customerName: booking.customerName,
        appointmentDate: booking.appointmentDate })});
    return { status: 'sent' };
  });
}
