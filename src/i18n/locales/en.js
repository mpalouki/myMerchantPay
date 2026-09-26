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

  home: {
    nav: {
      features: 'Features',
      countries: 'Countries',
      developers: 'Developers',
      security: 'Security',
      login: 'Sign in',
      signup: 'Open an account',
      dashboard: 'Dashboard',
    },
    hero: {
      eyebrow: 'Payments for African businesses',
      title: 'Get paid and pay out across West Africa, from one account.',
      subtitle:
        'Mobile money, cards and bank transfers: MyMerchantPay brings every payment method into one platform, with a single API integration.',
      primaryCta: 'Open a merchant account',
      secondaryCta: 'Explore the API',
      note: 'Free sign-up · Fast KYC review · No hidden fees',
    },
    mock: {
      balance: 'Available balance',
      toastTitle: 'Payment received',
    },
    features: {
      eyebrow: 'Features',
      title: 'Everything you need to manage your money',
      items: {
        collect: {
          title: 'Collect payments',
          text: 'Accept mobile money and cards on your website, in your app or in store.',
        },
        disburse: {
          title: 'Bulk payouts',
          text: 'Pay suppliers, agents and staff in a single operation, across several countries.',
        },
        send: {
          title: 'Send money',
          text: 'Transfer funds to any mobile wallet or bank account in seconds.',
        },
        request: {
          title: 'Request a payment',
          text: 'Share a link or a QR code and get paid with no technical integration.',
        },
      },
    },
    countries: {
      eyebrow: 'Coverage',
      title: 'Wherever your customers are',
      subtitle: 'One account to operate in every country, with the operators your customers already use.',
    },
    steps: {
      eyebrow: 'How it works',
      title: 'Up and running in three steps',
      items: {
        signup: {
          title: 'Create your account',
          text: 'Enter your company details in a few minutes.',
        },
        kyc: {
          title: 'Complete KYC',
          text: 'Upload your documents: our compliance team reviews them and activates your account.',
        },
        integrate: {
          title: 'Integrate and get paid',
          text: 'Generate your API keys, test in the sandbox, then go live.',
        },
      },
    },
    security: {
      eyebrow: 'Security',
      title: 'Security that never switches off',
      text: 'Your funds and your customers’ data are protected at every step, from sign-up to every transaction.',
      points: {
        encryption: {
          title: 'End-to-end encryption',
          text: 'All communications and sensitive data are encrypted.',
        },
        kyc: {
          title: 'Verified merchants',
          text: 'Every account is reviewed by our compliance team before activation.',
        },
        monitoring: {
          title: 'Transaction monitoring',
          text: 'Unusual activity is detected and blocked in real time.',
        },
        keys: {
          title: 'Separate API keys',
          text: 'Distinct test and production keys, revocable at any time.',
        },
      },
    },
    developers: {
      eyebrow: 'Developers',
      title: 'An API built for developers',
      text: 'One REST integration for every country and every operator. Start in the sandbox and go live without changing your code.',
      points: {
        sandbox: 'Full test environment',
        webhooks: 'Real-time IPN notifications',
        oneApi: 'One API for every operator',
      },
      codeLabel: 'Example request',
    },
    cta: {
      title: 'Ready to grow your business?',
      text: 'Open your merchant account for free and start accepting payments today.',
      button: 'Create my account',
    },
    footer: {
      tagline: 'The payment platform for businesses in West Africa.',
      product: 'Product',
      developers: 'Developers',
      account: 'Account',
      apiDocs: 'API documentation',
      sandbox: 'Sandbox',
      legal: 'Legal notice · Privacy · Terms of use',
    },
  },
}
