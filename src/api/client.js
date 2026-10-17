// Empty by default: requests go to the same origin (/api/...), which the Vite dev server
// proxies to myPay (see vite.config.js). Set VITE_API_BASE_URL to call an API elsewhere.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// The session is the API's HttpOnly `mmp_session` cookie, set by the login responses: this code
// never sees the token. `credentials: 'include'` makes the browser send it to the API's domain.
// Called when an authenticated request answers 401 (session expired or revoked); AuthContext
// uses it to sign the user out.
let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

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

// `auth: true` for endpoints that need the session: a 401 there means it has ended.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { Accept: 'application/json' };
  // FormData bodies (file uploads) set their own multipart boundary header.
  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Impossible de joindre le serveur. Vérifiez votre connexion.', 0, null);
  }

  const data = await parseBody(response);

  if (!response.ok) {
    if (auth && response.status === 401) onUnauthorized?.();
    const message = data?.message || data?.error || 'Une erreur est survenue.';
    throw new ApiError(message, response.status, data);
  }

  return data;
}

// Step 1 of the login: checks the password and emails a login code. Response shape (202):
// { otpRequired: true, challenge, email (masked), codeLength, expiresAt, resendAvailableIn (s) }.
// Wrong credentials are 401 { code, message }; 503 { error } if the email couldn't be sent.
export function login(email, password) {
  return request('/api/login', { method: 'POST', body: { email, password } });
}

// Step 2: exchanges the challenge and the emailed code for the session. Response shape:
// { email } plus the HttpOnly session cookie (never readable here); then call getMerchantProfile().
// 422 with { errors: { code }, remainingAttempts } for a wrong code, or { errors: { challenge } }
// when the challenge is expired, used or out of attempts (sign in again).
export function verifyLoginCode(challenge, code) {
  return request('/api/login/otp', { method: 'POST', body: { challenge, code } });
}

// Emails a new code for the challenge (the previous one stops working). Response shape (202):
// { expiresAt, resendAvailableIn (s, null when no resend is left) }. 429 { error,
// resendAvailableIn } if too early; 422 { errors: { challenge } } when it can't be resent.
export function resendLoginCode(challenge) {
  return request('/api/login/otp/resend', { method: 'POST', body: { challenge } });
}

// Ends the session: the API revokes the token and deletes the cookie. 204, no body.
export function logout() {
  return request('/api/logout', { method: 'POST' });
}

// Response shape: { email, merchant: { id, name, email, sector, country, countryCode, status,
//   kycStatus ('not_submitted' | 'pending' | 'approved' | 'rejected'), underSurveillance, createdAt } }
export function getMerchantProfile() {
  return request('/api/merchant/me', { method: 'GET', auth: true });
}

// Sent as form data (the endpoint reads $request->request, not a JSON body).
// Response shape: { message }. Validation failures are 422 with
// { errors: { current_password?, new_password?, confirm_password? } }.
export function updatePassword({ currentPassword, newPassword, confirmPassword }) {
  const body = new FormData();
  body.append('current_password', currentPassword);
  body.append('new_password', newPassword);
  body.append('confirm_password', confirmPassword);
  return request('/api/merchant/update-password', { method: 'POST', body, auth: true });
}

// Settings → personal information.
// Response shape: { tradeName (nullable), legalName, legalNameEditable (false once the KYC is
//   pending/approved), email (login email), phone (nullable), countryCode, callingCode }
export function getPersonalInfo() {
  return request('/api/merchant/personal-info', { method: 'GET', auth: true });
}

// Sent as form data; only the fields given are changed, `currentPassword` is always required.
// Response shape: same as getPersonalInfo. When the email changed, the response also renews the
// session cookie (the previous one no longer authenticates). Validation failures are 422 with
// { errors: { trade_name?, legal_name?, email?, phone?, current_password? } }.
export function updatePersonalInfo({ tradeName, legalName, email, phone, currentPassword }) {
  const body = new FormData();
  const fields = { trade_name: tradeName, legal_name: legalName, email, phone };
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined) body.append(key, value);
  });
  body.append('current_password', currentPassword);
  return request('/api/merchant/personal-info', { method: 'POST', body, auth: true });
}

