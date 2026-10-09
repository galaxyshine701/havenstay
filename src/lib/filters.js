export const DEFAULT_FILTERS = { maxPrice: 0, minRating: 0, freeCancellation: false };

// items: [{ hotel, minPrice, availableRooms }]. Returns the matching ones, best rated first.
// A filter value of 0 / false means "no filter".
export function applyFilters(items, filters) {
  return items
    .filter(({ hotel, minPrice }) => {
      if (filters.maxPrice && minPrice > filters.maxPrice) return false;
      if (filters.minRating && Number(hotel.rating ?? 0) < filters.minRating) return false;
      if (filters.freeCancellation && !hotel.free_cancellation) return false;
      return true;
    })
    .sort((a, b) => Number(b.hotel.rating ?? 0) - Number(a.hotel.rating ?? 0));
}
