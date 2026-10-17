// Reference data for "Recharger mon compte" (pages/Recharge.jsx). The wallets themselves come
// from the API (getRechargeWallets), per account country.

// Digits in a national mobile number (without the dial code), per country (ISO alpha-2).
// Countries not listed accept 8 to 10 digits.
export const NATIONAL_NUMBER_DIGITS = { BF: 8, BJ: 10, CI: 10, CM: 9, ML: 8, SN: 9, TG: 8, UG: 9 };

// Bank tab, step 2: the zone the merchant's transfer was sent from.
export const TRANSFER_ZONES = ['UEMOA', 'CEMAC', 'International'];

// Same-day processing for transfers received before this hour (GMT).
export const BANK_CUTOFF_HOUR_GMT = 14;

export const MIN_RECHARGE_AMOUNT = 100;

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
