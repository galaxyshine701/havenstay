import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, MapPin, Star } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import Gallery from '../components/Gallery';
import RoomCard from '../components/RoomCard';
import AmenityChip from '../components/AmenityChip';
import PriceBreakdownModal from '../components/PriceBreakdownModal';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { HotelTrustBadges } from '../components/TrustBadge';
import { useHotelDetails } from '../hooks/useHotels';
import { usePageTitle } from '../hooks/usePageTitle';
import { cancellationText, countNights, pluralize } from '../lib/formatters';
import { cardClass, containerClass, linkButton } from '../lib/ui';
import { buildSearchQuery, parseSearchParams } from '../lib/validators';

function roomState(room, search, availableRoomIds) {
  if (!search.hasDates) return 'needs-dates';
  if (room.capacity < search.guests) return 'too-small';
  if (availableRoomIds && !availableRoomIds.has(room.id)) return 'sold-out';
  return 'available';
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-5 w-48" />
      <Skeleton className="aspect-video w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

export default function HotelDetails() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = parseSearchParams(searchParams);
  const { status, data, reload } = useHotelDetails(slug, search);
  const [priceRoom, setPriceRoom] = useState(null);

  const hotel = data?.hotel ?? null;
  usePageTitle(hotel?.name ?? 'Hotel details');

  const nights = search.hasDates ? countNights(search.checkIn, search.checkOut) : 1;
  const backQuery = buildSearchQuery({
    location: hotel?.city,
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    guests: search.guests,
  });

  // The search bar here changes dates and guests in place. Choosing another city
  // sends the visitor to the results page instead.
  const handleSearch = (values) => {
    if (hotel && values.location !== hotel.city) {
      navigate(`/hotels?${buildSearchQuery(values)}`);
    } else {
      setSearchParams(buildSearchQuery(values));
    }
  };

  return (
    <div>
      <SearchBar
        key={`${searchParams.toString()}|${hotel?.city ?? ''}`}
        initialValues={{ ...search, location: search.location || hotel?.city || '' }}
        isSearching={status === 'loading'}
        onSearch={handleSearch}
      />

      <div className={`${containerClass} py-8`}>
        {status === 'loading' && <DetailsSkeleton />}

        {status === 'error' && <ErrorState onRetry={reload} />}

        {status === 'success' && !hotel && (
          <EmptyState
            icon={Compass}
            title="We could not find that stay"
            message="The link may be old, or the hotel is no longer listed."
            actionLabel="Browse all stays"
            actionTo="/hotels"
          />
        )}

        {status === 'success' && hotel && (
          <>
            <Link
              to={`/hotels?${backQuery}`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded text-sm font-semibold text-haven-700 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to results
            </Link>

            <header className="mt-2">
              <h1 className="text-3xl font-semibold text-haven-900">{hotel.name}</h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                <span className="flex items-center gap-1">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-gold-500" />
                  {hotel.address || hotel.city}
                </span>
                {hotel.rating != null && (
                  <span className="flex items-center gap-1">
                    <Star aria-hidden="true" className="h-4 w-4 fill-gold-500 text-gold-500" />
                    <span className="font-semibold text-ink-900">{Number(hotel.rating).toFixed(1)}</span>
                    ({hotel.review_count} {pluralize(hotel.review_count, 'review')})
                  </span>
                )}
              </p>
              <div className="mt-3">
                <HotelTrustBadges hotel={hotel} />
              </div>
            </header>

            <div className="mt-6">
              <Gallery images={hotel.image_urls} name={hotel.name} />
            </div>

            <section aria-labelledby="about-heading" className={`${cardClass} mt-8 p-6`}>
              <h2 id="about-heading" className="text-2xl font-semibold text-haven-900">
                About this stay
              </h2>
              <p className="mt-3 text-base text-ink-900">{hotel.description}</p>

              {hotel.amenities?.length > 0 && (
                <>
                  <h3 className="mt-6 text-xl font-semibold text-haven-900">Amenities</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity) => (
                      <li key={amenity}>
                        <AmenityChip label={amenity} />
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="mt-6 text-sm text-ink-500">
                {cancellationText(hotel.free_cancellation, hotel.cancellation_hours)}
              </p>
            </section>

            <section aria-labelledby="rooms-heading" className="mt-8">
              <h2 id="rooms-heading" className="text-2xl font-semibold text-haven-900">
                Rooms
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                {search.hasDates
                  ? `Availability for ${nights} ${pluralize(nights, 'night')}, ${search.guests} ${pluralize(search.guests, 'guest')}.`
                  : 'Pick your dates in the search bar to see which rooms are free.'}
              </p>

              {data.rooms.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    title="No rooms listed yet"
                    message="This stay has no rooms available to book right now."
                    actionLabel="Browse other stays"
                    actionTo="/hotels"
                  />
                </div>
              ) : (
                <ul className="mt-4 space-y-6">
                  {data.rooms.map((room) => (
                    <li key={room.id}>
                      <RoomCard
                        room={room}
                        hotel={hotel}
                        search={search}
                        nights={nights}
                        state={roomState(room, search, data.availableRoomIds)}
                        onPriceDetails={setPriceRoom}
                      />
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-sm text-ink-500">
                Prices are in PKR and include taxes and the service fee once you book.{' '}
                <button
                  type="button"
                  onClick={() => data.rooms[0] && setPriceRoom(data.rooms[0])}
                  className={linkButton}
                >
                  See an example breakdown
                </button>
              </p>
            </section>

            {priceRoom && (
              <PriceBreakdownModal
                title={`${priceRoom.name}: price details`}
                pricePerNight={priceRoom.price_per_night}
                nights={nights}
                taxPercent={hotel.tax_percent}
                serviceFeePercent={hotel.service_fee_percent}
                freeCancellation={hotel.free_cancellation}
                cancellationHours={hotel.cancellation_hours}
                onClose={() => setPriceRoom(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
