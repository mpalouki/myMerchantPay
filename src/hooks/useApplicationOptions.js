import { useEffect, useState } from 'react';
import { getApplicationOptions } from '../api/client.js';

// Services and payment methods for the application form (GET /api/merchant/applications/
// options). Fetched once per page load and shared, like useCountries.
let cache = null;

export function useApplicationOptions() {
  const [options, setOptions] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return undefined;
    let cancelled = false;
    getApplicationOptions()
      .then((data) => {
        cache = data;
        if (!cancelled) setOptions(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { options, error };
}
