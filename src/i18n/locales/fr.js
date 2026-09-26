export default {
  common: {
    select: 'Sélectionner',
    optional: '(optionnel)',
    previous: 'Précédent',
    next: 'Suivant',
    language: 'Langue',
  },

  login: {
    title: 'Content de vous revoir !',
    email: 'Adresse électronique',
    password: 'Mot de passe',
    missingCredentials: 'Veuillez renseigner vos identifiants.',
    serverError: 'Impossible de se connecter au serveur. Veuillez réessayer.',
    submitting: 'Connexion en cours…',
    submit: 'Connexion',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: 'Pas encore de compte ? Créer un compte marchand',
  },

  register: {
    title: 'Créer mon compte marchand',
    steps: {
      company: 'Entreprise',
      representative: 'Représentant légal',
      documents: 'Documents',
      account: 'Compte',
    },

    company: {
      name: 'Raison sociale',
      tradeName: 'Nom commercial',
      legalForm: 'Forme juridique',
      sector: "Secteur d'activité",
      rccm: 'N° RCCM',
      taxId: 'N° NIF / IFU',
      creationDate: 'Date de création',
      country: 'Pays',
      city: 'Ville',
      phone: 'Téléphone',
      address: 'Adresse du siège',
      website: 'Site web',
    },

    legalForms: {
      SOLE_PROPRIETORSHIP: 'Entreprise individuelle',
      SARL: 'SARL',
      SARLU: 'SARLU',
      SA: 'SA',
      SAS: 'SAS',
      SASU: 'SASU',
      GIE: 'GIE',
      ASSOCIATION: 'Association',
      NGO: 'ONG',
    },

    sectors: {
      RETAIL: 'Commerce de détail',
      ECOMMERCE: 'E-commerce',
      HOSPITALITY: 'Restauration / Hôtellerie',
      TRANSPORT: 'Transport / Logistique',
      EDUCATION: 'Éducation',
      HEALTH: 'Santé',
      FINANCIAL_SERVICES: 'Services financiers',
      TELECOM: 'Télécommunications',
      REAL_ESTATE: 'Immobilier',
      OTHER: 'Autre',
    },

    representative: {
      lastName: 'Nom',
      firstName: 'Prénom(s)',
      birthDate: 'Date de naissance',
      nationality: 'Nationalité',
      position: "Fonction dans l'entreprise",
      positionPlaceholder: 'Ex: Gérant, Directeur général...',
      idType: "Type de pièce d'identité",
      idNumber: 'Numéro de la pièce',
      idExpiryDate: "Date d'expiration",
      phone: 'Téléphone',
      email: 'Adresse électronique',
    },

    idTypes: {
      CNI: "Carte nationale d'identité",
      PASSPORT: 'Passeport',
      RESIDENCE_PERMIT: 'Carte de séjour',
    },

    documents: {
      hint: 'Formats acceptés : PDF, JPG, PNG — 5 Mo maximum par fichier.',
      rccm: 'Extrait RCCM / Registre de commerce',
      taxCertificate: 'Attestation NIF / IFU',
      idDocument: "Pièce d'identité du représentant légal",
      proofOfAddress: 'Justificatif de domicile (moins de 3 mois)',
      statutes: "Statuts de l'entreprise",
    },

    account: {
      email: 'Adresse électronique de connexion',
      password: 'Mot de passe',
      passwordConfirm: 'Confirmer le mot de passe',
      terms:
        "Je certifie l'exactitude des informations fournies et j'accepte les conditions générales d'utilisation.",
    },

    errors: {
      missingDocument: 'Veuillez joindre : {{document}}.',
      fileTooLarge: 'Chaque fichier doit faire 5 Mo maximum.',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      termsRequired: "Veuillez accepter les conditions générales d'utilisation.",
      submitFailed: "Impossible d'envoyer votre demande. Veuillez réessayer.",
    },

    submitting: 'Envoi en cours…',
    submit: 'Soumettre ma demande',
    haveAccount: 'Déjà un compte ? Se connecter',

    done: {
      title: 'Demande envoyée !',
      message:
        'Vos informations KYC ont bien été transmises. Notre équipe de conformité va les vérifier et vous recevrez un e-mail à {{email}} dès que votre compte sera activé.',
      backToLogin: 'Retour à la connexion',
    },
  },

  home: {
    nav: {
      features: 'Fonctionnalités',
      countries: 'Pays',
      developers: 'Développeurs',
      security: 'Sécurité',
      login: 'Se connecter',
      signup: 'Ouvrir un compte',
      dashboard: 'Tableau de bord',
    },
    hero: {
      eyebrow: 'Paiements pour les entreprises africaines',
      title: 'Encaissez et payez partout en Afrique de l’Ouest, en un seul compte.',
      subtitle:
        'Mobile money, cartes bancaires et virements : MyMerchantPay réunit tous vos moyens de paiement dans une seule plateforme, avec une seule intégration API.',
      primaryCta: 'Ouvrir un compte marchand',
      secondaryCta: 'Découvrir l’API',
      note: 'Inscription gratuite · Vérification KYC rapide · Aucun frais caché',
    },
    mock: {
      balance: 'Solde disponible',
      toastTitle: 'Paiement reçu',
    },
    features: {
      eyebrow: 'Fonctionnalités',
      title: 'Tout ce qu’il faut pour gérer votre argent',
      items: {
        collect: {
          title: 'Collecter des paiements',
          text: 'Acceptez le mobile money et les cartes sur votre site, votre application ou en boutique.',
        },
        disburse: {
          title: 'Débourser en masse',
          text: 'Payez vos fournisseurs, agents et employés en une seule opération, dans plusieurs pays.',
        },
        send: {
          title: 'Envoyer de l’argent',
          text: 'Transférez des fonds vers n’importe quel portefeuille mobile ou compte bancaire en quelques secondes.',
        },
        request: {
          title: 'Demander un paiement',
          text: 'Partagez un lien ou un QR code et soyez payé sans intégration technique.',
        },
      },
    },
    countries: {
      eyebrow: 'Couverture',
      title: 'Présents là où sont vos clients',
      subtitle: 'Un seul compte pour opérer dans chaque pays, avec les opérateurs que vos clients utilisent déjà.',
    },
    steps: {
      eyebrow: 'Comment ça marche',
      title: 'Opérationnel en trois étapes',
      items: {
        signup: {
          title: 'Créez votre compte',
          text: 'Renseignez les informations de votre entreprise en quelques minutes.',
        },
        kyc: {
          title: 'Validez votre KYC',
          text: 'Transmettez vos documents : notre équipe conformité vérifie et active votre compte.',
        },
        integrate: {
          title: 'Intégrez et encaissez',
          text: 'Générez vos clés API, testez en sandbox, puis passez en production.',
        },
      },
    },
    security: {
      eyebrow: 'Sécurité',
      title: 'Une sécurité toujours active',
      text: 'Vos fonds et les données de vos clients sont protégés à chaque étape, de l’inscription à chaque transaction.',
      points: {
        encryption: {
          title: 'Chiffrement de bout en bout',
          text: 'Toutes les communications et données sensibles sont chiffrées.',
        },
        kyc: {
          title: 'Marchands vérifiés',
          text: 'Chaque compte est contrôlé par notre équipe conformité avant activation.',
        },
        monitoring: {
          title: 'Surveillance des transactions',
          text: 'Les opérations inhabituelles sont détectées et bloquées en temps réel.',
        },
        keys: {
          title: 'Clés API séparées',
          text: 'Des clés distinctes pour le test et la production, révocables à tout moment.',
        },
      },
    },
    developers: {
      eyebrow: 'Développeurs',
      title: 'Une API pensée pour les développeurs',
      text: 'Une intégration REST unique pour tous les pays et tous les opérateurs. Démarrez en sandbox et passez en production sans changer votre code.',
      points: {
        sandbox: 'Environnement de test complet',
        webhooks: 'Notifications IPN en temps réel',
        oneApi: 'Une seule API pour tous les opérateurs',
      },
      codeLabel: 'Exemple de requête',
    },
    cta: {
      title: 'Prêt à développer votre activité ?',
      text: 'Ouvrez votre compte marchand gratuitement et commencez à encaisser dès aujourd’hui.',
      button: 'Créer mon compte',
    },
    footer: {
      tagline: 'La plateforme de paiement des entreprises en Afrique de l’Ouest.',
      product: 'Produit',
      developers: 'Développeurs',
      account: 'Compte',
      apiDocs: 'Documentation API',
      sandbox: 'Sandbox',
      legal: 'Mentions légales · Confidentialité · Conditions d’utilisation',
    },
  },
}
