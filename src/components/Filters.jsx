import { useId } from 'react';
import { cardClass } from '../lib/ui';

const PRICE_OPTIONS = [
  { value: 0, label: 'Any price' },
  { value: 20000, label: 'Up to PKR 20,000' },
  { value: 30000, label: 'Up to PKR 30,000' },
  { value: 40000, label: 'Up to PKR 40,000' },
];

const RATING_OPTIONS = [
  { value: 0, label: 'Any rating' },
  { value: 4, label: '4.0 and above' },
  { value: 4.5, label: '4.5 and above' },
];

const selectClass =
  'min-h-[44px] w-full rounded-xl border border-haven-900/20 bg-white px-3 text-base text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500';

// Filters work on the hotels already loaded (price is the cheapest nightly rate).
export default function Filters({ filters, onChange, onClear, disabled = false }) {
  const baseId = useId();

  return (
    <form className={`${cardClass} p-4`} onSubmit={(event) => event.preventDefault()} aria-label="Filters">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-haven-900">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="min-h-[44px] rounded text-sm font-semibold text-haven-700 underline underline-offset-4 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-60"
        >
          Clear
        </button>
      </div>

      <div className="mt-2 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <div>
          <label htmlFor={`${baseId}-price`} className="mb-1 block text-sm font-semibold text-ink-900">
            Price per night
          </label>
          <select
            id={`${baseId}-price`}
            disabled={disabled}
            value={filters.maxPrice}
            onChange={(event) => onChange({ ...filters, maxPrice: Number(event.target.value) })}
            className={selectClass}
          >
            {PRICE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${baseId}-rating`} className="mb-1 block text-sm font-semibold text-ink-900">
            Guest rating
          </label>
          <select
            id={`${baseId}-rating`}
            disabled={disabled}
            value={filters.minRating}
            onChange={(event) => onChange({ ...filters, minRating: Number(event.target.value) })}
            className={selectClass}
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <label
            htmlFor={`${baseId}-cancel`}
            className="flex min-h-[44px] cursor-pointer items-center gap-3 text-base text-ink-900"
          >
            <input
              id={`${baseId}-cancel`}
              type="checkbox"
              disabled={disabled}
              checked={filters.freeCancellation}
              onChange={(event) => onChange({ ...filters, freeCancellation: event.target.checked })}
              className="h-5 w-5 rounded border-haven-900/30 text-haven-900 focus:ring-gold-500"
            />
            Free cancellation only
          </label>
        </div>
      </div>
    </form>
  );
}
