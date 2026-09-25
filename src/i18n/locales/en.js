export default {
  common: {
    select: 'Select',
    optional: '(optional)',
    previous: 'Previous',
    next: 'Next',
    language: 'Language',
  },

  login: {
    title: 'Welcome back!',
    email: 'Email address',
    password: 'Password',
    missingCredentials: 'Please enter your credentials.',
    serverError: 'Unable to reach the server. Please try again.',
    submitting: 'Signing in…',
    submit: 'Sign in',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account? Create a merchant account",
  },

  register: {
    title: 'Create my merchant account',
    steps: {
      company: 'Company',
      representative: 'Legal representative',
      documents: 'Documents',
      account: 'Account',
    },

    company: {
      name: 'Company name',
      tradeName: 'Trade name',
      legalForm: 'Legal form',
      sector: 'Business sector',
      rccm: 'RCCM number',
      taxId: 'Tax ID (NIF / IFU)',
      creationDate: 'Date of incorporation',
      country: 'Country',
      city: 'City',
      phone: 'Phone',
      address: 'Head office address',
      website: 'Website',
    },

    legalForms: {
      SOLE_PROPRIETORSHIP: 'Sole proprietorship',
      SARL: 'SARL (LLC)',
      SARLU: 'SARLU (single-member LLC)',
      SA: 'SA (public limited company)',
      SAS: 'SAS (simplified joint-stock company)',
      SASU: 'SASU (single-member SAS)',
      GIE: 'GIE (economic interest group)',
      ASSOCIATION: 'Association',
      NGO: 'NGO',
    },

    sectors: {
      RETAIL: 'Retail',
      ECOMMERCE: 'E-commerce',
      HOSPITALITY: 'Food service / Hospitality',
      TRANSPORT: 'Transport / Logistics',
      EDUCATION: 'Education',
      HEALTH: 'Healthcare',
      FINANCIAL_SERVICES: 'Financial services',
      TELECOM: 'Telecommunications',
      REAL_ESTATE: 'Real estate',
      OTHER: 'Other',
    },

    representative: {
      lastName: 'Last name',
      firstName: 'First name(s)',
      birthDate: 'Date of birth',
      nationality: 'Nationality',
      position: 'Position in the company',
      positionPlaceholder: 'E.g. Manager, Managing Director...',
      idType: 'ID document type',
      idNumber: 'ID document number',
      idExpiryDate: 'Expiry date',
      phone: 'Phone',
      email: 'Email address',
    },

    idTypes: {
      CNI: 'National ID card',
      PASSPORT: 'Passport',
      RESIDENCE_PERMIT: 'Residence permit',
    },

    documents: {
      hint: 'Accepted formats: PDF, JPG, PNG — 5 MB max per file.',
      rccm: 'RCCM extract / Trade register',
      taxCertificate: 'NIF / IFU tax certificate',
      idDocument: "Legal representative's ID document",
      proofOfAddress: 'Proof of address (less than 3 months old)',
      statutes: 'Articles of association',
    },

    account: {
      email: 'Login email address',
      password: 'Password',
      passwordConfirm: 'Confirm password',
      terms: 'I certify that the information provided is accurate and I accept the terms of use.',
    },

    errors: {
      missingDocument: 'Please attach: {{document}}.',
      fileTooLarge: 'Each file must be 5 MB or less.',
      passwordTooShort: 'The password must be at least 8 characters long.',
      passwordMismatch: 'The passwords do not match.',
      termsRequired: 'Please accept the terms of use.',
      submitFailed: 'Unable to send your request. Please try again.',
    },

    submitting: 'Sending…',
    submit: 'Submit my application',
    haveAccount: 'Already have an account? Sign in',

    done: {
      title: 'Application sent!',
      message:
        'Your KYC information has been submitted. Our compliance team will review it and you will receive an email at {{email}} as soon as your account is activated.',
      backToLogin: 'Back to sign in',
    },
  },
}
