import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as loginRequest,
  logout as logoutRequest,
  verifyLoginCode,
  getMerchantProfile,
  setUnauthorizedHandler,
} from '../api/client.js';

const AuthContext = createContext(null);

// Not a credential: the session is the API's HttpOnly cookie, which this code can't read. This
// flag only says a session may exist, so that public pages don't call /me for every visitor.
const SIGNED_IN_KEY = 'mmp_signed_in';

function readSignedInFlag() {
  try {
    return localStorage.getItem(SIGNED_IN_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSignedInFlag(signedIn) {
  try {
    if (signedIn) localStorage.setItem(SIGNED_IN_KEY, '1');
    else localStorage.removeItem(SIGNED_IN_KEY);
  } catch {
    // Storage unavailable (private mode): the session is just re-checked less often.
  }
}

function toUser(profile) {
  return { email: profile?.email ?? null, merchant: profile?.merchant ?? null };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True while checking, on load, whether the session cookie still signs us in.
  const [restoring, setRestoring] = useState(readSignedInFlag);

  const clearSession = () => {
    setUser(null);
    writeSignedInFlag(false);
  };

  // An authenticated request answering 401: the session expired or was revoked.
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    if (!restoring) return;
    getMerchantProfile()
      .then((profile) => setUser(toUser(profile)))
      .catch(() => clearSession())
      .finally(() => setRestoring(false));
    // Only on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the API has set the session cookie (login code, account creation link, team
  // invitation), loads the profile: GET /api/merchant/me -> { email, merchant: {...} }.
  const startSession = async () => {
    const nextUser = toUser(await getMerchantProfile());
    setUser(nextUser);
    writeSignedInFlag(true);
    return nextUser;
  };

  // Step 1, POST /api/login: a correct password emails a login code and resolves to the
  // challenge { otpRequired: true, challenge, email (masked), codeLength, expiresAt,
  // resendAvailableIn }; finish with verifyCode().
  const login = (email, password) => loginRequest(email, password);

  // Step 2, POST /api/login/otp: the API answers the right code with the session cookie.
  const verifyCode = async (challenge, code) => {
    await verifyLoginCode(challenge, code);
    return startSession();
  };

  // Re-reads GET /api/merchant/me, e.g. after the KYC status or the login email changed.
  const refreshProfile = async () => {
    const nextUser = toUser(await getMerchantProfile());
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    clearSession();
    try {
      await logoutRequest();
    } catch {
      // Already signed out server-side, or offline: the cookie expires with the token anyway.
    }
  };

  const value = useMemo(
    () => ({
      user,
      merchant: user?.merchant ?? null,
      isAuthenticated: !!user,
      restoring,
      login,
      verifyCode,
      startSession,
      logout,
      refreshProfile,
    }),
    // The functions only read state through setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, restoring],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
