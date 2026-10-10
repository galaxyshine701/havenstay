import { CalendarDays } from 'lucide-react';
import BookingCard from '../components/BookingCard';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Skeleton from '../components/Skeleton';
import { useAuth } from '../hooks/useAuth';
import { useMyBookings } from '../hooks/useBooking';
import { usePageTitle } from '../hooks/usePageTitle';
import { pluralize } from '../lib/formatters';
import { containerClass } from '../lib/ui';

export default function MyBookings() {
  const { user } = useAuth();
  const { status, data: bookings, reload } = useMyBookings(user?.id);
  usePageTitle('My bookings');

  return (
    <div className={`${containerClass} py-12`}>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold text-haven-900">My bookings</h1>
        <p aria-live="polite" className="mt-2 text-base text-ink-500">
          {status === 'success' && bookings.length > 0
            ? `${bookings.length} ${pluralize(bookings.length, 'booking')}, newest first.`
            : 'Your reservations appear here.'}
        </p>

        <section aria-label="Your bookings" aria-busy={status === 'loading'} className="mt-8">
          {status === 'loading' && (
            <div className="space-y-4" aria-hidden="true">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-56 w-full" />
              <Skeleton className="h-56 w-full" />
            </div>
          )}

          {status === 'error' && <ErrorState onRetry={reload} />}

          {status === 'success' && bookings.length === 0 && (
            <EmptyState
              icon={CalendarDays}
              title="No bookings yet"
              message="When you book a stay it will show up here, so you can find your reference and cancel if your plans change."
              actionLabel="Browse stays"
              actionTo="/hotels"
            />
          )}

          {status === 'success' && bookings.length > 0 && (
            <ul className="space-y-4">
              {bookings.map((booking) => (
                <li key={booking.id}>
                  <BookingCard booking={booking} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
