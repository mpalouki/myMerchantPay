import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getBalances } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const AccountContext = createContext(null);

// Per merchant, so switching logins in the same tab doesn't carry a stale choice over.
const storageKey = (merchantId) => `mmp_country_${merchantId ?? 'unknown'}`;

function readStoredCountry(merchantId) {
  try {
    return sessionStorage.getItem(storageKey(merchantId));
  } catch {
    return null;
  }
}

// The merchant's home country code. Sessions started before /me returned `countryCode`
// only have the country name, so fall back to matching on that.
function homeCountryCode(merchant, balances) {
  if (merchant?.countryCode) return merchant.countryCode;
  return balances.find((b) => b.country.name === merchant?.country)?.country.codeAlpha2 ?? null;
}

// Loads the merchant's accounts (one per country) once for the whole logged-in area and
// tracks which country is selected. Mounted in DashboardLayout, so the selection is shared
// by the sidebar and every page, and survives navigation and page reloads.
export function AccountProvider({ children }) {
  const { token, merchant } = useAuth();
  const merchantId = merchant?.id;
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCode, setSelectedCode] = useState(() => readStoredCountry(merchantId));

  const load = useCallback(() => {
    let cancelled = false;
    getBalances(token)
      .then((data) => {
        if (!cancelled) {
          setBalances(Array.isArray(data) ? data : []);
          setError(null);
        }
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
  }, [token]);

  useEffect(() => load(), [load]);

  const selectCountry = useCallback(
    (code) => {
      setSelectedCode(code);
      try {
        sessionStorage.setItem(storageKey(merchantId), code);
      } catch {
        // Storage unavailable (private mode): the selection just won't survive a reload.
      }
    },
    [merchantId],
  );

  // Stored choice if the merchant still has that account, else the home country, else the first account.
  const selectedBalance = useMemo(() => {
    const byCode = (code) => (code ? balances.find((b) => b.country.codeAlpha2 === code) : undefined);
    return byCode(selectedCode) ?? byCode(homeCountryCode(merchant, balances)) ?? balances[0] ?? null;
  }, [balances, selectedCode, merchant]);

  const value = useMemo(
    () => ({ balances, loading, error, selectedBalance, selectCountry, reload: load }),
    [balances, loading, error, selectedBalance, selectCountry, load],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
