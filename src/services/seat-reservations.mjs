export async function bookSeats(store, eventId, requested) {
  if (!store || typeof store.load !== 'function' ||
      typeof store.save !== 'function' ||
      typeof eventId !== 'string' || !eventId.trim() ||
      !Number.isSafeInteger(requested) || requested < 1) {
    throw new TypeError('Invalid booking request');
  }
  const current = await store.load(eventId);
  if (!current) return { accepted: false, reason: 'missing' };
  if (!Number.isSafeInteger(current.capacity) || current.capacity < 0 ||
      !Number.isSafeInteger(current.reserved) || current.reserved < 0 ||
      current.reserved > current.capacity) {
    throw new TypeError('Invalid event state');
  }
  const available = current.capacity - current.reserved;
  if (requested > available) {
    return { accepted: false, reason: 'full' };
  }
  await store.save(eventId, { ...current, reserved: current.reserved + requested });
  return { accepted: true, remaining: available - requested };
}
