// Empty by default: requests go to the same origin (/api/...), which the Vite dev server
// proxies to myPay (see vite.config.js). Set VITE_API_BASE_URL to call an API elsewhere.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

// Response shape: { email, merchant: { id, name, email, sector, country, countryCode, status,
//   kycStatus ('not_submitted' | 'pending' | 'approved' | 'rejected'), underSurveillance, createdAt } }
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

// Settings → personal information.
// Response shape: { tradeName (nullable), legalName, legalNameEditable (false once the KYC is
//   pending/approved), email (login email), phone (nullable), countryCode, callingCode }
export function getPersonalInfo(token) {
  return request('/api/merchant/personal-info', { method: 'GET', token });
}

// Sent as form data; only the fields given are changed, `currentPassword` is always required.
// Response shape: same as getPersonalInfo, plus `token` when the email changed — the old token
// no longer authenticates, so pass it to refreshProfile(). Validation failures are 422 with
// { errors: { trade_name?, legal_name?, email?, phone?, current_password? } }.
export function updatePersonalInfo(token, { tradeName, legalName, email, phone, currentPassword }) {
  const body = new FormData();
  const fields = { trade_name: tradeName, legal_name: legalName, email, phone };
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) body.append(key, value);
  });
  body.append('current_password', currentPassword);
  return request('/api/merchant/personal-info', { method: 'POST', body, token });
}

// Public "information and contact" form (Register.jsx). Creates the merchant and starts its KYC
// as a draft with the representative's contact details — no documents, no login: the merchant
// completes the KYC from the portal (submitKyc) once MyPay has created their login.
// Sent as multipart/form-data with a `data` field: JSON string { company: { name, tradeName,
//   legalForm, sector, creationDate, country, address, website }, representative: { lastName,
//   firstName, nationality, position, phone, email }, acceptedTerms }. Other keys are ignored.
// Response shape: { merchantId, status, kycStatus: 'not_submitted' }. 409 when a merchant already
// uses representative.email.
export function registerMerchant(formData) {
  return request('/api/merchant/register', { method: 'POST', body: formData });
}

// KYC application of the logged-in merchant, to pre-fill the KYC validation form.
// Response shape: { status ('not_submitted' | 'pending' | 'approved' | 'rejected'), canSubmit,
//   rejectionReason, submittedAt, company: {...same keys as registration},
//   representative: {...same keys as registration} | null,
//   documents: { rccm, taxCertificate, idDocument, proofOfAddress, statutes } (bool: file on record) }
export function getKyc(token) {
  return request('/api/merchant/kyc', { method: 'GET', token });
}

// KYC validation from inside the portal: same multipart body as registerMerchant, minus
// `account` (data: { company, representative, acceptedTerms }). Documents already on
// record may be omitted. Only allowed while canSubmit; 409 otherwise.
// Response shape: { kycStatus: 'pending' }
export function submitKyc(token, formData) {
  return request('/api/merchant/kyc', { method: 'POST', body: formData, token });
}

// The merchant's accounts, one per country, ordered by country name.
// Response shape: [{ id, accountNumber, accountNumberFormatted, accountBalance, currency,
//   status (bool, false = blocked), dateCreation, country: { id, name, codeAlpha2 },
//   last7Days: { credits, debits } }] — amounts are decimal strings.
export function getBalances(token) {
  return request('/api/merchant/balances', { method: 'GET', token });
}

// Countries the platform operates in. Also used by the public registration form.
// Response shape: [{ id, name, codeAlpha2, callingCode, currency }]
export function getCountries(token) {
  return request('/api/merchant/countries', { method: 'GET', token });
}
