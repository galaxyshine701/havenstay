import { useState } from 'react';

const FALLBACK_SRC = '/placeholder.svg';

// <img> that is lazy-loaded, always has alt text, and swaps to a local placeholder
// when the photo fails to load (CLAUDE.md section 6).
export default function SafeImage({ src, alt, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const useFallback = !src || failedSrc === src;

  return (
    <img
      src={useFallback ? FALLBACK_SRC : src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
