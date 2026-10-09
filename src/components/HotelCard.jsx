import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import SafeImage from './SafeImage';
import AmenityChip from './AmenityChip';
import PriceBreakdownModal from './PriceBreakdownModal';
import { HotelTrustBadges } from './TrustBadge';
import { calculatePrice } from '../lib/pricing';
import { countNights, formatPKR, pluralize } from '../lib/formatters';
import { buildSearchQuery } from '../lib/validators';
import { btnPrimary, cardClass, linkButton } from '../lib/ui';

/**
 * One hotel as a horizontal card (CLAUDE.md section 5.1):
 * image left, details middle, price + button right. On mobile it stacks in the same order.
 *
 * Props:
 * - hotel: a row from the hotels table
 * - minPrice: cheapest nightly rate that fits the search
 * - search: the parsed search ({ checkIn, checkOut, guests, hasDates })
 */
export default function HotelCard({ hotel, minPrice, search }) {
  const [priceOpen, setPriceOpen] = useState(false);

  const nights = search.hasDates ? countNights(search.checkIn, search.checkOut) : 1;
  const stayTotal = search.hasDates
    ? calculatePrice({
        pricePerNight: minPrice,
        nights,
        taxPercent: hotel.tax_percent,
        serviceFeePercent: hotel.service_fee_percent,
      }).total
    : null;

  const query = buildSearchQuery({
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    guests: search.guests,
  });
  const detailsHref = `/hotels/${hotel.slug}?${query}`;

  return (
    <article className={`${cardClass} flex flex-col overflow-hidden md:flex-row`}>
      <div className="h-56 md:h-auto md:w-72 md:shrink-0">
        <SafeImage
          src={hotel.image_urls?.[0]}
          alt={`${hotel.name}, a boutique stay in ${hotel.city}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 md:p-6">
        <div>
          <h3 className="text-xl font-semibold text-haven-900">{hotel.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
            <MapPin aria-hidden="true" className="h-4 w-4 text-gold-500" />
            {hotel.city}
          </p>
        </div>

        {hotel.rating != null && (
          <p className="flex items-center gap-2 text-sm text-ink-900">
            <Star aria-hidden="true" className="h-4 w-4 fill-gold-500 text-gold-500" />
            <span className="font-semibold">{Number(hotel.rating).toFixed(1)}</span>
            <span className="text-ink-500">
              ({hotel.review_count} {pluralize(hotel.review_count, 'review')})
            </span>
          </p>
        )}

        {hotel.amenities?.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <li key={amenity}>
                <AmenityChip label={amenity} />
              </li>
            ))}
          </ul>
        )}

        <HotelTrustBadges hotel={hotel} />
      </div>

      <div className="flex flex-col gap-4 border-t border-haven-900/10 p-4 md:w-60 md:shrink-0 md:items-end md:justify-between md:border-l md:border-t-0 md:p-6 md:text-right">
        <div>
          <p className="text-xs text-ink-500">from</p>
          <p className="text-2xl font-semibold text-haven-900">
            {formatPKR(minPrice)}
            <span className="text-sm font-normal text-ink-500"> / night</span>
          </p>
          {stayTotal != null && (
            <p className="mt-1 text-sm text-ink-500">
              {formatPKR(stayTotal)} total for {nights} {pluralize(nights, 'night')}, taxes and fees
              included
            </p>
          )}
          <button type="button" onClick={() => setPriceOpen(true)} className={linkButton}>
            See price details
          </button>
        </div>

        <Link to={detailsHref} className={`${btnPrimary} w-full md:w-auto`}>
          View details
        </Link>
      </div>

      {priceOpen && (
        <PriceBreakdownModal
          title={`${hotel.name}: price details`}
          pricePerNight={minPrice}
          nights={nights}
          taxPercent={hotel.tax_percent}
          serviceFeePercent={hotel.service_fee_percent}
          freeCancellation={hotel.free_cancellation}
          cancellationHours={hotel.cancellation_hours}
          onClose={() => setPriceOpen(false)}
        />
      )}
    </article>
  );
}
