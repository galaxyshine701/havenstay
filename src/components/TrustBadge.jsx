import { BadgeCheck, CalendarCheck, ShieldCheck } from 'lucide-react';

const VARIANTS = {
  cancellation: { icon: CalendarCheck, label: 'Free Cancellation' },
  fees: { icon: BadgeCheck, label: 'No hidden fees' },
  secure: { icon: ShieldCheck, label: 'Secure booking' },
};

// variant: 'cancellation' | 'fees' | 'secure'
export default function TrustBadge({ variant }) {
  const config = VARIANTS[variant];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-haven-700/20 bg-haven-50 px-3 py-1 text-xs font-semibold text-haven-700">
      <Icon aria-hidden="true" className="h-4 w-4 text-success" />
      {config.label}
    </span>
  );
}

// The badges for one hotel, driven by its data. "Free Cancellation" only appears
// when the hotel really offers it.
export function HotelTrustBadges({ hotel }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {hotel.free_cancellation && (
        <li>
          <TrustBadge variant="cancellation" />
        </li>
      )}
      <li>
        <TrustBadge variant="fees" />
      </li>
      <li>
        <TrustBadge variant="secure" />
      </li>
    </ul>
  );
}
