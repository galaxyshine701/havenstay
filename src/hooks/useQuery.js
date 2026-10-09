import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Tiny data-fetching hook used by the other hooks.
 *
 * - key: a string that identifies the request. When it changes, the data is fetched again.
 * - queryFn: an async function that returns the data (or throws).
 *
 * Returns { status: 'loading' | 'success' | 'error', data, error, reload }.
 * Every page that fetches data uses these states to show skeleton / error / content.
 */
export function useQuery(key, queryFn) {
  const queryFnRef = useRef(queryFn);
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const [attempt, setAttempt] = useState(0);

  // Always call the latest queryFn without making it a dependency of the fetch effect.
  useEffect(() => {
    queryFnRef.current = queryFn;
  });

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null, error: null });

    Promise.resolve()
      .then(() => queryFnRef.current())
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (active) setState({ status: 'error', data: null, error });
      });

    // Ignore results that arrive after the key changed or the page was left.
    return () => {
      active = false;
    };
  }, [key, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, reload };
}
