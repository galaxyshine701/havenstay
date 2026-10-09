import { useState } from 'react';
import SafeImage from './SafeImage';

// Large main photo + clickable thumbnails.
export default function Gallery({ images = [], name }) {
  const [active, setActive] = useState(0);
  const total = images.length;

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-2xl border border-haven-900/10 bg-haven-50">
        <SafeImage
          src={images[active]}
          alt={`${name}: photo ${active + 1} of ${Math.max(total, 1)}`}
          className="h-full w-full object-cover"
        />
      </div>

      {total > 1 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {images.map((src, index) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1} of ${total}`}
                aria-current={index === active ? 'true' : undefined}
                className={`h-16 w-24 overflow-hidden rounded-xl border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 ${
                  index === active ? 'border-gold-500' : 'border-transparent hover:border-haven-900/30'
                }`}
              >
                <SafeImage src={src} alt="" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
