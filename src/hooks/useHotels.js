import { getAvailableRoomIds, getHotelBySlug, searchHotels } from '../lib/api';
import { useQuery } from './useQuery';

// Results page: list of { hotel, minPrice, availableRooms }.
export function useHotelSearch({ location, checkIn, checkOut, guests, hasDates }) {
  const key = [location, checkIn, checkOut, guests, hasDates].join('|');
  return useQuery(key, () => searchHotels({ location, checkIn, checkOut, guests, hasDates }));
}

// Details page: { hotel, rooms, availableRoomIds } or null when the hotel does not exist.
// availableRoomIds is null until the visitor has chosen valid dates.
export function useHotelDetails(slug, { checkIn, checkOut, hasDates }) {
  const key = [slug, checkIn, checkOut, hasDates].join('|');
  return useQuery(key, async () => {
    const result = await getHotelBySlug(slug);
    if (!result) return null;

    const availableRoomIds = hasDates
      ? await getAvailableRoomIds(result.hotel.id, checkIn, checkOut)
      : null;
    return { ...result, availableRoomIds };
  });
}
