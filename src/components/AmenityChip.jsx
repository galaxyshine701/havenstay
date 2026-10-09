import { Bath, Car, Coffee, Flame, Mountain, TreePine, Utensils, Wifi, Check } from 'lucide-react';

const ICONS = [
  ['wi-fi', Wifi],
  ['wifi', Wifi],
  ['breakfast', Coffee],
  ['parking', Car],
  ['fireplace', Flame],
  ['heating', Flame],
  ['view', Mountain],
  ['garden', TreePine],
  ['restaurant', Utensils],
  ['bath', Bath],
];

function pickIcon(label) {
  const text = label.toLowerCase();
  const match = ICONS.find(([keyword]) => text.includes(keyword));
  return match ? match[1] : Check;
}

export default function AmenityChip({ label }) {
  const Icon = pickIcon(label);
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-haven-50 px-3 py-1 text-xs font-medium text-ink-900">
      <Icon aria-hidden="true" className="h-4 w-4 text-haven-700" />
      {label}
    </span>
  );
}
