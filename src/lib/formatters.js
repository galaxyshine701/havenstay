export function formatPKR(amount) {
  const value = Number(amount);
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `PKR ${formatted}`;
}

// 'YYYY-MM-DD' -> local Date (new Date('YYYY-MM-DD') would be parsed as UTC).
export function parseISO(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(isoDate) {
  return parseISO(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(isoDate) {
  return parseISO(isoDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function countNights(checkIn, checkOut) {
  const [y1, m1, d1] = checkIn.split('-').map(Number);
  const [y2, m2, d2] = checkOut.split('-').map(Number);
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000);
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural;
}

export function cancellationText(freeCancellation, hours) {
  if (!freeCancellation) {
    return 'Non-refundable: this stay cannot be cancelled free of charge.';
  }
  if (!hours) return 'Free cancellation until check-in.';
  return `Free cancellation until ${hours} ${pluralize(hours, 'hour')} before check-in.`;
}

const STATUS_LABELS = {
  pending: 'Pending confirmation',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
};

export const formatStatus = (status) => STATUS_LABELS[status] ?? status;
