import { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, ChevronUp, LoaderCircle, MapPin, Search, Users } from 'lucide-react';
import { formatDateShort } from '../lib/formatters';
import {
  LOCATIONS,
  MAX_GUESTS,
  MIN_GUESTS,
  addDays,
  getToday,
  isISODate,
  validateSearch,
} from '../lib/validators';

/**
 * Sticky hotel search bar.
 *
 * Props:
 * - initialValues: { location, checkIn, checkOut, guests }. Dates are 'YYYY-MM-DD'.
 *   Invalid values (for example a hand-edited URL like ?location=Lahore) are ignored.
 *   Changing this prop later does not reset the form; pass a `key` from the parent
 *   (for example key={searchParams.toString()}) if you need that.
 * - onSearch(values): called only with valid values:
 *   { location, checkIn, checkOut, guests: number }.
 *   The parent decides what to do (for example navigate to /hotels?location=...).
 * - isSearching: disables the button and shows a spinner while results load.
 * - topOffset: pixels to stick below another sticky element (for example a navbar).
 * - overlapHero: pulls the bar up over the bottom of the <Hero /> (home page only).
 *
 * Placement: render this as a direct child of the page container, NOT inside <Hero />,
 * and keep every ancestor free of overflow-hidden/auto. Otherwise `position: sticky`
 * silently stops working.
 *
 * Small screens: once stuck to the top, the tall form collapses into a one-line
 * summary (tap to edit) so it does not cover half of the phone screen.
 */

const FIELD_ORDER = ['location', 'checkIn', 'checkOut', 'guests'];
const CONTROL_BASE = 'h-8 w-full min-w-0 bg-transparent text-base outline-none';

function buildInitialValues(initial) {
  const guests = Number(initial?.guests);
  return {
    location: LOCATIONS.includes(initial?.location) ? initial.location : '',
    checkIn: isISODate(initial?.checkIn) ? initial.checkIn : '',
    checkOut: isISODate(initial?.checkOut) ? initial.checkOut : '',
    // Guests stays a string while typing so the field can be empty for a moment.
    guests:
      Number.isInteger(guests) && guests >= MIN_GUESTS && guests <= MAX_GUESTS
        ? String(guests)
        : '2',
  };
}

function buildSummary(values) {
  const n = Number(values.guests);
  const guestsText = Number.isInteger(n) && n > 0 ? `${n} guest${n === 1 ? '' : 's'}` : 'Add guests';
  const datesText =
    values.checkIn && values.checkOut
      ? `${formatDateShort(values.checkIn)} – ${formatDateShort(values.checkOut)}`
      : 'Add dates';
  return [values.location || 'Where to?', datesText, guestsText].join(' · ');
}

// Chrome only opens the date picker from the small calendar icon; this makes the whole field open it.
function openPicker(event) {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // showPicker is not supported or not allowed here; the native input still works.
  }
}

const a11y = (id, error) => ({
  id,
  'aria-invalid': error ? 'true' : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});