// Account creation link sent from KYC review (CreateAccount.jsx, /create-account?token=…).
// Sent as form data. Response shape: { email, merchantName, expiresAt }. An invalid, expired
// or used link is 422 with { errors: { token } }.
export function checkInvitation(token) {
  const body = new FormData();
  body.append('token', token);
  return request('/api/merchant/invitation', { method: 'POST', body });
}

// Creates the portal login (the link's email). Sent as form data. Response shape (201):
// { email }, and signs the new login in (session cookie; no login code: the link proved the email).
// Validation failures are 422 with
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
export function getKyc() {
  return request('/api/merchant/kyc', { method: 'GET', auth: true });
}

// KYC validation from inside the portal: same multipart body as registerMerchant, minus
// `account` (data: { company, representative, acceptedTerms }). Documents already on
// record may be omitted. Only allowed while canSubmit; 409 otherwise.
// Response shape: { kycStatus: 'pending' }
export function submitKyc(formData) {
  return request('/api/merchant/kyc', { method: 'POST', body: formData, auth: true });
}

// The merchant's accounts, one per country, ordered by country name.
// Response shape: [{ id, accountNumber, accountNumberFormatted, accountBalance, currency,
//   status (bool, false = blocked), dateCreation, country: { id, name, codeAlpha2 },
//   last7Days: { credits, debits } }] — amounts are decimal strings.
export function getBalances() {
  return request('/api/merchant/balances', { method: 'GET', auth: true });
}

// --- Role management ("Gestion des rôles", pages/Roles.jsx). Bodies are JSON. A team is:
// { id, name, dateCreation, status (bool, true = active), habilitation: { id, name, accessType },
//   access: ['DASHBOARD', …] (permission references), balance: { id, accountNumberFormatted,
//   country: { codeAlpha2, name } }, activeMembers, members: [{ id, email,
//   status: 'invited' | 'active' | 'inactive', habilitation: { id, name, accessType } }] }.
// Validation failures are 422 with { errors: { <body field>: message } }.

// Choices for the team form. Response shape: { profiles: [{ id, name, accessType }],
//   permissions: [{ reference, label }] }
export function getTeamOptions() {
  return request('/api/merchant/teams/options', { auth: true });
}

// Teams of one account (balance id), by name. Response shape: [team]
export function getTeams(balanceId) {
  return request(`/api/merchant/teams?balance=${encodeURIComponent(balanceId)}`, { auth: true });
}

// { balance (id), name, habilitation (profile id), access: [reference], emails: [email] }
// Members are added as 'invited'. Response shape: team (201)
export function createTeam(team) {
  return request('/api/merchant/teams', { method: 'POST', body: team, auth: true });
}

// { name, habilitation, access, emails, status (bool) }: replaces the member list by email (kept
// members keep their status, new ones are invited). Response shape: team
export function updateTeam(id, team) {
  return request(`/api/merchant/teams/${id}`, { method: 'PUT', body: team, auth: true });
}

// 204, no body.
export function deleteTeam(id) {
  return request(`/api/merchant/teams/${id}`, { method: 'DELETE', auth: true });
}

// Response shape: the updated team (201). 422 { errors: { email } } if invalid or already a member.
export function addTeamMember(teamId, email) {
  return request(`/api/merchant/teams/${teamId}/members`, { method: 'POST', body: { email }, auth: true });
}

// Response shape: the updated team.
export function removeTeamMember(teamId, memberId) {
  return request(`/api/merchant/teams/${teamId}/members/${memberId}`, { method: 'DELETE', auth: true });
}

