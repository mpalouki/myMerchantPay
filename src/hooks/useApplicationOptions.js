import { useEffect, useState } from 'react';
import { getApplicationOptions } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

// Services and payment methods for the application form (GET /api/merchant/applications/
// options). Fetched once per page load and shared, like useCountries.
let cache = null;

export function useApplicationOptions() {
  const { token } = useAuth();
  const [options, setOptions] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return undefined;
    let cancelled = false;
    getApplicationOptions(token)
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
  }, [token]);

  return { options, error };
}
