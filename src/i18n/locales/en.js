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

  home: {
    nav: {
      home: 'Home',
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
};
