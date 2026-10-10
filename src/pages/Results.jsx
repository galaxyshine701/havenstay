import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import HotelCard from '../components/HotelCard';
import HotelCardSkeleton from '../components/HotelCardSkeleton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import { useHotelSearch } from '../hooks/useHotels';
import { usePageTitle } from '../hooks/usePageTitle';
import { DEFAULT_FILTERS, DEFAULT_SORT, SORT_OPTIONS, applyFilters } from '../lib/filters';
import { countNights, formatDate, pluralize } from '../lib/formatters';
import { containerClass } from '../lib/ui';
import { buildSearchQuery, parseSearchParams } from '../lib/validators';

export default function Results() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // The URL is the source of truth for the search (refresh and share keep working).
  const search = parseSearchParams(searchParams);
  const { status, data, reload } = useHotelSearch(search);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  const visible = useMemo(
    () => (data ? applyFilters(data, filters, sortBy) : []),
    [data, filters, sortBy],
  );

  const heading = search.location ? `Stays in ${search.location}` : 'All boutique stays';
  usePageTitle(heading);

  const nights = search.hasDates ? countNights(search.checkIn, search.checkOut) : 0;
  const summary = search.hasDates
    ? `${formatDate(search.checkIn)} to ${formatDate(search.checkOut)} · ${nights} ${pluralize(nights, 'night')} · ${search.guests} ${pluralize(search.guests, 'guest')}`
    : 'Add your dates in the search bar to see what is available.';

  return (
    <div>
      <SearchBar
        key={searchParams.toString()}
        initialValues={search}
        isSearching={status === 'loading'}
        onSearch={(values) => navigate(`/hotels?${buildSearchQuery(values)}`)}
      />

      <div className={`${containerClass} py-8`}>
        <h1 className="text-3xl font-semibold text-haven-900">{heading}</h1>
        <p className="mt-2 text-base text-ink-500">{summary}</p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm text-ink-500">
            {status === 'success' &&
              `${visible.length} ${pluralize(visible.length, 'stay')} shown`}
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-by" className="text-sm font-semibold text-ink-900">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              disabled={status !== 'success'}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-h-[44px] rounded-xl border border-haven-900/20 bg-white px-3 text-base text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:opacity-60"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside>
            <Filters
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters(DEFAULT_FILTERS)}
              disabled={status !== 'success'}
            />
          </aside>

          <section aria-label="Hotel results" aria-busy={status === 'loading'}>
            {status === 'loading' && (
              <div className="space-y-6">
                <HotelCardSkeleton />
                <HotelCardSkeleton />
                <HotelCardSkeleton />
              </div>
            )}

            {status === 'error' && <ErrorState onRetry={reload} />}

            {status === 'success' && data.length === 0 && (
              <EmptyState
                title="No stays available"
                message="No stays available for these dates. Try different dates or another destination."
                actionLabel="View all stays"
                actionTo="/hotels"
              />
            )}

            {status === 'success' && data.length > 0 && visible.length === 0 && (
              <EmptyState
                title="No stays match your filters"
                message="Try a higher price limit or a lower rating to see more stays."
                actionLabel="Clear filters"
                onAction={() => setFilters(DEFAULT_FILTERS)}
              />
            )}

            {status === 'success' && visible.length > 0 && (
              <ul className="space-y-6">
                {visible.map(({ hotel, minPrice }) => (
                  <li key={hotel.id}>
                    <HotelCard hotel={hotel} minPrice={minPrice} search={search} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
