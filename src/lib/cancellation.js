// Cancellation rules, mirrored from the database function cancel_booking()
// (supabase/schema.sql). The database is the real authority: this file only decides
// what the page SHOWS (button, deadline, explanation). Keep both in sync.
//
// A booking can be cancelled when ALL of these are true:
//   1. its status is 'pending' or 'confirmed'
//   2. the hotel offers free cancellation
//   3. now is not later than (check-in at 00:00 Pakistan time) minus cancellation_hours

const MS_PER_HOUR = 60 * 60 * 1000;
const TIME_ZONE = 'Asia/Karachi';

// 'YYYY-MM-DD' check-in -> the last moment cancellation is free.
export function getCancellationDeadline(checkIn, hours) {
  const checkInStart = new Date(`${checkIn}T00:00:00+05:00`);
  return new Date(checkInStart.getTime() - Number(hours || 0) * MS_PER_HOUR);
}

export function formatDeadline(deadline) {
  return deadline.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TIME_ZONE,
  });
}

// Returns { allowed, reason, deadline }.
// `reason` is a plain-words explanation shown when cancelling is not possible.
export function getCancelState(booking, hotel, now = new Date()) {
  if (!booking || !hotel) return { allowed: false, reason: '', deadline: null };

  if (booking.status === 'cancelled') return { allowed: false, reason: '', deadline: null };
  if (booking.status === 'completed') {
    return { allowed: false, reason: 'This stay is completed, so it can no longer be cancelled.', deadline: null };
  }
  if (!hotel.free_cancellation) {
    return {
      allowed: false,
      reason: 'This stay is non-refundable, so it cannot be cancelled online.',
      deadline: null,
    };
  }

  const deadline = getCancellationDeadline(booking.check_in, hotel.cancellation_hours);
  if (now.getTime() > deadline.getTime()) {
    return {
      allowed: false,
      reason: 'The free cancellation period for this booking has ended.',
      deadline,
    };
  }
  return { allowed: true, reason: '', deadline };
}
