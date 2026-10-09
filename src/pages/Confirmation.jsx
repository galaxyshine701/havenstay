import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CircleCheck, CircleX, Compass, LoaderCircle, MapPin, Users } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { HotelTrustBadges } from '../components/TrustBadge';
import { useBookingByReference, useCancelBooking } from '../hooks/useBooking';
import { usePageTitle } from '../hooks/usePageTitle';
import { formatDeadline, getCancelState } from '../lib/cancellation';
import { cancellationText, countNights, formatDate, formatPKR, formatStatus, pluralize } from '../lib/formatters';
import { btnDanger, btnPrimary, btnSecondary, cardClass, containerClass } from '../lib/ui';

function ConfirmationSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-4" aria-hidden="true">
      <Skeleton className="mx-auto h-14 w-14 rounded-full" />
      <Skeleton className="mx-auto h-9 w-72" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-4 py-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{children}</dd>
    </div>
  );
}

export default function Confirmation() {
  const { reference } = useParams();
  const { status, data: booking, reload } = useBookingByReference(reference);
  usePageTitle('Booking confirmation');

  // Cancel flow: first click asks "are you sure?", second click really cancels.
  const [confirming, setConfirming] = useState(false);
  const { status: cancelStatus, error: cancelError, cancel } = useCancelBooking();
  const isCancelling = cancelStatus === 'cancelling';

  const hotel = booking?.hotels ?? null;
  const room = booking?.rooms ?? null;
  const nights = booking ? countNights(booking.check_in, booking.check_out) : 0;
  const isCancelled = booking?.status === 'cancelled';
  const cancelState = getCancelState(booking, hotel);

  async function handleCancel() {
    const done = await cancel(booking.id);
    if (done) {
      setConfirming(false);
      reload(); // read the booking again so the page shows the real, stored status
    }
  }

  return (
    <div className={`${containerClass} py-12`}>
      {status === 'loading' && <ConfirmationSkeleton />}

      {status === 'error' && <ErrorState onRetry={reload} />}

      {status === 'success' && !booking && (
        <EmptyState
          icon={Compass}
          title="We could not find that booking"
          message="Check the reference, or sign in with the account you booked with. Bookings are private to their owner."
          actionLabel="Back to home"
          actionTo="/"
        />
      )}

      {status === 'success' && booking && (
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-haven-50">
              {isCancelled ? (
                <CircleX aria-hidden="true" className="h-8 w-8 text-danger" />
              ) : (
                <CircleCheck aria-hidden="true" className="h-8 w-8 text-success" />
              )}
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-haven-900">
              {isCancelled ? 'Booking cancelled' : 'Booking received'}
            </h1>
            <p className="mt-2 text-base text-ink-500">
              {isCancelled
                ? 'This booking has been cancelled and the dates are free again.'
                : 'Your booking is saved. Keep your reference number for check-in.'}
            </p>
          </div>

          <section aria-label="Booking details" className={`${cardClass} mt-8 p-6`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-haven-900/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Reference</p>
                <p className="text-2xl font-semibold text-haven-900">{booking.reference}</p>
              </div>
              <p className="rounded-full bg-haven-50 px-4 py-1 text-sm font-semibold text-haven-700">
                Status: {formatStatus(booking.status)}
              </p>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-semibold text-haven-900">{hotel?.name}</h2>
              {hotel && (
                <p className="mt-1 flex items-center gap-1 text-sm text-ink-500">
                  <MapPin aria-hidden="true" className="h-4 w-4 text-gold-500" />
                  {hotel.address || hotel.city}
                </p>
              )}
            </div>

            <dl className="mt-2 divide-y divide-haven-900/10 text-base">
              <Row label="Room">{room?.name}</Row>
              <Row label="Check-in">{formatDate(booking.check_in)}</Row>
              <Row label="Check-out">{formatDate(booking.check_out)}</Row>
              <Row label="Length of stay">
                {nights} {pluralize(nights, 'night')}
              </Row>
              <Row label="Guests">
                <span className="inline-flex items-center gap-1">
                  <Users aria-hidden="true" className="h-4 w-4" />
                  {booking.guests}
                </span>
              </Row>
              <Row label="Guest name">{booking.guest_name}</Row>
              <Row label="Email">{booking.guest_email}</Row>
              {booking.guest_phone && <Row label="Phone">{booking.guest_phone}</Row>}
              {booking.special_requests && <Row label="Special requests">{booking.special_requests}</Row>}
              <div className="flex items-baseline justify-between gap-4 py-3 text-xl">
                <dt className="font-semibold text-haven-900">Total paid at property</dt>
                <dd className="font-semibold text-haven-900">{formatPKR(booking.total_price)}</dd>
              </div>
            </dl>

            {hotel && (
              <div className="mt-2 space-y-3">
                <HotelTrustBadges hotel={hotel} />
                <p className="rounded-xl bg-haven-50 p-4 text-sm text-ink-900">
                  {cancellationText(hotel.free_cancellation, hotel.cancellation_hours)}
                </p>
              </div>
            )}

            {hotel && !isCancelled && (
              <div className="mt-4 border-t border-haven-900/10 pt-4">
                {cancelState.allowed && !confirming && (
                  <>
                    <p className="text-sm text-ink-500">
                      You can cancel for free until {formatDeadline(cancelState.deadline)} (Pakistan time).
                    </p>
                    <button type="button" onClick={() => setConfirming(true)} className={`${btnDanger} mt-3`}>
                      Cancel booking
                    </button>
                  </>
                )}

                {cancelState.allowed && confirming && (
                  <div role="group" aria-label="Confirm cancellation">
                    <p className="text-base font-semibold text-haven-900">Cancel this booking?</p>
                    <p className="mt-1 text-sm text-ink-500">
                      Your dates will be released and this cannot be undone.
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <button type="button" onClick={handleCancel} disabled={isCancelling} className={btnDanger}>
                        {isCancelling && <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />}
                        {isCancelling ? 'Cancelling...' : 'Yes, cancel booking'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        disabled={isCancelling}
                        className={btnSecondary}
                      >
                        Keep booking
                      </button>
                    </div>
                  </div>
                )}

                {!cancelState.allowed && cancelState.reason && (
                  <p className="text-sm text-ink-500">{cancelState.reason}</p>
                )}

                {cancelStatus === 'error' && (
                  <p role="alert" className="mt-3 rounded-xl border border-danger/40 bg-white p-4 text-sm text-danger">
                    {cancelError}
                  </p>
                )}
              </div>
            )}
          </section>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/" className={btnPrimary}>
              Back to home
            </Link>
            <Link to="/hotels" className={btnSecondary}>
              Browse more stays
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
