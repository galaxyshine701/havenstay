import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck, CalendarCheck, ShieldCheck } from 'lucide-react';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import SafeImage from '../components/SafeImage';
import { usePageTitle } from '../hooks/usePageTitle';
import { DESTINATIONS, HERO_IMAGE } from '../lib/destinations';
import { buildSearchQuery } from '../lib/validators';
import { cardClass, containerClass } from '../lib/ui';

const REASONS = [
  {
    icon: BadgeCheck,
    title: 'Transparent pricing',
    text: 'Every price has a breakdown. Taxes and service fees are shown before you book, so there are no surprises at checkout.',
  },
  {
    icon: CalendarCheck,
    title: 'Clear cancellation rules',
    text: 'Stays that offer free cancellation say so on the listing, with the exact deadline in plain words.',
  },
  {
    icon: ShieldCheck,
    title: 'Your bookings stay private',
    text: 'Each booking belongs to your account. Other guests can never see your details.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  usePageTitle('');

  return (
    // Hero and SearchBar are siblings inside this one container, so the bar can stay sticky
    // for the whole page.
    <div>
      <Hero backgroundImage={HERO_IMAGE.src} imageAlt={HERO_IMAGE.alt} />
      <SearchBar overlapHero onSearch={(values) => navigate(`/hotels?${buildSearchQuery(values)}`)} />

      <section aria-labelledby="destinations-heading" className={`${containerClass} pt-16`}>
        <h2 id="destinations-heading" className="text-3xl font-semibold text-haven-900">
          Choose your destination
        </h2>
        <p className="mt-2 max-w-2xl text-base text-ink-500">
          Three places, each with hand-picked boutique stays.
        </p>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {DESTINATIONS.map((destination) => (
            <li key={destination.name}>
              <Link
                to={`/hotels?${buildSearchQuery({ location: destination.name })}`}
                className="group relative block h-80 overflow-hidden rounded-2xl border border-haven-900/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
              >
                <SafeImage
                  src={destination.image}
                  alt={destination.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-haven-900/85 via-haven-900/20 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <h3 className="text-2xl font-semibold">{destination.name}</h3>
                  <p className="mt-1 text-sm text-white/90">{destination.tagline}</p>
                  <p className="mt-3 text-sm font-semibold underline underline-offset-4">
                    See stays in {destination.name}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="why-heading" className={`${containerClass} pt-16`}>
        <h2 id="why-heading" className="text-3xl font-semibold text-haven-900">
          Why book with HavenStay
        </h2>

        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {REASONS.map(({ icon: Icon, title, text }) => (
            <li key={title} className={`${cardClass} p-6`}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-haven-50">
                <Icon aria-hidden="true" className="h-6 w-6 text-haven-700" />
              </span>
              <h3 className="mt-4 text-xl font-semibold text-haven-900">{title}</h3>
              <p className="mt-2 text-base text-ink-500">{text}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
