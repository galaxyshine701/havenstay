import { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Compass, LoaderCircle, MapPin, TriangleAlert, Users } from 'lucide-react';
import FormField from '../components/FormField';
import PriceBreakdownModal from '../components/PriceBreakdownModal';
import SafeImage from '../components/SafeImage';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { HotelTrustBadges } from '../components/TrustBadge';
import { useAuth } from '../hooks/useAuth';
import { useCreateBooking, useRoomWithHotel } from '../hooks/useBooking';
import { usePageTitle } from '../hooks/usePageTitle';
import { calculatePrice } from '../lib/pricing';
import { countNights, formatDate, formatPKR, pluralize } from '../lib/formatters';
import { btnPrimary, cardClass, containerClass, fieldProps, inputClass, linkButton } from '../lib/ui';
import { parseSearchParams, validateBookingForm } from '../lib/validators';

const FIELD_ORDER = ['fullName', 'email', 'phone', 'specialRequests'];

function BookingSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]" aria-hidden="true">
      <div className="space-y-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-12 w-48" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const baseId = useId();
  const ids = {
    fullName: `${baseId}-name`,
    email: `${baseId}-email`,
    phone: `${baseId}-phone`,
    specialRequests: `${baseId}-requests`,
  };

  const roomId = searchParams.get('room') ?? '';
  const search = parseSearchParams(searchParams);
  const { status, data: room, reload } = useRoomWithHotel(roomId);
  const { user, profile } = useAuth();
  const { status: submitStatus, error: submitError, submit } = useCreateBooking();

  const [values, setValues] = useState({ fullName: '', email: '', phone: '', specialRequests: '' });
  const [submitted, setSubmitted] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  usePageTitle('Complete your booking');

  // Prefill name, email and phone once, without overwriting what the guest already typed.
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      fullName: prev.fullName || (profile?.full_name !== 'Guest' ? profile?.full_name : '') || '',
      email: prev.email || user?.email || '',
      phone: prev.phone || profile?.phone || '',
    }));
  }, [user, profile]);

  const hotel = room?.hotels ?? null;
  const nights = search.hasDates ? countNights(search.checkIn, search.checkOut) : 0;

  // Problems with the URL itself (missing dates, too many guests for this room).
  let problem = '';
  if (!search.hasDates) problem = 'Your dates are missing or are no longer valid. Please choose them again.';
  else if (room && search.guests > room.capacity) {
    problem = `This room sleeps at most ${room.capacity} ${pluralize(room.capacity, 'guest')}. Please choose another room or fewer guests.`;
  }

  const price =
    room && hotel && search.hasDates
      ? calculatePrice({
          pricePerNight: room.price_per_night,
          nights,
          taxPercent: hotel.tax_percent,
          serviceFeePercent: hotel.service_fee_percent,
        })
      : null;

  const formErrors = validateBookingForm(values);
  const shownErrors = submitted ? formErrors : {};
  const isSubmitting = submitStatus === 'submitting';

  const setValue = (name) => (event) => setValues((prev) => ({ ...prev, [name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (isSubmitting || !room || !user || problem) return;

    const firstInvalid = FIELD_ORDER.find((name) => formErrors[name]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }

    // total_price, status and hotel_id are NOT sent: the database trigger sets them.
    const reference = await submit({
      user_id: user.id,
      room_id: room.id,
      check_in: search.checkIn,
      check_out: search.checkOut,
      guests: search.guests,
      guest_name: values.fullName.trim(),
      guest_email: values.email.trim(),
      guest_phone: values.phone.trim(),
      special_requests: values.specialRequests.trim() || null,
    });

    if (reference) navigate(`/confirmation/${reference}`, { replace: true });
  };

  const hotelPageHref = hotel
    ? `/hotels/${hotel.slug}?checkIn=${search.checkIn}&checkOut=${search.checkOut}&guests=${search.guests}`
    : '/hotels';

  return (
    <div className={`${containerClass} py-8`}>
      {status === 'loading' && <BookingSkeleton />}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'success' && !room && (
        <EmptyState
          icon={Compass}
          title="We could not find that room"
          message="The booking link may be incomplete. Please pick a room again."
          actionLabel="Browse stays"
          actionTo="/hotels"
        />
      )}

      {status === 'success' && room && hotel && (
        <>
          <Link
            to={hotelPageHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded text-sm font-semibold text-haven-700 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to {hotel.name}
          </Link>

          <h1 className="mt-2 text-3xl font-semibold text-haven-900">Complete your booking</h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Summary first on phones so the guest sees what they are booking */}
            <aside className="order-first lg:order-last">
              <div className={`${cardClass} overflow-hidden lg:sticky lg:top-4`}>
                <div className="h-44">
                  <SafeImage
                    src={hotel.image_urls?.[0]}
                    alt={`${hotel.name}, a boutique stay in ${hotel.city}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-4 p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-haven-900">{hotel.name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                      <MapPin aria-hidden="true" className="h-4 w-4 text-gold-500" />
                      {hotel.city}
                    </p>
                  </div>

                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-500">Room</dt>
                      <dd className="text-right font-medium text-ink-900">{room.name}</dd>
                    </div>
                    {search.hasDates && (
                      <>
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-500">Check-in</dt>
                          <dd className="font-medium text-ink-900">{formatDate(search.checkIn)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-500">Check-out</dt>
                          <dd className="font-medium text-ink-900">{formatDate(search.checkOut)}</dd>
                        </div>
                        <div className="flex justify-between gap-4">
                          <dt className="text-ink-500">Length of stay</dt>
                          <dd className="font-medium text-ink-900">
                            {nights} {pluralize(nights, 'night')}
                          </dd>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between gap-4">
                      <dt className="flex items-center gap-1 text-ink-500">
                        <Users aria-hidden="true" className="h-4 w-4" />
                        Guests
                      </dt>
                      <dd className="font-medium text-ink-900">{search.guests}</dd>
                    </div>
                  </dl>

                  <HotelTrustBadges hotel={hotel} />

                  {price && (
                    <div className="border-t border-haven-900/10 pt-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="text-base font-semibold text-haven-900">Total price</p>
                        <p className="text-2xl font-semibold text-haven-900">{formatPKR(price.total)}</p>
                      </div>
                      <p className="mt-1 text-xs text-ink-500">Taxes and service fee included.</p>
                      <button type="button" onClick={() => setPriceOpen(true)} className={linkButton}>
                        See price details
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Guest details"
              className={`${cardClass} space-y-5 p-6`}
            >
              <h2 className="text-2xl font-semibold text-haven-900">Guest details</h2>

              {problem && (
                <p role="alert" className="flex items-start gap-2 rounded-xl bg-haven-50 p-4 text-sm text-ink-900">
                  <TriangleAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                  <span>
                    {problem}{' '}
                    <Link to={hotelPageHref} className="font-semibold text-haven-700 underline underline-offset-4">
                      Change dates or room
                    </Link>
                  </span>
                </p>
              )}

              <FormField id={ids.fullName} label="Full name" error={shownErrors.fullName}>
                <input
                  {...fieldProps(ids.fullName, shownErrors.fullName)}
                  type="text"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={setValue('fullName')}
                  className={inputClass(shownErrors.fullName)}
                />
              </FormField>

              <FormField id={ids.email} label="Email" error={shownErrors.email}>
                <input
                  {...fieldProps(ids.email, shownErrors.email)}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={setValue('email')}
                  className={inputClass(shownErrors.email)}
                />
              </FormField>

              <FormField id={ids.phone} label="Phone number" error={shownErrors.phone}>
                <input
                  {...fieldProps(ids.phone, shownErrors.phone)}
                  type="tel"
                  autoComplete="tel"
                  placeholder="+92 300 1234567"
                  value={values.phone}
                  onChange={setValue('phone')}
                  className={inputClass(shownErrors.phone)}
                />
              </FormField>

              <FormField
                id={ids.specialRequests}
                label="Special requests"
                optional
                error={shownErrors.specialRequests}
              >
                <textarea
                  {...fieldProps(ids.specialRequests, shownErrors.specialRequests)}
                  rows={4}
                  maxLength={500}
                  value={values.specialRequests}
                  onChange={setValue('specialRequests')}
                  className={`${inputClass(shownErrors.specialRequests)} py-3`}
                />
              </FormField>

              {submitStatus === 'error' && (
                <div role="alert" className="rounded-xl border border-danger/40 bg-white p-4 text-sm text-danger">
                  <p className="font-semibold">Your booking was not saved.</p>
                  <p className="mt-1">{submitError}</p>
                  <Link to={hotelPageHref} className="mt-2 inline-block font-semibold underline underline-offset-4">
                    Choose other dates or another room
                  </Link>
                </div>
              )}

              {/* Submit button states: idle, submitting, success, error */}
              <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success' || Boolean(problem)}
                aria-busy={isSubmitting}
                className={`${btnPrimary} w-full sm:w-auto`}
              >
                {isSubmitting && <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />}
                {submitStatus === 'idle' && 'Confirm booking'}
                {submitStatus === 'submitting' && 'Confirming…'}
                {submitStatus === 'success' && 'Booked. Opening confirmation…'}
                {submitStatus === 'error' && 'Try again'}
              </button>

              <p className="text-xs text-ink-500">
                {price
                  ? `You will be charged ${formatPKR(price.total)} in total. The final amount is calculated and stored securely when you confirm.`
                  : 'Choose valid dates to see the final price.'}
              </p>
            </form>
          </div>

          {priceOpen && price && (
            <PriceBreakdownModal
              title="Price details"
              pricePerNight={room.price_per_night}
              nights={nights}
              taxPercent={hotel.tax_percent}
              serviceFeePercent={hotel.service_fee_percent}
              freeCancellation={hotel.free_cancellation}
              cancellationHours={hotel.cancellation_hours}
              onClose={() => setPriceOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
