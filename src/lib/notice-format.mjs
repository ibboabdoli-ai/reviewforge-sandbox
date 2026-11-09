export function formatNotice({ customerName, appointmentDate }) {
  if (typeof customerName !== 'string' || typeof appointmentDate !== 'string' ||
      !customerName.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
    throw new TypeError('Invalid notification input');
  }
  const safeName = customerName.replace(/[<>]/g, '').trim();
  return 'Appointment for ' + safeName + ' on ' + appointmentDate;
}
export function recipientAddress(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
}
