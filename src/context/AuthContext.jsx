import React, { createContext, useContext, useMemo, useState } from 'react';
import { login as loginRequest, verifyLoginCode, getMerchantProfile } from '../api/client.js';
import { decodeJwt, isTokenExpired } from '../api/jwt.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'mmp_token';
const USER_KEY = 'mmp_user';

function readStoredSession() {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    return { token: null, user: null };
  }

  const saved = sessionStorage.getItem(USER_KEY);
  let user = null;
  try {
    user = saved ? JSON.parse(saved) : null;
  } catch {
    user = null;
  }

  return { token, user };
}

export function AuthProvider({ children }) {
  const initial = readStoredSession();
  const [token, setToken] = useState(initial.token);
  const [user, setUser] = useState(initial.user);

  // Stores a JWT as the session: decodes it for username/roles, then
  // GET /api/merchant/me (Bearer <token>) -> { email, merchant: {...} }.
  const signInWithToken = async (nextToken, fallbackEmail) => {
    const claims = decodeJwt(nextToken) || {};

    let profile = null;
    try {
      profile = await getMerchantProfile(nextToken);
    } catch {
      profile = null;
    }

    const nextUser = {
      email: profile?.email || claims.username || fallbackEmail,
      roles: claims.roles || [],
      merchant: profile?.merchant || null,
    };

    setToken(nextToken);
    setUser(nextUser);
    sessionStorage.setItem(TOKEN_KEY, nextToken);
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));

    return nextUser;
  };

  // Step 1, POST /api/login: a correct password emails a login code and resolves to the
  // challenge { otpRequired: true, challenge, email (masked), codeLength, expiresAt,
  // resendAvailableIn }; finish with verifyCode(). Should the API answer with a token
  // directly, the session starts right away and this resolves to { otpRequired: false, user }.
  const login = async (email, password) => {
    const result = await loginRequest(email, password);
    if (result?.token) return { otpRequired: false, user: await signInWithToken(result.token, email) };
    return result;
  };

  // Step 2, POST /api/login/otp: exchanges the challenge + emailed code for the JWT.
  const verifyCode = async (challenge, code, email) => {
    const { token: nextToken } = await verifyLoginCode(challenge, code);
    return signInWithToken(nextToken, email);
  };

  // Re-reads GET /api/merchant/me, e.g. after the KYC status changed. Pass `nextToken` when
  // the API issued a new one (the login email changed): it replaces the stored token.
  const refreshProfile = async (nextToken = token) => {
    if (!nextToken) return null;
    const profile = await getMerchantProfile(nextToken);
    const nextUser = { ...user, email: profile?.email || user?.email, merchant: profile?.merchant || null };
    if (nextToken !== token) {
      setToken(nextToken);
      sessionStorage.setItem(TOKEN_KEY, nextToken);
    }
    setUser(nextUser);
    sessionStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    return nextUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      merchant: user?.merchant ?? null,
      isAuthenticated: !!token,
      login,
      verifyCode,
      signInWithToken,
      logout,
      refreshProfile,
    }),
    // login/verifyCode/signInWithToken/logout/refreshProfile only read user and token.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
