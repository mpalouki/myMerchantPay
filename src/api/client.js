const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function parseBody(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { Accept: 'application/json' };
  // FormData bodies (file uploads) set their own multipart boundary header.
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Impossible de joindre le serveur. Vérifiez votre connexion.', 0, null);
  }

  const data = await parseBody(response);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Une erreur est survenue.';
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// Response shape: { token: '<JWT>' } — no user/merchant payload, see jwt.js to
// read the identity claims embedded in the token itself.
export function login(email, password) {
  return request('/api/login', { method: 'POST', body: { email, password } });
}

// Response shape: { email, merchant: { id, name, email, sector, country, status, underSurveillance, createdAt } }
export function getMerchantProfile(token) {
  return request('/api/merchant/me', { method: 'GET', token });
}

// Sent as form data (the endpoint reads $request->request, not a JSON body).
// Response shape: { message }. Validation failures are 422 with
// { errors: { current_password?, new_password?, confirm_password? } }.
export function updatePassword(token, { currentPassword, newPassword, confirmPassword }) {
  const body = new FormData();
  body.append('current_password', currentPassword);
  body.append('new_password', newPassword);
  body.append('confirm_password', confirmPassword);
  return request('/api/merchant/update-password', { method: 'POST', body, token });
}

// Merchant self-registration with KYC data, reviewed by the back office before
// the account is activated. Sent as multipart/form-data:
//   - `data`: JSON string { company: {...}, representative: {...}, account: { email, password }, acceptedTerms }
//   - `documents[<type>]`: one file per KYC document (see Register.jsx DOCUMENTS)
// Response shape: { id, status: 'PENDING_REVIEW' }
export function registerMerchant(formData) {
  return request('/api/merchant/register', { method: 'POST', body: formData });
}

// Countries the platform operates in. Also used by the public registration form.
// Response shape: [{ id, name, codeAlpha2, callingCode, currency }]
export function getCountries(token) {
  return request('/api/merchant/countries', { method: 'GET', token });
}
