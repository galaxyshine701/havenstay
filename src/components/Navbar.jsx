import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogIn, LogOut, Mountain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { containerClass } from '../lib/ui';

const navLinkClass = ({ isActive }) =>
  `inline-flex min-h-[44px] items-center rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
    isActive ? 'text-haven-900' : 'text-ink-500 hover:text-haven-900'
  }`;

export default function Navbar() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name && profile.full_name !== 'Guest' ? profile.full_name : user?.email;

  return (
    <header className="border-b border-haven-900/10 bg-white">
      <div className={`${containerClass} flex items-center justify-between gap-4 py-2`}>
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg font-serif text-xl font-semibold text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
        >
          <Mountain aria-hidden="true" className="h-6 w-6 text-gold-500" />
          HavenStay
        </Link>

        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/hotels" className={navLinkClass}>
            Stays
          </NavLink>

          {!loading && user && (
            <>
              <NavLink to="/my-bookings" className={navLinkClass}>
                <span className="sm:hidden">Bookings</span>
                <span className="hidden sm:inline">My bookings</span>
              </NavLink>
              <span className="hidden max-w-[160px] truncate text-sm text-ink-500 md:inline">
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-sm font-semibold text-ink-500 transition-colors hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <LogOut aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Sign out</span>
              </button>
            </>
          )}

          {!loading && !user && (
            <Link
              to="/auth"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-haven-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-haven-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              <LogIn aria-hidden="true" className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
