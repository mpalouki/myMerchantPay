import site from './site/en.js';

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
    invalidCredentials: 'Incorrect email address or password.',
    tooManyAttempts: 'Too many failed sign-in attempts. Try again in 15 minutes.',
    serverError: 'Unable to reach the server. Please try again.',
    submitting: 'Signing in…',
    submit: 'Sign in',
    forgotPassword: 'Forgot your password?',
    noAccount: "Don't have an account? Create a merchant account",
    otp: {
      title: 'Sign-in verification',
      intro: 'Enter the 6-digit code sent to {{email}}. It is valid for 10 minutes.',
      code: 'Sign-in code',
      incomplete: 'Enter all 6 digits of the code.',
      wrongCode: 'Incorrect code. Attempts left: {{count}}.',
      expired: 'This code has expired or can no longer be used. Sign in again to get a new one.',
      verifying: 'Verifying…',
      submit: 'Verify',
      resend: 'Resend the code',
      resendIn: 'Resend the code in {{seconds}} s',
      noResendLeft: 'No more resends for this sign-in',
      resent: 'A new code has been sent to you.',
      resendFailed: 'The code could not be resent. Please try again.',
      back: 'Use different credentials',
    },
  },

  register: {
    title: 'Information and contact form',
    steps: {
      company: 'Company',
      representative: 'Legal representative',
      documents: 'Documents',
      account: 'Account',
      confirmation: 'Confirmation',
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

  createAccount: {
    title: 'Create your merchant login',
    intro: 'Choose the password for your {{merchant}} merchant space. You will then be able to complete your KYC.',
    checking: 'Checking your link…',
    email: 'Login email address',
    password: 'Password',
    passwordHint: 'At least 10 characters, including a letter and a number.',
    confirm: 'Confirm password',
    submitting: 'Creating…',
    submit: 'Create my login',
    invalid: {
      title: 'Invalid link',
      message: 'This link is no longer valid: it has expired, has already been used, or a newer link was sent to you. Contact us to receive a new one, or sign in if your login already exists.',
      toLogin: 'Go to sign in',
    },
    errors: {
      passwordTooShort: 'The password must be at least 10 characters long.',
      passwordWeak: 'The password must contain at least one letter and one number.',
      passwordMismatch: 'The passwords do not match.',
      failed: 'Unable to create your login. Please try again.',
    },
  },

  joinTeam: {
    title: 'Join the {{team}} team',
    intro: '{{merchant}} invites you to join this team on their merchant space, with the {{habilitation}} habilitation.',
    checking: 'Checking your invitation…',
    existingLogin: 'You already have a MyMerchantPay login with this address: accept, then sign in as usual.',
    submitting: 'Confirming…',
    submit: 'Accept the invitation',
    submitWithPassword: 'Create my login and join the team',
    toLogin: 'Go to sign in',
    invalid: {
      title: 'Invalid invitation',
      message: 'This invitation is no longer valid: it has expired, was already accepted, or a newer one was sent to you. Ask the merchant to send it again.',
      emailTaken: "This address is already used by another merchant's account, so the invitation can't be accepted. Ask the merchant to invite you with another address.",
    },
    joined: {
      title: 'Invitation accepted',
      message: 'You are now a member of the {{team}} team. Sign in with your usual credentials.',
    },
    errors: {
      failed: 'Unable to accept the invitation. Please try again.',
    },
  },

  kyc: {
    title: 'KYC validation',
    subtitle: 'Complete and validate your company information to activate your merchant space.',
    loading: 'Loading your KYC information…',
    steps: {
      company: 'Company',
      representative: 'Legal representative',
      documents: 'Documents',
      validation: 'Validation',
    },
    rejected: 'Your previous KYC submission was rejected.',
    documentOnFile: 'Already provided — choose a file to replace it.',
    recap: {
      hint: 'Check your information before validating. It will be reviewed by our compliance team.',
      representative: 'Legal representative',
    },
    submit: 'Validate my KYC',
    goToDashboard: 'Go to my dashboard',
    banner: 'Your KYC is being reviewed by our compliance team.',
    bannerLink: 'View status',
    status: {
      pending: {
        title: 'KYC under review',
        message: 'Your KYC information was submitted on {{date}}. Our compliance team is reviewing it; you will be notified by email once it is validated.',
      },
      approved: {
        title: 'KYC validated',
        message: 'Your KYC information has been validated. Your merchant space is fully activated.',
      },
    },
    errors: {
      loadFailed: 'Unable to load your KYC information. Please try again.',
    },
  },

  site,
};
