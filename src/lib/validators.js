export const LOCATIONS = ['Hunza', 'Skardu', 'Islamabad'];
export const MIN_GUESTS = 1;
export const MAX_GUESTS = 10;

/* ---------- dates (local time on purpose) ----------
   Never use new Date().toISOString().slice(0, 10) for "today": it returns the UTC
   date, which is yesterday for users in Pakistan between 00:00 and 05:00. */

const pad = (n) => String(n).padStart(2, '0');

export function toISODate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const getToday = () => toISODate(new Date());

export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d + days));
}

// True only for real calendar dates in YYYY-MM-DD form ("2026-02-31" is rejected).
export function isISODate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  return toISODate(new Date(y, m - 1, d)) === value;
}

/* ---------- search ---------- */

export function validateSearch({ location, checkIn, checkOut, guests }, today = getToday()) {
  const errors = {};
  const guestCount = Number(guests);

  if (!LOCATIONS.includes(location)) errors.location = 'Please choose a destination.';

  if (!checkIn) errors.checkIn = 'Select a check-in date.';
  else if (checkIn < today) errors.checkIn = 'Check-in cannot be in the past.';

  if (!checkOut) errors.checkOut = 'Select a check-out date.';
  else if (checkIn && checkOut <= checkIn) errors.checkOut = 'Check-out must be after check-in.';

  if (
    guests === '' ||
    !Number.isInteger(guestCount) ||
    guestCount < MIN_GUESTS ||
    guestCount > MAX_GUESTS
  ) {
    errors.guests = `Enter a whole number from ${MIN_GUESTS} to ${MAX_GUESTS}.`;
  }

  return errors;
}

// Reads and sanitises the URL query string. Anything invalid (a hand-edited URL,
// past dates, ?location=Lahore) is ignored instead of crashing a page.
export function parseSearchParams(searchParams) {
  const rawLocation = searchParams.get('location');
  const location = LOCATIONS.includes(rawLocation) ? rawLocation : '';

  const rawGuests = Number(searchParams.get('guests'));
  const guests =
    Number.isInteger(rawGuests) && rawGuests >= MIN_GUESTS && rawGuests <= MAX_GUESTS
      ? rawGuests
      : 2;

  const rawCheckIn = searchParams.get('checkIn');
  const rawCheckOut = searchParams.get('checkOut');
  const hasDates = Boolean(
    isISODate(rawCheckIn) &&
      isISODate(rawCheckOut) &&
      rawCheckIn >= getToday() &&
      rawCheckOut > rawCheckIn,
  );

  return {
    location,
    checkIn: hasDates ? rawCheckIn : '',
    checkOut: hasDates ? rawCheckOut : '',
    guests,
    hasDates,
  };
}

// Builds "location=Hunza&checkIn=...&checkOut=...&guests=2", skipping empty values.
export function buildSearchQuery({ location, checkIn, checkOut, guests }) {
  const params = new URLSearchParams();
  if (location) params.set('location', location);
  if (checkIn) params.set('checkIn', checkIn);
  if (checkOut) params.set('checkOut', checkOut);
  if (guests) params.set('guests', String(guests));
  return params.toString();
}

/* ---------- auth and booking forms ---------- */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email) {
  return EMAIL_PATTERN.test(String(email).trim());
}

export function validateAuth({ mode, fullName, email, password }) {
  const errors = {};
  if (mode === 'signup' && String(fullName).trim().length < 2) {
    errors.fullName = 'Enter your full name.';
  }
  if (!validateEmail(email)) errors.email = 'Enter a valid email address.';
  if (String(password).length < 6) errors.password = 'Use at least 6 characters.';
  return errors;
}

export function validateBookingForm({ fullName, email, phone, specialRequests }) {
  const errors = {};
  const name = String(fullName).trim();
  const digits = String(phone).replace(/\D/g, '');

  if (name.length < 2 || name.length > 80) errors.fullName = 'Enter your full name.';
  if (!validateEmail(email)) errors.email = 'Enter a valid email address.';
  if (!/^[0-9+\s()-]+$/.test(String(phone).trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Enter a valid phone number, for example +92 300 1234567.';
  }
  if (String(specialRequests).length > 500) {
    errors.specialRequests = 'Please keep special requests under 500 characters.';
  }
  return errors;
}

// Only allow in-app paths after sign-in, never another website.
export function safeNextPath(next) {
  if (typeof next !== 'string') return '/';
  if (!next.startsWith('/') || next.startsWith('//') || next.includes('\\')) return '/';
  return next;
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUUID = (value) => UUID_PATTERN.test(String(value));
