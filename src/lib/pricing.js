const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// Mirrors the database formula in supabase/schema.sql (bookings_before_insert):
//   total = round(price_per_night * nights * (1 + (tax% + service fee%) / 100), 2)
// The database is the source of truth. This is only used to show the price BEFORE
// the booking exists. The confirmation page shows the stored total_price.
export function calculatePrice({ pricePerNight, nights, taxPercent = 0, serviceFeePercent = 0 }) {
  const rate = Number(pricePerNight);
  const tax = Number(taxPercent);
  const fee = Number(serviceFeePercent);

  const base = round2(rate * nights);
  return {
    base,
    tax: round2((base * tax) / 100),
    serviceFee: round2((base * fee) / 100),
    total: round2((base * (100 + tax + fee)) / 100),
  };
}
