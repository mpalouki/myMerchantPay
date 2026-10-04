// Public showcase site (SiteLayout and src/pages/site/*), under the `site` key of en.js.
// Same structure as site/fr.js. Legal texts are drafts to be reviewed by a lawyer.

export default {
  nav: {
    label: 'Main menu',
    home: 'MyMerchantPay home',
    product: 'Product',
    help: 'Help',
    presentation: 'Overview',
    services: 'Services',
    partners: 'Partners',
    pricing: 'Pricing',
    docs: 'API documentation',
    faq: 'FAQ',
    contact: 'Contact',
    support: 'Support',
    sandbox: 'Test environment',
    portal: 'Merchant portal',
    terms: 'Terms of use',
    privacy: 'Privacy policy',
    legal: 'Security & legal notice',
    login: 'Sign in',
    signup: 'Open an account',
    dashboard: 'Dashboard',
    openMenu: 'Open the menu',
    closeMenu: 'Close the menu',
  },

  footer: {
    tagline: 'The payment platform for businesses in West Africa.',
    product: 'Product',
    developers: 'Developers',
    help: 'Help',
    legal: 'Legal',
    rights: 'All rights reserved.',
  },

  cta: {
    title: 'Ready to grow your business?',
    text: 'Open your merchant account for free and start collecting payments as soon as your KYC is approved.',
    button: 'Create my account',
    contact: 'Talk to an advisor',
  },

  legalCommon: {
    updated: 'Last updated: {{date}}',
    toc: 'Contents',
    missing: '[to be completed]',
  },

  home: {
    hero: {
      eyebrow: 'Payments for African businesses',
      title: 'Collect and pay anywhere in West Africa, with a single account.',
      subtitle:
        'Mobile money, bank cards and transfers: MyMerchantPay brings all your payment methods together in one platform, with a single API integration.',
      primaryCta: 'Open a merchant account',
      secondaryCta: 'Discover MyMerchantPay',
      note: 'Free sign-up · Fast KYC review · No hidden fees',
    },
    mock: {
      balance: 'Available balance',
      toastTitle: 'Payment received',
    },
    presentation: {
      eyebrow: 'Overview',
      title: 'One platform for all your payment flows',
      text: 'MyMerchantPay connects your business to the region’s mobile money operators and card networks. You collect, pay and track everything from a single merchant portal.',
      link: 'Discover the platform',
      highlights: {
        oneAccount: { title: 'One account per country', text: 'Separate balances in each country, managed from the same place.' },
        oneApi: { title: 'A single integration', text: 'One REST API for every operator, in test and in production.' },
        realTime: { title: 'Real-time tracking', text: 'Every transaction is visible and notified as soon as it completes.' },
        verified: { title: 'Verified accounts', text: 'Every merchant is reviewed by our compliance team.' },
      },
    },
    services: {
      eyebrow: 'Services and products',
      title: 'Everything you need to manage your money',
      subtitle: 'Collections, bulk payouts, transfers and payment links, in every country we cover.',
      link: 'See all services',
    },
    partners: {
      eyebrow: 'Partners',
      title: 'Where your customers are',
      subtitle: 'One account to operate in every country, with the operators your customers already use.',
      link: 'Our partners and customers',
    },
    pricing: {
      eyebrow: 'Pricing',
      title: 'Free to open, pay as you go',
      text: 'No subscription and no setup fees: you only pay a fee on successful transactions.',
      link: 'See pricing',
    },
    security: {
      eyebrow: 'Security',
      title: 'Security that never sleeps',
      text: 'Your funds and your customers’ data are protected at every step, from sign-up to every transaction.',
      link: 'Our approach to security',
      points: {
        encryption: { title: 'End-to-end encryption', text: 'All communications and sensitive data are encrypted.' },
        kyc: { title: 'Verified merchants', text: 'Every account is reviewed by our compliance team before activation.' },
        monitoring: { title: 'Transaction monitoring', text: 'Unusual operations are detected and blocked in real time.' },
        keys: { title: 'Protected sign-in', text: 'A code sent by email at every sign-in, and separate API keys for test and production.' },
      },
    },
    developers: {
      eyebrow: 'Developers',
      title: 'An API built for developers',
      text: 'A single REST integration for every country and operator. Start in the test environment and go live without changing your code.',
      link: 'Read the API documentation',
      codeLabel: 'Sample request',
      points: {
        sandbox: 'Full test environment',
        webhooks: 'Real-time IPN notifications',
        oneApi: 'One API for every operator',
      },
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      link: 'All questions',
    },
  },

  presentation: {
    hero: {
      eyebrow: 'Platform overview',
      title: 'MyMerchantPay, the payment aggregator for West African businesses',
      lead: 'A platform that brings together mobile money, bank cards and transfers, to collect and pay in several countries with one account and one integration.',
    },
    pillars: {
      eyebrow: 'What we do',
      title: 'Three building blocks, one platform',
      subtitle: 'MyMerchantPay sits between your business and payment operators, so you only have one partner to manage.',
      items: {
        aggregate: { title: 'Payment method aggregation', text: 'We connect to the operators in each country: you accept all your customers’ payment methods without signing a contract with each one.' },
        portal: { title: 'A complete merchant portal', text: 'Balances, transactions, teams, API applications and reports: all your payment activity in one place.' },
        api: { title: 'A single API', text: 'A documented REST integration, with a test environment and real-time notifications, to automate your flows.' },
      },
    },
    portal: {
      eyebrow: 'The merchant portal',
      title: 'Run your business day to day',
      subtitle: 'The merchant portal runs in your browser, nothing to install.',
      items: {
        dashboard: { title: 'Dashboard', text: 'Your balances, collections and payouts over the last seven days, country by country.' },
        accounts: { title: 'Multi-country accounts', text: 'One account and account number per country, with a switcher to move between them.' },
        teams: { title: 'Teams and roles', text: 'Invite your colleagues and give them a role: viewer, editor or administrator.' },
        applications: { title: 'API applications', text: 'Create applications, choose their payment methods and get their test and production keys.' },
        recharge: { title: 'Top-ups and withdrawals', text: 'Fund your account for payouts and withdraw your money to your bank account.' },
        reporting: { title: 'Reports', text: 'Export your transaction history for accounting and reconciliation.' },
      },
    },
    steps: {
      eyebrow: 'How it works',
      title: 'From sign-up to your first payment',
      items: {
        signup: { title: 'Sign up', text: 'Fill in the contact form with your company’s details.' },
        kyc: { title: 'Complete your KYC', text: 'Get your access, complete your file and upload your documents. Our compliance team reviews it.' },
        integrate: { title: 'Integrate', text: 'Create an application and test with your test keys, or use payment links right away.' },
        live: { title: 'Get paid', text: 'Go live and track your payments in real time from your portal.' },
      },
    },
    mission: {
      eyebrow: 'Our mission',
      title: 'Making payments simple for every business in the region',
      text: 'The variety of operators and regulations holds back businesses that want to grow beyond their borders. MyMerchantPay gives them a single, reliable and transparent entry point.',
      values: {
        simplicity: { title: 'Simplicity', text: 'One account, one integration, one point of contact.' },
        transparency: { title: 'Transparency', text: 'Public pricing and a full history of every operation.' },
        security: { title: 'Security', text: 'Checks before, during and after every transaction.' },
        proximity: { title: 'Proximity', text: 'A team that knows local markets and answers in French and English.' },
      },
    },
  },

  services: {
    hero: {
      eyebrow: 'Services and products',
      title: 'Payment services for every need',
      lead: 'Collect from your customers, pay your partners and manage your funds in several countries, from the merchant portal or through the API.',
    },
    items: {
      collect: {
        title: 'Collect payments',
        summary: 'Accept mobile money and cards on your website, in your app or in store.',
        text: 'Your customers pay with the method they already use. Funds land in your MyMerchantPay account for that country, and you are notified of every successful payment.',
        points: ['Mobile money and Visa / Mastercard cards', 'Payments on websites, mobile apps or at the point of sale', 'IPN notification at every status change'],
      },
      disburse: {
        title: 'Bulk payouts',
        summary: 'Pay suppliers, agents and employees in one go, across several countries.',
        text: 'Send hundreds of payments at once to mobile wallets or bank accounts, and track the status of each one.',
        points: ['Bulk payments by file or API', 'Individual tracking of every beneficiary', 'Ideal for salaries, commissions and refunds'],
      },
      send: {
        title: 'Send money',
        summary: 'Transfer funds to any mobile wallet or bank account in seconds.',
        text: 'Make a one-off transfer from your merchant portal, without any integration, to a beneficiary in any country we cover.',
        points: ['Transfers in seconds', 'To mobile wallets or bank accounts', 'Receipt available in your history'],
      },
      paymentLinks: {
        title: 'Payment links and QR codes',
        summary: 'Share a link or a QR code and get paid without any integration.',
        text: 'Create a payment request and share it by SMS, WhatsApp or email. Your customer picks their payment method and you are notified as soon as it’s paid.',
        points: ['No code needed', 'Share as a link or QR code', 'Ideal for selling on social media'],
      },
      accounts: {
        title: 'Multi-country accounts',
        summary: 'One account per country, managed from the same place.',
        text: 'Each country has its own account and balance in the local currency. Switch between them in one click from the dashboard.',
        points: ['One account number per country', 'Separate balances and histories', 'Last seven days of activity at a glance'],
      },
      recharge: {
        title: 'Top-ups and withdrawals',
        summary: 'Fund your account and withdraw your money whenever you want.',
        text: 'Top up your account to fund outgoing payments, and withdraw your collections to your bank account or mobile wallet.',
        points: ['Top up by mobile money or bank transfer', 'Withdraw to a bank account or mobile money', 'Full top-up history'],
      },
    },
    products: {
      eyebrow: 'Our products',
      title: 'Three ways to use MyMerchantPay',
      subtitle: 'Pick the one that fits your organization, or combine them.',
      items: {
        portal: { title: 'The merchant portal', text: 'To manage your accounts, teams and operations without technical skills.', link: 'Go to the portal' },
        api: { title: 'The MyMerchantPay API', text: 'To build payments into your website, app or information system.', link: 'Read the documentation' },
        links: { title: 'Payment links', text: 'To get paid remotely in seconds, without a website.', link: 'Open an account' },
      },
    },
  },

  partners: {
    hero: {
      eyebrow: 'Partners, merchants and customers',
      title: 'A network built for your growth',
      lead: 'We work with the region’s leading payment operators to serve businesses of every size.',
    },
    operators: {
      eyebrow: 'Payment partners',
      title: 'Your customers’ payment methods',
      subtitle: 'Mobile money and bank cards: your customers pay with what they already have.',
      countries: 'Countries covered',
    },
    merchants: {
      eyebrow: 'Merchants and customers',
      title: 'They get paid with MyMerchantPay',
      subtitle: 'Businesses from every sector, from online shops to large corporations.',
      items: {
        ecommerce: { title: 'E-commerce', text: 'Online shops and marketplaces collecting payments in several countries.' },
        retail: { title: 'Local retail', text: 'Shops and points of sale accepting mobile money by QR code.' },
        services: { title: 'Services and subscriptions', text: 'Schools, insurers, energy and telecom providers collecting recurring payments.' },
        gaming: { title: 'Gaming and entertainment', text: 'Platforms handling large volumes of deposits and withdrawals in real time.' },
        ngo: { title: 'NGOs and institutions', text: 'Organizations paying grants and allowances to many beneficiaries.' },
        enterprise: { title: 'Large companies', text: 'Multi-country groups centralizing their collections and supplier payments.' },
      },
    },
    join: {
      eyebrow: 'Become a partner',
      title: 'Let’s build together',
      text: 'Operator, bank, integrator or agency: join our network to offer MyMerchantPay to your customers or connect your services to our platform.',
      button: 'Propose a partnership',
      types: {
        operators: { title: 'Payment operators', text: 'Make your services available to every MyMerchantPay merchant.' },
        banks: { title: 'Banks and financial institutions', text: 'Offer multi-country collections to your business customers.' },
        integrators: { title: 'Integrators and agencies', text: 'Build MyMerchantPay into your clients’ projects with dedicated support.' },
      },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contact',
      title: 'Let’s talk about your project',
      lead: 'A sales question, a partnership or need help? Our team will get back to you.',
    },
    channels: {
      title: 'Reach us',
      email: 'Sales',
      support: 'Merchant support',
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      address: 'Address',
      hours: 'Opening hours',
      helpPrefix: 'Quick question? See the',
    },
    form: {
      title: 'Write to us',
      name: 'Full name',
      company: 'Company',
      email: 'Email address',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      subjects: {
        sales: 'Open an account / sales question',
        partnership: 'Partnership',
        support: 'Technical support',
        other: 'Other request',
      },
      submit: 'Send the message',
      hint: 'The button opens your email app with the message filled in: you just have to send it.',
      sent: 'Your email app has opened. If it didn’t, write to us directly at {{email}}.',
      errors: {
        required: 'This field is required.',
        email: 'Enter a valid email address.',
        message: 'Your message must be at least 10 characters long.',
      },
    },
  },

  faq: {
    hero: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      lead: 'Answers to the questions our merchants ask most often.',
    },
    search: 'Search a question…',
    empty: 'No question matches your search.',
    more: {
      title: 'Didn’t find your answer?',
      text: 'Our team is here to help.',
      button: 'Contact us',
    },
    groups: [
      {
        key: 'account',
        title: 'Account and sign-up',
        items: [
          { q: 'Who can open a MyMerchantPay account?', a: 'Any business legally registered in one of the countries we cover: company, sole proprietorship, association or NGO. A trade register certificate (RCCM) or equivalent is required for the KYC.' },
          { q: 'How much does opening an account cost?', a: 'Opening an account is free, with no subscription or setup fee. You only pay a fee on successful transactions (see the Pricing page).' },
          { q: 'How does sign-up work?', a: 'You fill in the form with details about your company and its legal representative. We then send you a link to create your access, and you complete your KYC from the merchant portal.' },
          { q: 'Can I give access to my colleagues?', a: 'Yes. In “Role management”, create teams and invite colleagues by email, with the right role: viewer, editor or administrator.' },
        ],
      },
      {
        key: 'kyc',
        title: 'KYC and compliance',
        items: [
          { q: 'Which documents do I need to provide?', a: 'Your trade register certificate (RCCM), tax certificate, the legal representative’s ID and a proof of address. Articles of association are optional.' },
          { q: 'How long does the review take?', a: 'Our compliance team reviews your file as soon as it is submitted, usually within a few business days. You are notified of the decision and can correct your file if it is rejected.' },
          { q: 'Why is KYC required?', a: 'Regulations require us to verify the identity of businesses that collect payments, to fight fraud and money laundering. It is also a guarantee for your customers.' },
        ],
      },
      {
        key: 'payments',
        title: 'Payments and funds',
        items: [
          { q: 'Which payment methods do you accept?', a: 'The region’s main mobile money wallets (Orange Money, MTN MoMo, Moov Money, Wave, T-Money, Free Money…) and Visa and Mastercard cards, depending on the country.' },
          { q: 'In which countries can I collect payments?', a: 'In every country listed on the Partners page. You get one account per country, with its own balance in the local currency.' },
          { q: 'When are funds available?', a: 'A successful payment is credited to your MyMerchantPay account for that country. You can then use it for outgoing payments or withdraw it to your bank account.' },
          { q: 'What happens if a payment is disputed?', a: 'Contact support with the transaction reference. We review the request with the operator concerned and keep you informed.' },
        ],
      },
      {
        key: 'technical',
        title: 'Technical integration',
        items: [
          { q: 'Do I need a developer to use MyMerchantPay?', a: 'No: the merchant portal and payment links work without any code. The API is there to automate payments in your website or app.' },
          { q: 'Is there a test environment?', a: 'Yes. Every application has test keys and production keys: you build and test in the test environment, then go live without changing your code.' },
          { q: 'How am I notified of a payment?', a: 'Through an IPN notification sent to the URL of your choice at every status change, and in your merchant portal history.' },
        ],
      },
      {
        key: 'security',
        title: 'Security',
        items: [
          { q: 'How is my account protected?', a: 'By your password and by a one-time code sent by email at every sign-in. Repeated attempts with a wrong password are blocked.' },
          { q: 'Will MyMerchantPay ever ask for my password?', a: 'Never. We will never ask for your password, your sign-in code or your private key, whether by email, phone or message.' },
        ],
      },
    ],
  },

  pricing: {
    hero: {
      eyebrow: 'Pricing',
      title: 'Simple, transparent pricing',
      lead: 'No subscription, no setup fees: a fee on successful operations only.',
    },
    free: 'Free',
    perTransaction: 'per successful transaction',
    perOperation: 'per operation',
    note: 'Indicative prices excluding taxes, subject to change. The terms that apply to your account are set out in your contract.',
    items: {
      account: { title: 'Account opening and maintenance', text: 'Sign-up, merchant portal, accounts in every country and test environment.' },
      mobileMoney: { title: 'Mobile money collections', text: 'Payments received from your customers’ mobile wallets.' },
      cards: { title: 'Card collections', text: 'Payments by Visa and Mastercard cards.' },
      payouts: { title: 'Outgoing payments', text: 'Payouts and transfers to mobile wallets and bank accounts.' },
      paymentLinks: { title: 'Payment links and QR codes', text: 'Same rate as the matching collection, with no extra fee.' },
      withdrawals: { title: 'Withdrawal to a bank account', text: 'Transfer of your balance to your bank account.' },
    },
    included: {
      eyebrow: 'Included',
      title: 'Everything included, at no extra cost',
      items: {
        account: 'Account opening and multi-country accounts',
        portal: 'Access to the merchant portal',
        sandbox: 'Unlimited test environment',
        support: 'Email support',
        reporting: 'Transaction history and exports',
        teams: 'Teams and roles for your colleagues',
      },
    },
    volume: {
      title: 'High volumes?',
      text: 'Above a certain monthly volume, we offer terms tailored to your business.',
      button: 'Request a quote',
    },
    questions: {
      title: 'Pricing questions',
      items: [
        { q: 'Are there hidden fees?', a: 'No. You only pay the fees shown, on successful operations. A failed or cancelled transaction is not charged.' },
        { q: 'How are fees charged?', a: 'They are deducted automatically from each operation. The details appear in your transaction history.' },
        { q: 'Are prices the same in every country?', a: 'The prices shown apply by default. Some payment methods may have specific terms, set out in your contract.' },
      ],
    },
  },

  support: {
    hero: {
      eyebrow: 'Support',
      title: 'How can we help?',
      lead: 'Find an answer yourself or contact our support team.',
    },
    resources: {
      faq: { title: 'FAQ', text: 'Answers to the most common questions.' },
      docs: { title: 'API documentation', text: 'Guides and references for your developers.' },
      portal: { title: 'Merchant portal', text: 'Check your transactions and your account status.' },
      contact: { title: 'Contact support', text: 'Write to us, we answer quickly.' },
    },
    request: {
      eyebrow: 'Open a request',
      title: 'For a quick answer',
      text: 'Write to us from your merchant account’s email address and include:',
      checklist: [
        'your company name and the country of the account concerned;',
        'the reference of the transaction or application involved;',
        'the date and time of the problem, and any error message;',
        'the steps to reproduce the problem, and a screenshot if possible.',
      ],
    },
    contact: {
      title: 'Merchant support',
      never: 'We will never ask for your password, your sign-in code or your private key.',
    },
    priorities: {
      title: 'Our response times',
      subtitle: 'Requests are handled by priority, during our opening hours.',
      level: 'Priority',
      examples: 'Examples',
      target: 'First response',
      items: {
        critical: { label: 'Critical', examples: 'Payments impossible, suspected fraud or account compromise', target: 'Within 2 business hours' },
        high: { label: 'High', examples: 'Blocked transaction, IPN notification not received, unable to sign in', target: 'Within 8 business hours' },
        normal: { label: 'Normal', examples: 'Question about a feature, information request, KYC', target: 'Within 2 business days' },
      },
    },
  },

  terms: {
    hero: {
      eyebrow: 'Legal',
      title: 'Terms of use',
      lead: 'The rules for using the {{brand}} website and platform.',
    },
    updated: 'October 4, 2026',
    sections: [
      {
        id: 'object',
        title: '1. Purpose',
        paragraphs: [
          'These terms of use set out the conditions for accessing and using the MyMerchantPay website and platform, published by {{legalName}}, and the rights and obligations of users.',
          'Payment services provided to merchants are also governed by a merchant agreement, which prevails over these terms in case of conflict.',
        ],
      },
      {
        id: 'acceptance',
        title: '2. Acceptance',
        paragraphs: ['Signing up to the platform means full acceptance of these terms. If you do not accept them, you must not use the platform.'],
      },
      {
        id: 'account',
        title: '3. Sign-up and merchant account',
        paragraphs: [
          'The platform is reserved for legally incorporated businesses and organizations. The merchant guarantees that the information provided at sign-up is accurate and undertakes to keep it up to date.',
          'Account activation is subject to approval of the know-your-customer (KYC) process. MyMerchantPay may refuse or suspend an account, in particular if information is inaccurate or documents are not compliant.',
        ],
      },
      {
        id: 'access',
        title: '4. Credentials and security',
        paragraphs: ['The merchant is responsible for keeping their credentials, sign-in codes and API keys confidential, and for any operation carried out with them. They undertake to:'],
        list: [
          'never share their password, sign-in codes or private keys;',
          'only grant access to colleagues who need it, with the appropriate role;',
          'report any unauthorized use without delay to {{securityEmail}}.',
        ],
      },
      {
        id: 'use',
        title: '5. Permitted use',
        paragraphs: ['The merchant undertakes to use the platform in accordance with applicable laws. In particular, the following are prohibited:'],
        list: [
          'selling illegal goods or services, or those prohibited by payment operators;',
          'any money laundering or terrorist financing operation;',
          'any attempt at unauthorized access, disruption or circumvention of security measures;',
          'using the platform on behalf of an undeclared third party.',
        ],
      },
      {
        id: 'fees',
        title: '6. Fees',
        paragraphs: ['Services are charged at the rates published on the website or set out in the merchant agreement. Fees are deducted from successful operations.'],
      },
      {
        id: 'availability',
        title: '7. Availability',
        paragraphs: ['MyMerchantPay uses reasonable means to keep the platform available 24/7, subject to maintenance and to interruptions beyond its control, including those of payment operators.'],
      },
      {
        id: 'liability',
        title: '8. Liability',
        paragraphs: ['MyMerchantPay cannot be held liable for damage resulting from non-compliant use of the platform, a fault of the merchant or a third party, or force majeure. In any case, its liability is limited as set out in the merchant agreement.'],
      },
      {
        id: 'suspension',
        title: '9. Suspension and termination',
        paragraphs: ['MyMerchantPay may suspend or close an account for breach of these terms, suspected fraud or at the request of an authority. The merchant may close their account at any time; available funds are returned after deduction of any amounts due.'],
      },
      {
        id: 'data',
        title: '10. Personal data',
        paragraphs: ['The processing of personal data is described in our privacy policy.'],
      },
      {
        id: 'ip',
        title: '11. Intellectual property',
        paragraphs: ['The MyMerchantPay brand, website, platform and their content are protected. Any reproduction or use without prior authorization is prohibited.'],
      },
      {
        id: 'changes',
        title: '12. Changes to these terms',
        paragraphs: ['MyMerchantPay may change these terms. Merchants are informed of any material change before it takes effect; continued use of the platform means acceptance.'],
      },
      {
        id: 'law',
        title: '13. Governing law and disputes',
        paragraphs: ['These terms are governed by the law of the country where {{legalName}} has its registered office. In case of dispute, the parties will seek an amicable solution before any action before the competent courts. Questions: {{email}}.'],
      },
    ],
  },

  privacy: {
    hero: {
      eyebrow: 'Legal',
      title: 'Privacy policy',
      lead: 'How we collect, use and protect your personal data.',
    },
    updated: 'October 4, 2026',
    sections: [
      {
        id: 'controller',
        title: '1. Data controller',
        paragraphs: ['Personal data collected on the MyMerchantPay website and platform is processed by {{legalName}}, {{address}}. For any question about your data: {{privacyEmail}}.'],
      },
      {
        id: 'collected',
        title: '2. Data we collect',
        paragraphs: ['We only collect the data our services need:'],
        list: [
          'company details: legal name, trade name, RCCM, address, sector;',
          'details of the legal representative and users: name, email, phone, ID document, proof of address;',
          'sign-in data: IP address, sign-in date and time, security logs;',
          'transaction data: amounts, payment methods, references, beneficiaries.',
        ],
      },
      {
        id: 'purposes',
        title: '3. Purposes',
        list: [
          'opening and managing your merchant account;',
          'verifying your identity and meeting our anti-money-laundering and anti-fraud obligations (KYC);',
          'carrying out payment operations and informing you about them;',
          'securing access to the platform (sign-in codes, detection of fraudulent attempts);',
          'answering your contact and support requests.',
        ],
      },
      {
        id: 'legal-basis',
        title: '4. Legal bases',
        paragraphs: ['Processing is based on the performance of our contract, compliance with our legal and regulatory obligations, and our legitimate interest in securing our services.'],
      },
      {
        id: 'recipients',
        title: '5. Recipients',
        paragraphs: ['Your data is only accessible to authorized MyMerchantPay staff. It may be shared with the payment operators needed to carry out operations, with our technical providers (hosting, email delivery) and with authorities where the law requires it. We never sell your data.'],
      },
      {
        id: 'retention',
        title: '6. Retention',
        paragraphs: ['Data is kept for the duration of our contractual relationship, then archived for the period required by applicable regulations, in particular on anti-money-laundering and accounting.'],
      },
      {
        id: 'security',
        title: '7. Security',
        paragraphs: ['We apply appropriate technical and organizational measures: encrypted communications, documents stored out of any public access, hashed passwords, one-time sign-in codes and access control.'],
      },
      {
        id: 'rights',
        title: '8. Your rights',
        paragraphs: ['Under applicable data protection regulations, you have the right to access, rectify, erase and object to the processing of your data, and to lodge a complaint with the competent data protection authority. To exercise your rights: {{privacyEmail}}.'],
      },
      {
        id: 'cookies',
        title: '9. Cookies and local storage',
        paragraphs: ['The website does not use advertising cookies. It stores your language choice in your browser and, during your session, the information needed to keep you signed in.'],
      },
      {
        id: 'changes',
        title: '10. Changes',
        paragraphs: ['This policy may change. The date of the last update is shown at the top of this page.'],
      },
    ],
  },

  legal: {
    hero: {
      eyebrow: 'Legal',
      title: 'Security & legal notice',
      lead: 'Who publishes this website, and the measures that protect your account and your payments.',
    },
    updated: 'October 4, 2026',
    identity: {
      title: 'Legal notice',
      legalName: 'Publisher',
      legalForm: 'Legal form',
      registration: 'Trade register (RCCM)',
      taxId: 'Tax ID (NIF)',
      address: 'Registered office',
      director: 'Publication director',
      email: 'Contact',
      host: 'Hosting provider',
    },
    sections: [
      {
        id: 'commitment',
        title: 'Our security commitment',
        paragraphs: ['Security is at the heart of MyMerchantPay. It applies at every step: when the account is opened, at every sign-in and for every transaction.'],
      },
      {
        id: 'measures',
        title: 'Measures in place',
        list: [
          'KYC review of every merchant by our compliance team before activation;',
          'Two-step sign-in: password, then a one-time code sent by email;',
          'Temporary lockout after several failed sign-in attempts;',
          'Encrypted communications (HTTPS) and hashed passwords;',
          'KYC documents stored out of any public access;',
          'Separate API keys for test and production, and team-based roles;',
          'Transaction monitoring to detect unusual operations.',
        ],
      },
      {
        id: 'phishing',
        title: 'Protecting yourself from fraud',
        paragraphs: ['MyMerchantPay will never ask for your password, your sign-in code or your private key. Be wary of any message asking for them, even if it seems to come from us.'],
        list: [
          'Always check the website address before entering your credentials;',
          'Never share your sign-in code, even with a colleague;',
          'Use a unique password and change it if in doubt.',
        ],
      },
      {
        id: 'disclosure',
        title: 'Reporting a vulnerability',
        paragraphs: ['Think you have found a security flaw? Write to {{securityEmail}} describing the problem and how to reproduce it. Please do not exploit or disclose it before we have fixed it.'],
      },
      {
        id: 'ip',
        title: 'Intellectual property',
        paragraphs: ['All elements of the website (texts, logos, interfaces) are the property of {{legalName}}. Any reproduction without authorization is prohibited.'],
      },
    ],
  },

  docs: {
    hero: {
      eyebrow: 'API documentation',
      title: 'Add payments in a few lines',
      lead: 'A single REST API to collect and pay in every country we cover, with a test environment and real-time notifications.',
      getKeys: 'Get my keys',
      quickstart: 'Quick start',
    },
    toc: 'Documentation contents',
    preview: 'Preview: the payment API is being opened. The endpoints and formats below may still change before final publication.',
    request: 'Request',
    response: 'Response',
    notification: 'Notification',
    copy: 'Copy',
    copied: 'Copied',
    yes: 'Yes',
    no: 'No',
    sections: {
      introduction: {
        title: 'Introduction',
        text: 'The MyMerchantPay API is a REST API exchanging JSON over HTTPS. It lets you:',
        points: [
          'collect mobile money and card payments;',
          'track the status of every transaction;',
          'send payments to mobile wallets and bank accounts;',
          'get notified in real time through IPN.',
        ],
      },
      quickstart: {
        title: 'Quick start',
        steps: [
          'Open your merchant account and get your KYC approved.',
          'In “Integrate our API”, create an application: choose its services (collections, payouts), its payment methods and its notification URL.',
          'Copy the application’s test keys.',
          'Send your first test payment, then check the notification you receive.',
          'Switch the application to production and replace the test keys with the production keys.',
        ],
      },
      authentication: {
        title: 'Authentication',
        text: 'Each application has a master key and, for both test and production, a public key, a private key and a token. Authenticate your server calls with the private key, in the Authorization header.',
        head: ['Key', 'Prefix', 'Use'],
        keys: [
          { name: 'Public key', prefix: 'pk_test_ / pk_live_', use: 'Identifies your application client-side (payment pages).' },
          { name: 'Private key', prefix: 'sk_test_ / sk_live_', use: 'Authenticates your server calls and signs notifications.' },
          { name: 'Token', prefix: 'tk_test_ / tk_live_', use: 'Technical identifier of the application.' },
        ],
        warning: 'Your private key gives access to your account: never put it in a mobile app or in code running in the browser, and never share it.',
      },
      environments: {
        title: 'Environments',
        text: 'The test environment works like production, without moving real money. The environment is set by the key you use.',
        head: ['Environment', 'Base URL', 'Keys'],
        sandbox: 'Test',
        live: 'Production',
      },
      payments: {
        title: 'Collect a payment',
        text: 'Create a payment with the amount, country, payment method and customer. The payment is created as pending; the customer approves it on their phone or payment page.',
        head: ['Field', 'Type', 'Required', 'Description'],
        fields: [
          { name: 'amount', type: 'integer', required: true, description: 'Amount in currency units (the CFA franc has no cents).' },
          { name: 'currency', type: 'string', required: true, description: 'ISO 4217 code, for example XOF.' },
          { name: 'country', type: 'string', required: true, description: 'ISO 3166-1 alpha-2 country code, for example SN.' },
          { name: 'method', type: 'string', required: true, description: 'Payment method code (see Payment methods).' },
          { name: 'customer.phone', type: 'string', required: true, description: 'Payer’s number in international format.' },
          { name: 'reference', type: 'string', required: true, description: 'Your reference, unique per payment.' },
          { name: 'ipn_url', type: 'string', required: false, description: 'Notification URL; defaults to the application’s.' },
        ],
      },
      status: {
        title: 'Track a payment',
        text: 'Check a payment’s status at any time from its ID. Prefer IPN notifications over repeated calls, though.',
        head: ['Status', 'Meaning'],
        statuses: {
          pending: 'Waiting for the customer to approve.',
          succeeded: 'Payment successful, funds credited to your account.',
          failed: 'Payment declined or expired.',
          cancelled: 'Payment cancelled before approval.',
          refunded: 'Payment refunded to the customer.',
        },
      },
      payouts: {
        title: 'Send a payment',
        text: 'Send funds to a mobile wallet or a bank account. The amount is debited from your account balance in the beneficiary’s country; the application must have the payout service enabled.',
      },
      ipn: {
        title: 'IPN notifications',
        text: 'At every status change, we send a POST request to your application’s notification URL. Reply with an HTTP 2xx code: without one, the notification is retried several times.',
        signature: 'Every notification is signed: the X-MMP-Signature header holds a timestamp (t) and an HMAC-SHA256 signature (v1) of the request body, computed with your private key. Check it before handling the notification.',
        rules: [
          'Always check the signature and reject notifications older than 5 minutes.',
          'Handle notifications idempotently: the same notification may arrive more than once.',
          'Only fulfil an order after a notification with the succeeded status.',
        ],
      },
      methods: {
        title: 'Payment methods',
        text: 'Available payment methods depend on the country and on those enabled for your application. Sample codes:',
        head: ['Code', 'Country'],
        allCountries: 'All countries',
      },
      errors: {
        title: 'Errors',
        text: 'Errors return a matching HTTP code and an error object with a stable code, a readable message and, where relevant, the field involved.',
        head: ['HTTP code', 'Meaning'],
        codes: {
          200: 'Success.',
          201: 'Resource created.',
          400: 'Malformed request.',
          401: 'Missing or invalid key.',
          403: 'Service not enabled for this application.',
          404: 'Resource not found.',
          409: 'Reference already used.',
          422: 'Invalid data (see the field involved).',
          429: 'Too many requests: try again later.',
          500: 'Error on our side: retry, then contact support.',
        },
      },
      practices: {
        title: 'Best practices',
        items: [
          'Keep your private keys server-side, in environment variables.',
          'Use a unique reference per operation to avoid duplicates.',
          'Rely on IPN notifications rather than repeated polling.',
          'Test every status in the test environment before going live.',
        ],
        help: 'A question about the integration? See the',
      },
    },
  },
};
