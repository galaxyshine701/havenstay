import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | HavenStay` : 'HavenStay | Boutique stays in northern Pakistan';
  }, [title]);
}
