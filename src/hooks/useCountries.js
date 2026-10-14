import { useEffect, useState } from 'react';
import { getCountries } from '../api/client.js';

// The list rarely changes, so it is fetched once and shared by every caller.
let cache = null;

export function useCountries() {
  const [countries, setCountries] = useState(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    getCountries()
      .then((data) => {
        cache = Array.isArray(data) ? data : [];
        if (!cancelled) setCountries(cache);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, loading, error };
}
