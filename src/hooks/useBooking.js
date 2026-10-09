import { useCallback, useState } from 'react';
import { cancelBooking, createBooking, getBookingByReference, getRoomWithHotel } from '../lib/api';
import { useQuery } from './useQuery';

const CONFLICT_MESSAGE =
  'Sorry, this room was just booked for those dates. Please choose other dates or another room.';

// Booking page: the chosen room with its hotel (room.hotels).
export function useRoomWithHotel(roomId) {
  return useQuery(`room|${roomId}`, () => getRoomWithHotel(roomId));
}

// Confirmation page: the booking read back from the database.
export function useBookingByReference(reference) {
  return useQuery(`booking|${reference}`, () => getBookingByReference(reference));
}

/**
 * Submit state for the booking button: 'idle' | 'submitting' | 'success' | 'error'.
 * submit(payload) resolves to the booking reference, or null when it failed
 * (then `error` holds a message that is safe to show).
 */
export function useCreateBooking() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const submit = useCallback(async (payload) => {
    setStatus('submitting');
    setError('');
    try {
      const reference = await createBooking(payload);
      setStatus('success');
      return reference;
    } catch (err) {
      setStatus('error');
      // 23P01 = exclusion constraint violation = overlapping booking for the same room.
      if (err?.code === '23P01') setError(CONFLICT_MESSAGE);
      else setError(err?.message || 'Something went wrong while saving your booking. Please try again.');
      return null;
    }
  }, []);

  return { status, error, submit };
}

/**
 * Cancel state: 'idle' | 'cancelling' | 'error'.
 * cancel(bookingId) resolves to true when the database accepted the cancellation, or
 * false when it refused (then `error` holds the database's plain-words reason).
 */
export function useCancelBooking() {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const cancel = useCallback(async (bookingId) => {
    setStatus('cancelling');
    setError('');
    try {
      await cancelBooking(bookingId);
      setStatus('idle');
      return true;
    } catch (err) {
      setStatus('error');
      setError(err?.message || 'We could not cancel this booking. Please try again.');
      return false;
    }
  }, []);

  return { status, error, cancel };
}
