import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import SafeImage from './SafeImage';
import { calculatePrice } from '../lib/pricing';
import { formatPKR, pluralize } from '../lib/formatters';
import { btnPrimary, cardClass, linkButton } from '../lib/ui';

/**
 * One bookable room on the hotel details page.
 *
 * state:
 * - 'available'   free for the chosen dates and big enough, so "Book this room" works
 * - 'needs-dates' the visitor has not picked dates yet
 * - 'sold-out'    already booked for those dates
 * - 'too-small'   capacity is lower than the number of guests
 */
export default function RoomCard({ room, hotel, search, nights, state, onPriceDetails }) {
  const total = search.hasDates
    ? calculatePrice({
        pricePerNight: room.price_per_night,
        nights,
        taxPercent: hotel.tax_percent,
        serviceFeePercent: hotel.service_fee_percent,
      }).total
    : null;

  const bookQuery = new URLSearchParams({
    room: room.id,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    guests: String(search.guests),
  });

  return (
    <article className={`${cardClass} flex flex-col overflow-hidden md:flex-row`}>
      <div className="h-44 md:h-auto md:w-56 md:shrink-0">
        <SafeImage
          src={room.image_url}
          alt={`${room.name} at ${hotel.name}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 md:p-6">
        <h3 className="text-xl font-semibold text-haven-900">{room.name}</h3>
        <p className="flex items-center gap-2 text-sm text-ink-500">
          <Users aria-hidden="true" className="h-4 w-4 text-gold-500" />
          Sleeps up to {room.capacity} {pluralize(room.capacity, 'guest')}
        </p>
      </div>

      <div className="flex flex-col gap-3 border-t border-haven-900/10 p-4 md:w-64 md:shrink-0 md:items-end md:border-l md:border-t-0 md:p-6 md:text-right">
        <div>
          <p className="text-2xl font-semibold text-haven-900">
            {formatPKR(room.price_per_night)}
            <span className="text-sm font-normal text-ink-500"> / night</span>
          </p>
          {total != null && (
            <p className="mt-1 text-sm text-ink-500">
              {formatPKR(total)} total for {nights} {pluralize(nights, 'night')}, taxes and fees
              included
            </p>
          )}
          <button type="button" onClick={() => onPriceDetails(room)} className={linkButton}>
            See price details
          </button>
        </div>

        {state === 'available' && (
          <Link to={`/book?${bookQuery.toString()}`} className={`${btnPrimary} w-full md:w-auto`}>
            Book this room
          </Link>
        )}
        {state === 'needs-dates' && (
          <>
            <button type="button" disabled className={`${btnPrimary} w-full md:w-auto`}>
              Select dates to book
            </button>
            <p className="text-xs text-ink-500">Choose check-in and check-out in the search bar above.</p>
          </>
        )}
        {state === 'sold-out' && (
          <p role="status" className="text-sm font-semibold text-danger">
            Sold out for your dates
          </p>
        )}
        {state === 'too-small' && (
          <p role="status" className="text-sm font-semibold text-danger">
            Too small for {search.guests} {pluralize(search.guests, 'guest')}
          </p>
        )}
      </div>
    </article>
  );
}
