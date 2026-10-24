// Helpers for "Transférer entre mes comptes" (pages/Transfer.jsx, components/TransferHistory.jsx).

import { currencyLabel } from './reload.js';

// Decimals of a currency's amounts (ISO 4217): none for the CFA francs and the Guinean franc.
const WHOLE_CURRENCIES = ['XOF', 'XAF', 'GNF'];

export function currencyDecimals(currency) {
  return WHOLE_CURRENCIES.includes(currency) ? 0 : 2;
}

// '3047.31', 'GHS' -> '3 047,31 GHS'; '150000.00', 'XOF' -> '150 000 FCFA'.
export function formatMoney(amount, currency) {
  const decimals = currencyDecimals(currency);
  const formatted = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    .format(Number(amount))
    .replace(/[\u00a0\u202f]/g, '\u00a0');
  return `${formatted}\u00a0${currencyLabel(currency)}`;
}

// '0.02031540' -> '0,0203154': the rate without its trailing zeros.
export function formatRate(rate) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 8 }).format(Number(rate));
}

// What the merchant typed ('150 000', '3047,5') as the API's decimal string ('150000', '3047.5'),
// or null when it isn't an amount.
export function normalizeAmount(value) {
  const compact = value.replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
  return /^\d{1,12}(\.\d{1,2})?$/.test(compact) ? compact : null;
}

// Why an amount can't be sent from that account, before asking the API (null when it can).
export function amountProblem(amount, account) {
  if (amount === null) return 'Entrez un montant, par exemple 150000.';
  if (currencyDecimals(account.currency) === 0 && amount.includes('.') && Number(amount.split('.')[1]) !== 0) {
    return `Les montants en ${currencyLabel(account.currency)} n'ont pas de décimales.`;
  }
  if (Number(amount) <= 0) return 'Le montant doit être supérieur à 0.';
  if (Number(amount) > Number(account.accountBalance)) return 'Solde insuffisant sur le compte débité.';
  return null;
}

// One per transfer, kept when a request is retried, so the API never moves the money twice.
export function newIdempotencyKey() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');
}

// French messages for the API's error codes (422 { code } and 409 { code }).
export const TRANSFER_ERRORS = {
  unknown_account: 'Ce compte est introuvable.',
  account_blocked: 'Ce compte est bloqué : aucun transfert possible.',
  same_account: 'Choisissez un autre compte que celui qui est débité.',
  rate_unavailable: 'Les transferts vers cette devise ne sont pas disponibles pour le moment.',
  invalid_amount: 'Montant invalide pour la devise de ce compte.',
  amount_too_small: 'Le montant est trop faible pour être transféré.',
  amount_too_large: 'Le montant dépasse le maximum autorisé (100 000 000).',
  insufficient_balance: 'Solde insuffisant sur le compte débité.',
  merchant_blocked: 'Votre compte marchand est bloqué : les transferts sont désactivés.',
  quote_expired: 'Le taux a expiré. Vérifiez le nouveau montant reçu puis confirmez.',
  quote_used: 'Le taux a expiré. Vérifiez le nouveau montant reçu puis confirmez.',
  idempotency_key_reused: 'Ce transfert a déjà été envoyé. Consultez l’historique.',
  conflict: 'Ce transfert a déjà été envoyé. Consultez l’historique.',
};

export function transferErrorMessage(err) {
  return TRANSFER_ERRORS[err?.data?.code] ?? err?.message ?? 'Une erreur est survenue. Veuillez réessayer.';
}
