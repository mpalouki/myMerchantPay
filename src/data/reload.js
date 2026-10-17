// Reference data for "Recharger mon compte" (pages/Reload.jsx). The wallets themselves come
// from the API (getReloadWallets), per account country.

// Digits in a national mobile number (without the dial code), per country (ISO alpha-2).
// Countries not listed accept 8 to 10 digits.
export const NATIONAL_NUMBER_DIGITS = { BF: 8, BJ: 10, CI: 10, CM: 9, ML: 8, SN: 9, TG: 8, UG: 9 };

// Bank tab, step 2: the zone the merchant's transfer was sent from.
export const TRANSFER_ZONES = ['UEMOA', 'CEMAC', 'International'];

// Same-day processing for transfers received before this hour (GMT).
export const BANK_CUTOFF_HOUR_GMT = 14;

export const MIN_RELOAD_AMOUNT = 100;

// National number only: spaces, dots and dashes are ignored; the dial code is shown apart.
export function normalizePhone(value) {
  return value.replace(/[\s.-]/g, '');
}

export function isValidPhone(countryCode, value) {
  const digits = NATIONAL_NUMBER_DIGITS[countryCode];
  return new RegExp(digits ? `^\\d{${digits}}$` : '^\\d{8,10}$').test(normalizePhone(value));
}

// Placeholder for the phone field: as many zeros as the country's numbers have digits.
export function phonePlaceholder(countryCode) {
  return '0'.repeat(NATIONAL_NUMBER_DIGITS[countryCode] ?? 8);
}

// "1000" -> "1 000"; amounts are whole FCFA.
export function formatAmount(amount) {
  return new Intl.NumberFormat('fr-FR').format(Number(amount)).replace(/[\u00a0\u202f]/g, ' ');
}

// XOF / XAF are shown as FCFA, the name merchants use.
export function currencyLabel(currency) {
  return !currency || currency === 'XOF' || currency === 'XAF' ? 'FCFA' : currency;
}

// ISO date-time -> "17/10/2026 14:32" (local time); ISO date -> "17/10/2026".
export function formatDateTime(iso) {
  return iso ? new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }) : '';
}

export function formatDate(isoDate) {
  return isoDate ? new Date(`${isoDate}T00:00:00`).toLocaleDateString('fr-FR') : '';
}

// Status of a top-up (myPay PaymentStatus): label and badge tone.
export const RELOAD_STATUSES = {
  pending: { label: 'En attente', tone: 'warning' },
  success: { label: 'Validé', tone: 'success' },
  failed: { label: 'Échoué', tone: 'danger' },
  cancelled: { label: 'Annulé', tone: 'danger' },
};
