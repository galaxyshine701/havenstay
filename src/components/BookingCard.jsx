import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { countNights, formatDate, formatPKR, formatStatus, pluralize } from '../lib/formatters';
import { btnSecondary, cardClass } from '../lib/ui';

// One colour per booking status. The text label is always shown too, so colour is never
// the only way to tell the statuses apart.
const STATUS_STYLES = {
  pending: 'bg-haven-50 text-haven-700',
  confirmed: 'bg-success/10 text-success',
  cancelled: 'bg-danger/10 text-danger',
  completed: 'bg-sand-100 text-ink-500',
};

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="mt-1 text-base font-medium text-ink-900">{children}</dd>
    </div>
  );
}

/**
 * One row of the "My bookings" list.
 * booking: a bookings row with its hotel (name, city) and room (name) joined in.
 */
export default function BookingCard({ booking }) {
  const hotel = booking.hotels;
  const room = booking.rooms;
  const nights = countNights(booking.check_in, booking.check_out);
  const statusStyle = STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending;

  return (
    <article className={`${cardClass} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Reference</p>
          <p className="text-xl font-semibold text-haven-900">{booking.reference}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyle}`}>
          {formatStatus(booking.status)}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-haven-900">{hotel?.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
        <MapPin aria-hidden="true" className="h-4 w-4 text-gold-500" />
        {[hotel?.city, room?.name].filter(Boolean).join(' · ')}
      </p>

      <dl className="mt-4 grid gap-4 sm:grid-cols-4">
        <Detail label="Check-in">{formatDate(booking.check_in)}</Detail>
        <Detail label="Check-out">
          {formatDate(booking.check_out)}
          <span className="block text-sm font-normal text-ink-500">
            {nights} {pluralize(nights, 'night')}
          </span>
        </Detail>
        <Detail label="Guests">{booking.guests}</Detail>
        <Detail label="Total">{formatPKR(booking.total_price)}</Detail>
      </dl>

      <Link
        to={`/confirmation/${booking.reference}`}
        aria-label={`View details for booking ${booking.reference}`}
        className={`${btnSecondary} mt-5`}
      >
        View details
      </Link>
    </article>
  );
}
