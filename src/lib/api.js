import { supabase } from './supabaseClient';
import { LOCATIONS, isUUID } from './validators';

// Every function here either returns data or throws the Supabase error,
// so the hooks can turn failures into the "error" UI state.

/**
 * Hotel search.
 * - With valid dates: asks the database which hotels have a free room (RPC), so
 *   already-booked rooms are excluded.
 * - Without dates: "browse mode" lists hotels that have at least one room for the guests.
 * Returns [{ hotel, minPrice, availableRooms }].
 */
export async function searchHotels({ location, checkIn, checkOut, guests, hasDates }) {
  if (hasDates) {
    const cities = location ? [location] : LOCATIONS;
    const results = await Promise.all(
      cities.map(async (city) => {
        const { data, error } = await supabase.rpc('search_available_hotels', {
          p_city: city,
          p_check_in: checkIn,
          p_check_out: checkOut,
          p_guests: guests,
        });
        if (error) throw error;
        return data ?? [];
      }),
    );

    const available = results.flat();
    if (available.length === 0) return [];

    const { data: hotels, error } = await supabase
      .from('hotels')
      .select('*')
      .in(
        'id',
        available.map((row) => row.hotel_id),
      );
    if (error) throw error;

    const byId = new Map(available.map((row) => [row.hotel_id, row]));
    return (hotels ?? []).map((hotel) => ({
      hotel,
      minPrice: Number(byId.get(hotel.id).min_price),
      availableRooms: byId.get(hotel.id).available_rooms,
    }));
  }

  let query = supabase.from('hotels').select('*, rooms(price_per_night, capacity)');
  if (location) query = query.eq('city', location);
  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).flatMap(({ rooms, ...hotel }) => {
    const fitting = (rooms ?? []).filter((room) => room.capacity >= guests);
    if (fitting.length === 0) return [];
    return [
      {
        hotel,
        minPrice: Math.min(...fitting.map((room) => Number(room.price_per_night))),
        availableRooms: null,
      },
    ];
  });
}

// One hotel with its rooms (cheapest first), or null when the slug does not exist.
export async function getHotelBySlug(slug) {
  const { data, error } = await supabase
    .from('hotels')
    .select('*, rooms(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { rooms, ...hotel } = data;
  const sorted = [...(rooms ?? [])].sort(
    (a, b) => Number(a.price_per_night) - Number(b.price_per_night),
  );
  return { hotel, rooms: sorted };
}

// Set of room ids that are free for the given dates.
export async function getAvailableRoomIds(hotelId, checkIn, checkOut) {
  const { data, error } = await supabase.rpc('available_room_ids', {
    p_hotel_id: hotelId,
    p_check_in: checkIn,
    p_check_out: checkOut,
  });
  if (error) throw error;
  return new Set((data ?? []).map((row) => row.room_id));
}

// A room together with its hotel, or null when the id is invalid or missing.
export async function getRoomWithHotel(roomId) {
  if (!isUUID(roomId)) return null;
  const { data, error } = await supabase
    .from('rooms')
    .select('*, hotels(*)')
    .eq('id', roomId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Inserts a booking and returns its reference. total_price, status and hotel_id are
// NOT sent: the database trigger sets them (see supabase/schema.sql).
export async function createBooking(payload) {
  const { data, error } = await supabase.from('bookings').insert(payload).select('reference').single();
  if (error) throw error;
  return data.reference;
}

// All bookings of the signed-in guest, newest first. No user filter is needed here:
// row level security only ever returns the caller's own bookings.
export async function getMyBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, reference, check_in, check_out, guests, total_price, status, created_at, hotels(name, city), rooms(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// Cancels a booking through the database function cancel_booking(). The function checks
// that the booking is yours and that the hotel's cancellation policy still allows it;
// otherwise it raises an error whose message is safe to show.
export async function cancelBooking(bookingId) {
  const { error } = await supabase.rpc('cancel_booking', { p_booking_id: bookingId });
  if (error) throw error;
}

// Reads a booking back from the database (row level security: only the owner can).
export async function getBookingByReference(reference) {
  const { data, error } = await supabase
    .from('bookings')
    .select(
      '*, hotels(name, slug, city, address, free_cancellation, cancellation_hours), rooms(name)',
    )
    .eq('reference', String(reference).toUpperCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}
