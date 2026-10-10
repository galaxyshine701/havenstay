export const DEFAULT_FILTERS = { maxPrice: 0, minRating: 0, freeCancellation: false };

// How the result list can be ordered. `label` is shown in the "Sort by" dropdown.
export const SORT_OPTIONS = [
  { value: 'rating', label: 'Best rated' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];
export const DEFAULT_SORT = 'rating';

const ratingOf = ({ hotel }) => Number(hotel.rating ?? 0);
const priceOf = ({ minPrice }) => Number(minPrice);

// Each comparer orders the best match first. When two stays tie, the hotel name decides,
// so the order never jumps around between renders.
const COMPARERS = {
  rating: (a, b) => ratingOf(b) - ratingOf(a),
  'price-asc': (a, b) => priceOf(a) - priceOf(b),
  'price-desc': (a, b) => priceOf(b) - priceOf(a),
};

// items: [{ hotel, minPrice, availableRooms }]. Returns a NEW array of the matching ones,
// ordered by `sortBy` (an unknown value falls back to best rated).
// A filter value of 0 / false means "no filter".
export function applyFilters(items, filters, sortBy = DEFAULT_SORT) {
  const compare = COMPARERS[sortBy] ?? COMPARERS[DEFAULT_SORT];
  return items
    .filter(({ hotel, minPrice }) => {
      if (filters.maxPrice && minPrice > filters.maxPrice) return false;
      if (filters.minRating && Number(hotel.rating ?? 0) < filters.minRating) return false;
      if (filters.freeCancellation && !hotel.free_cancellation) return false;
      return true;
    })
    .sort((a, b) => compare(a, b) || a.hotel.name.localeCompare(b.hotel.name));
}