// Sends an invited member a new invitation email (the previous link stops working).
// Response shape: the team. 409 if the member already accepted, 502 if the email failed.
export function resendTeamInvitation(teamId, memberId) {
  return request(`/api/merchant/teams/${teamId}/members/${memberId}/invitation`, { method: 'POST', auth: true });
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
// confirmPassword required). Response shape: { email, loginCreated }; when loginCreated, the new
// login is also signed in (session cookie; no login code: the link proved the email).
// Validation failures are 422 with { errors: { token?, password?, confirm_password? } }; a bad password keeps the link.
export function acceptTeamInvitation({ token, password, confirmPassword }) {
  const body = new FormData();
  body.append('token', token);
  if (password !== undefined) {
    body.append('password', password);
    body.append('confirm_password', confirmPassword);
  }
  return request('/api/merchant/team-invitation/accept', { method: 'POST', body });
}

// --- API applications ("Intégrez notre API"). Bodies are JSON. An application is:
// { id, createdAt, name, description, productionMode, balance: { id, accountNumberFormatted,
//   country: { codeAlpha2, name } } } in lists, plus, when read one by one: website (or null),
// services: ['PAYIN' | 'PAYOUT'], invoiceEnabled, cashOnDeliveryEnabled (PAL),
// disbursementEnabled (PER), paymentMethods: [paymentMethod], ipn: { endpoint, enabled },
// keys: { master, test: { public, private, token }, live: { public, private, token } },
// keysGeneratedAt. A paymentMethod is { id, name, country: { codeAlpha2, name } | null }
// (null = every country). Validation failures are 422 with { errors: { <body field>: message } }
// (`ipn.endpoint` for the IPN).

// Response shape: { services: ['PAYIN', 'PAYOUT'], paymentMethods: [paymentMethod] }
export function getApplicationOptions() {
  return request('/api/merchant/applications/options', { auth: true });
}

// Applications of one account (balance id), newest first. Response shape: [application]
export function getApplications(balanceId) {
  return request(`/api/merchant/applications?balance=${encodeURIComponent(balanceId)}`, { auth: true });
}

// Response shape: application, with its keys.
export function getApplication(id) {
  return request(`/api/merchant/applications/${id}`, { auth: true });
}

// { balance (id), name, description, website, services, productionMode, invoiceEnabled,
//   paymentMethods: [id], ipn: { endpoint, enabled } } — generates the keys.
// Response shape: application (201)
export function createApplication(application) {
  return request('/api/merchant/applications', { method: 'POST', body: application, auth: true });
}

// Same body without `balance`; keys are kept. Response shape: application
export function updateApplication(id, application) {
  return request(`/api/merchant/applications/${id}`, { method: 'PUT', body: application, auth: true });
}

// 204, no body. The application's keys stop working.
export function deleteApplication(id) {
  return request(`/api/merchant/applications/${id}`, { method: 'DELETE', auth: true });
}

// --- "Recharger mon compte" (pages/Recharge.jsx).

// Mobile money wallets an account (balance id) can be topped up from: the active payment types
// of its country, by name. Response shape: [{ id, name, country: { codeAlpha2, name,
//   callingCode } }] — possibly empty.
export function getRechargeWallets(balanceId) {
  return request(`/api/merchant/recharge/wallets?balance=${encodeURIComponent(balanceId)}`, { auth: true });
}

// MyPay's bank accounts that an account (balance id) is topped up by transfer to: those of its
// country, by bank name. Response shape: [{ id, bankName, accountName, accountNumber,
//   country: { codeAlpha2, name } }] — possibly empty.
export function getRechargeBankAccounts(balanceId) {
  return request(`/api/merchant/recharge/bank-accounts?balance=${encodeURIComponent(balanceId)}`, { auth: true });
}

// Records a top-up, as pending, for the payer to validate (mobile money) or once the transfer
// arrives (bank). Body: { method: 'mobile_money', balance, paymentType, phone (national number),
//   amount } or { method: 'bank_transfer', balance, bankAccount, zone, rib, amount,
//   transferDate (YYYY-MM-DD), label? }. Response shape (201): { paymentId, type: 'reload',
//   method, status: 'pending', amount, currency, phoneNumber, paymentType: { id, name },
//   balance: { id, accountNumber }, dateCreation }. 422 { errors: { <body field>: message } }.
export function submitRecharge(recharge) {
  return request('/api/merchant/recharge', { method: 'POST', body: recharge, auth: true });
}

// Countries the platform operates in. Also used by the public registration form.
// Response shape: [{ id, name, codeAlpha2, callingCode, currency }]
export function getCountries() {
  return request('/api/merchant/countries', { method: 'GET' });
}
