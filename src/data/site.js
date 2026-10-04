// Facts shown on the public showcase pages (contact, legal notice, pricing, API docs) that only
// the business can confirm. Everything marked TODO is a placeholder: replace it before the site
// goes public. A null field is hidden on the contact page and shown as "to be completed" on the
// legal pages, so missing legal information stays visible.

export const COMPANY = {
  brand: 'MyMerchantPay',
  legalName: null, // TODO: raison sociale of the operating company
  legalForm: null, // TODO: e.g. "SARL au capital de … FCFA"
  registration: null, // TODO: RCCM number
  taxId: null, // TODO: NIF
  address: null, // TODO: registered office address
  director: null, // TODO: publication director (directeur de la publication)
  host: null, // TODO: hosting provider name and address
};

export const CONTACT = {
  email: 'contact@mymerchantpay.com', // TODO: confirm
  supportEmail: 'support@mymerchantpay.com', // TODO: confirm
  privacyEmail: 'privacy@mymerchantpay.com', // TODO: confirm (data protection requests)
  securityEmail: 'security@mymerchantpay.com', // TODO: confirm (vulnerability reports)
  phone: null, // TODO: e.g. '+228 …' — hidden while null
  whatsapp: null, // TODO: hidden while null
  address: null, // TODO: office address — hidden while null
  hours: { fr: 'Du lundi au vendredi, 8 h – 18 h (GMT)', en: 'Monday to Friday, 8 am – 6 pm (GMT)' }, // TODO: confirm
};

// TODO: indicative rates — confirm every figure before publishing. Each row is a percentage
// per transaction (`rate`), a fixed amount in FCFA (`fixed`), or free (neither).
export const PRICING = [
  { key: 'account' },
  { key: 'mobileMoney', rate: 1.5 },
  { key: 'cards', rate: 2.9 },
  { key: 'payouts', rate: 1 },
  { key: 'paymentLinks', rate: 1.5 },
  { key: 'withdrawals', fixed: 500 },
];

// Illustrative merchant API (the payment API isn't public yet): base URLs used in the docs.
export const API_BASE_URL = {
  sandbox: 'https://sandbox.api.mymerchantpay.com/v1', // TODO: confirm
  live: 'https://api.mymerchantpay.com/v1', // TODO: confirm
};

export const OPERATORS = ['Orange Money', 'MTN MoMo', 'Moov Money', 'Wave', 'T-Money', 'Free Money', 'Visa', 'Mastercard'];
