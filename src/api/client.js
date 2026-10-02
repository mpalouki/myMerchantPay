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

// Account creation link sent from KYC review (CreateAccount.jsx, /create-account?token=…).
// Sent as form data. Response shape: { email, merchantName, expiresAt }. An invalid, expired
// or used link is 422 with { errors: { token } }.
export function checkInvitation(token) {
  const body = new FormData();
  body.append('token', token);
  return request('/api/merchant/invitation', { method: 'POST', body });
}

// Creates the portal login (the link's email) — then sign in with login(). Sent as form data.
// Response shape: { email } (201). Validation failures are 422 with
// { errors: { token?, password?, confirm_password? } }; a bad password doesn't consume the link.
export function acceptInvitation({ token, password, confirmPassword }) {
  const body = new FormData();
  body.append('token', token);
  body.append('password', password);
  body.append('confirm_password', confirmPassword);
  return request('/api/merchant/invitation/accept', { method: 'POST', body });
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

// --- Role management ("Gestion des rôles", pages/Roles.jsx). Bodies are JSON. A team is:
// { id, name, dateCreation, status (bool, true = active), habilitation: { id, name, accessType },
//   access: ['DASHBOARD', …] (permission references), balance: { id, accountNumberFormatted,
//   country: { codeAlpha2, name } }, activeMembers, members: [{ id, email,
//   status: 'invited' | 'active' | 'inactive', habilitation: { id, name, accessType } }] }.
// Validation failures are 422 with { errors: { <body field>: message } }.

// Choices for the team form. Response shape: { profiles: [{ id, name, accessType }],
//   permissions: [{ reference, label }] }
export function getTeamOptions(token) {
  return request('/api/merchant/teams/options', { token });
}

// Teams of one account (balance id), by name. Response shape: [team]
export function getTeams(token, balanceId) {
  return request(`/api/merchant/teams?balance=${encodeURIComponent(balanceId)}`, { token });
}

// { balance (id), name, habilitation (profile id), access: [reference], emails: [email] }
// Members are added as 'invited'. Response shape: team (201)
export function createTeam(token, team) {
  return request('/api/merchant/teams', { method: 'POST', body: team, token });
}

// { name, habilitation, access, emails, status (bool) }: replaces the member list by email (kept
// members keep their status, new ones are invited). Response shape: team
export function updateTeam(token, id, team) {
  return request(`/api/merchant/teams/${id}`, { method: 'PUT', body: team, token });
}

// 204, no body.
export function deleteTeam(token, id) {
  return request(`/api/merchant/teams/${id}`, { method: 'DELETE', token });
}

// Response shape: the updated team (201). 422 { errors: { email } } if invalid or already a member.
export function addTeamMember(token, teamId, email) {
  return request(`/api/merchant/teams/${teamId}/members`, { method: 'POST', body: { email }, token });
}

// Response shape: the updated team.
export function removeTeamMember(token, teamId, memberId) {
  return request(`/api/merchant/teams/${teamId}/members/${memberId}`, { method: 'DELETE', token });
}

// Sends an invited member a new invitation email (the previous link stops working).
// Response shape: the team. 409 if the member already accepted, 502 if the email failed.
export function resendTeamInvitation(token, teamId, memberId) {
  return request(`/api/merchant/teams/${teamId}/members/${memberId}/invitation`, { method: 'POST', token });
}

// Team invitation link (JoinTeam.jsx, /join-team?token=…). Sent as form data.
// Response shape: { email, merchantName, teamName, habilitation, needsPassword, expiresAt }.
// An invalid, expired or used link — or an email used by another merchant's login — is 422
// with { errors: { token } }.
export function checkTeamInvitation(token) {
  const body = new FormData();
  body.append('token', token);
  return request('/api/merchant/team-invitation', { method: 'POST', body });
}

// Activates the membership; with needsPassword, also creates the portal login (password and
// confirmPassword required). Response shape: { email, loginCreated }. Validation failures are
// 422 with { errors: { token?, password?, confirm_password? } }; a bad password keeps the link.
export function acceptTeamInvitation({ token, password, confirmPassword }) {
  const body = new FormData();
  body.append('token', token);
  if (password !== undefined) {
    body.append('password', password);
    body.append('confirm_password', confirmPassword);
  }
  return request('/api/merchant/team-invitation/accept', { method: 'POST', body });
}

// Countries the platform operates in. Also used by the public registration form.
// Response shape: [{ id, name, codeAlpha2, callingCode, currency }]
export function getCountries(token) {
  return request('/api/merchant/countries', { method: 'GET', token });
}
