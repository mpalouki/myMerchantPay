// The KYC part of a merchant application, shared by public registration (Register.jsx) and
// KYC validation inside the portal (KycValidation.jsx). The form steps are in
// components/KycFormSteps.jsx.

// Codes are what the API receives; labels come from register.legalForms / sectors / idTypes.
export const LEGAL_FORMS = ['SOLE_PROPRIETORSHIP', 'SARL', 'SARLU', 'SA', 'SAS', 'SASU', 'GIE', 'ASSOCIATION', 'NGO'];

export const SECTORS = [
  'RETAIL',
  'ECOMMERCE',
  'HOSPITALITY',
  'TRANSPORT',
  'EDUCATION',
  'HEALTH',
  'FINANCIAL_SERVICES',
  'TELECOM',
  'REAL_ESTATE',
  'OTHER',
];

export const ID_TYPES = ['CNI', 'PASSPORT', 'RESIDENCE_PERMIT'];

// Keys match the API's documents[<key>] parts (see myPay MerchantKycApplication).
export const DOCUMENTS = [
  { key: 'rccm', required: true },
  { key: 'taxCertificate', required: true },
  { key: 'idDocument', required: true },
  { key: 'proofOfAddress', required: true },
  { key: 'statutes', required: false },
];

export const ACCEPTED_FILES = '.pdf,.jpg,.jpeg,.png';
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const EMPTY_COMPANY = {
  name: '',
  tradeName: '',
  legalForm: '',
  rccm: '',
  taxId: '',
  sector: '',
  country: '',
  city: '',
  address: '',
  phone: '',
  website: '',
  creationDate: '',
};

export const EMPTY_REPRESENTATIVE = {
  lastName: '',
  firstName: '',
  birthDate: '',
  nationality: '',
  position: '',
  idType: '',
  idNumber: '',
  idExpiryDate: '',
  email: '',
  phone: '',
};

// Returns { key, document } for the first required document that is neither picked nor
// already on file (`stored`: document key => bool, from GET /api/merchant/kyc), or null.
export function validateDocuments(files, stored = {}) {
  const missing = DOCUMENTS.find((d) => d.required && !files[d.key] && !stored[d.key]);
  return missing ? { key: 'register.errors.missingDocument', document: missing.key } : null;
}

// Multipart body: a `data` JSON field plus one documents[<key>] part per picked file.
export function buildKycFormData(data, files) {
  const body = new FormData();
  body.append('data', JSON.stringify(data));
  Object.entries(files).forEach(([key, file]) => {
    if (file) body.append(`documents[${key}]`, file);
  });
  return body;
}
