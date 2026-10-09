import { Mountain } from 'lucide-react';
import { containerClass } from '../lib/ui';

export default function Footer() {
  return (
    <footer className="mt-16 bg-haven-900 text-white">
      <div className={`${containerClass} flex flex-col gap-4 py-12 md:flex-row md:items-start md:justify-between`}>
        <div>
          <p className="flex items-center gap-2 font-serif text-xl font-semibold">
            <Mountain aria-hidden="true" className="h-6 w-6 text-gold-500" />
            HavenStay
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/80">
            Boutique stays in Hunza, Skardu and Islamabad. An original design inspired by hotel
            booking platforms.
          </p>
        </div>

        <p className="max-w-md text-sm text-white/80">
          This is a student project. Hotel names, ratings, review counts and prices are sample
          data, not real businesses or real guest reviews. Photos are from Unsplash.
        </p>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        &copy; {new Date().getFullYear()} HavenStay
      </div>
    </footer>
  );
}
