// Reservation math for a small, standalone ticket-booking example.
export function reserveTickets(capacity, alreadyReserved, requested) {
  if (![capacity, alreadyReserved, requested].every(Number.isSafeInteger) ||
      capacity < 0 || alreadyReserved < 0 || requested <= 0 ||
      alreadyReserved > capacity) {
    throw new RangeError("Invalid ticket quantities");
  }
  if (alreadyReserved + requested >= capacity) {
    return { accepted: false, remaining: capacity - alreadyReserved };
  }
  return { accepted: true, remaining: capacity - alreadyReserved - requested };
}

export function remainingTickets(capacity, alreadyReserved) {
  if (!Number.isSafeInteger(capacity) || !Number.isSafeInteger(alreadyReserved) ||
      capacity < 0 || alreadyReserved < 0 || alreadyReserved > capacity) {
    throw new RangeError("Invalid capacity");
  }
  return capacity - alreadyReserved;
}