function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div
      className={`flex min-h-[72px] min-w-0 flex-col justify-center rounded-xl border bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-gold-500 lg:border-0 lg:hover:bg-haven-50 ${
        error ? 'border-danger' : 'border-haven-900/15'
      }`}
    >
      <label
        htmlFor={id}
        className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500"
      >
        <Icon aria-hidden="true" className="h-4 w-4 text-gold-500" />
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default function SearchBar({
  initialValues,
  onSearch,
  isSearching = false,
  topOffset = 0,
  overlapHero = false,
}) {
  const baseId = useId();
  const formId = `${baseId}-form`;
  const ids = {
    location: `${baseId}-location`,
    checkIn: `${baseId}-check-in`,
    checkOut: `${baseId}-check-out`,
    guests: `${baseId}-guests`,
  };

  const sentinelRef = useRef(null);
  const fieldRefs = useRef({});

  const [values, setValues] = useState(() => buildInitialValues(initialValues));
  const [submitted, setSubmitted] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const today = getToday();
  // Errors are derived (not stored), so they always match the current values.
  const errors = submitted ? validateSearch(values, today) : {};
  const collapsed = isStuck && !expanded;

  // Detect "stuck to the top" with a 1px sentinel placed just before the sticky wrapper.
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // "Not visible" alone is not enough: the sentinel can also be below the fold.
        const stuck = !entry.isIntersecting && entry.boundingClientRect.top < topOffset;
        setIsStuck(stuck);
        if (!stuck) setExpanded(false);
      },
      { threshold: 0, rootMargin: `${-topOffset}px 0px 0px 0px` },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [topOffset]);

  // When the collapsed summary is opened, move focus into the form.
  useEffect(() => {
    if (expanded) fieldRefs.current.location?.focus();
  }, [expanded]);

  const setRef = (name) => (element) => {
    fieldRefs.current[name] = element;
  };

  const update = (name) => (event) => {
    const { value } = event.target;
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Keep the range valid: moving check-in past check-out pushes check-out forward.
      if (name === 'checkIn' && value && next.checkOut && next.checkOut <= value) {
        next.checkOut = addDays(value, 1);
      }
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const found = validateSearch(values, getToday());
    const firstInvalid = FIELD_ORDER.find((name) => found[name]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setExpanded(false);
    onSearch?.({
      location: values.location,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      guests: Number(values.guests),
    });
  };

  const checkOutMin = addDays(values.checkIn || today, 1);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className={`${overlapHero ? '-mt-10' : ''} h-px`} />

      <div
        style={{ top: topOffset }}
        className={`sticky z-40 border-b transition-colors duration-200 ${
          isStuck
            ? 'max-h-[100dvh] overflow-y-auto border-haven-900/10 bg-sand-100/90 backdrop-blur-md'
            : 'border-transparent'
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          <div className="rounded-2xl border border-haven-900/10 bg-white p-2 shadow-xl shadow-haven-900/10">
            {/* Below lg only: one-line summary while stuck */}
            {collapsed && (
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-expanded="false"
                aria-controls={formId}
                className="flex min-h-[56px] w-full items-center gap-3 rounded-xl px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:hidden"
              >
                <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-gold-500" />
                <span className="min-w-0 flex-1 truncate text-sm text-ink-900">
                  {buildSummary(values)}
                </span>
                <span className="text-sm font-semibold text-haven-700">Edit</span>
              </button>
            )}

            {isStuck && expanded && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="mb-2 flex min-h-[44px] w-full items-center justify-center gap-1 rounded-xl text-sm font-semibold text-haven-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 lg:hidden"
              >
                <ChevronUp aria-hidden="true" className="h-4 w-4" />
                Close search
              </button>
            )}

            <form
              id={formId}
              role="search"
              aria-label="Search hotels"
              noValidate
              onSubmit={handleSubmit}
              className={`${collapsed ? 'hidden lg:flex' : 'flex'} flex-col gap-2 lg:flex-row lg:items-start`}
            >
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_0.8fr] lg:gap-0 lg:divide-x lg:divide-haven-900/10">
                <Field id={ids.location} label="Location" icon={MapPin} error={errors.location}>
                  <select
                    ref={setRef('location')}
                    {...a11y(ids.location, errors.location)}
                    value={values.location}
                    onChange={update('location')}
                    className={`${CONTROL_BASE} ${values.location ? 'text-ink-900' : 'text-ink-500'}`}
                  >
                    <option value="" disabled>
                      Where to?
                    </option>
                    {LOCATIONS.map((city) => (
                      <option key={city} value={city} className="text-ink-900">
                        {city}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id={ids.checkIn} label="Check-in" icon={CalendarDays} error={errors.checkIn}>
                  <input
                    ref={setRef('checkIn')}
                    {...a11y(ids.checkIn, errors.checkIn)}
                    type="date"
                    min={today}
                    value={values.checkIn}
                    onChange={update('checkIn')}
                    onClick={openPicker}
                    className={`${CONTROL_BASE} text-ink-900`}
                  />
                </Field>

                <Field id={ids.checkOut} label="Check-out" icon={CalendarDays} error={errors.checkOut}>
                  <input
                    ref={setRef('checkOut')}
                    {...a11y(ids.checkOut, errors.checkOut)}
                    type="date"
                    min={checkOutMin}
                    value={values.checkOut}
                    onChange={update('checkOut')}
                    onClick={openPicker}
                    className={`${CONTROL_BASE} text-ink-900`}
                  />
                </Field>

                <Field id={ids.guests} label="Guests" icon={Users} error={errors.guests}>
                  <input
                    ref={setRef('guests')}
                    {...a11y(ids.guests, errors.guests)}
                    type="number"
                    inputMode="numeric"
                    min={MIN_GUESTS}
                    max={MAX_GUESTS}
                    step={1}
                    placeholder="2"
                    value={values.guests}
                    onChange={update('guests')}
                    className={`${CONTROL_BASE} text-ink-900`}
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                aria-busy={isSearching}
                className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-haven-900 px-8 text-base font-semibold text-white transition-colors hover:bg-haven-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 lg:min-h-[72px] lg:w-auto lg:min-w-[160px]"
              >
                {isSearching ? (
                  <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
                ) : (
                  <Search aria-hidden="true" className="h-5 w-5" />
                )}
                {isSearching ? 'Searching…' : 'Search'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
