import { useState } from 'react';
import { BadgeCheck, ShieldCheck } from 'lucide-react';

/**
 * Hero section for the HavenStay home page.
 *
 * Props (all optional):
 * - backgroundImage: a real image URL (for example an Unsplash URL you verified).
 *   If it is empty or fails to load, a pine-green gradient is shown instead,
 *   so the hero never looks broken.
 * - imageAlt: describe the photo for screen readers. Leave it empty if the photo
 *   is purely decorative.
 *
 * Layout note: <SearchBar /> must be rendered as the NEXT SIBLING of <Hero />
 * (not inside it). It pulls itself up over the bottom of the hero, and `sticky`
 * only works when its parent is the whole page container.
 */
export default function Hero({
  backgroundImage = '',
  imageAlt = '',
  eyebrow = 'Boutique stays · Hunza · Skardu · Islamabad',
  title = 'Wake up where the mountains begin.',
  subtitle = 'Hand-picked boutique stays in Hunza, Skardu and Islamabad. Clear prices, no hidden fees.',
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(backgroundImage) && !imageFailed;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-haven-900"
    >
      {/* Layer 1: gradient fallback (always present behind the photo) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-gradient-to-br from-haven-900 via-haven-700 to-haven-900"
      />

      {/* Layer 2: background photo. Eager on purpose: it is the first thing users see (LCP). */}
      {showImage && (
        <img
          src={backgroundImage}
          alt={imageAlt}
          loading="eager"
          decoding="async"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
      )}

      {/* Layer 3: dark overlay so white text keeps AA contrast on any photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-haven-900/60 via-haven-900/40 to-haven-900/75"
      />

      <div className="mx-auto flex min-h-[480px] max-w-6xl flex-col justify-center px-4 pb-24 pt-16 sm:px-6 md:min-h-[560px] md:pb-28 md:pt-24">
        <p className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/85">
          <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
          {eyebrow}
        </p>

        <h1
          id="hero-heading"
          className="max-w-2xl text-balance font-serif text-3xl font-semibold leading-tight text-white sm:text-5xl sm:leading-tight"
        >
          {title}
        </h1>

        <p className="mt-4 max-w-xl text-base text-white/90 md:text-xl">{subtitle}</p>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90">
          <li className="flex items-center gap-2">
            <BadgeCheck aria-hidden="true" className="h-4 w-4 text-gold-500" />
            No hidden fees
          </li>
          <li className="flex items-center gap-2">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-gold-500" />
            Secure booking
          </li>
        </ul>
      </div>
    </section>
  );
}
