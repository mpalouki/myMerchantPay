import site from './site/fr.js';

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
    invalidCredentials: 'Adresse électronique ou mot de passe incorrect.',
    tooManyAttempts: 'Trop de tentatives de connexion échouées. Réessayez dans 15 minutes.',
    serverError: 'Impossible de se connecter au serveur. Veuillez réessayer.',
    submitting: 'Connexion en cours…',
    submit: 'Connexion',
    forgotPassword: 'Mot de passe oublié?',
    noAccount: 'Pas encore de compte ? Créer un compte marchand',
    otp: {
      title: 'Vérification de connexion',
      intro: 'Saisissez le code à 6 chiffres envoyé à {{email}}. Il est valable 10 minutes.',
      code: 'Code de connexion',
      incomplete: 'Saisissez les 6 chiffres du code.',
      wrongCode: 'Code incorrect. Tentatives restantes : {{count}}.',
      expired: 'Ce code a expiré ou ne peut plus être utilisé. Reconnectez-vous pour en recevoir un nouveau.',
      verifying: 'Vérification…',
      submit: 'Valider',
      resend: 'Renvoyer le code',
      resendIn: 'Renvoyer le code dans {{seconds}} s',
      noResendLeft: 'Plus de renvoi possible pour cette connexion',
      resent: 'Un nouveau code vous a été envoyé.',
      resendFailed: 'Le code n’a pas pu être renvoyé. Veuillez réessayer.',
      back: 'Changer d’identifiants',
    },
  },

  register: {
    title: 'Formulaire de renseignement et contact ',
    steps: {
      company: 'Entreprise',
      representative: 'Représentant légal',
      documents: 'Documents',
      account: 'Compte',
      confirmation: 'Confirmation',
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

  createAccount: {
    title: 'Créez votre accès marchand',
    intro: 'Choisissez le mot de passe de votre espace marchand {{merchant}}. Vous pourrez ensuite compléter votre KYC.',
    checking: 'Vérification du lien…',
    email: 'Adresse électronique de connexion',
    password: 'Mot de passe',
    passwordHint: 'Au moins 10 caractères, dont une lettre et un chiffre.',
    confirm: 'Confirmer le mot de passe',
    submitting: 'Création en cours…',
    submit: 'Créer mon accès',
    invalid: {
      title: 'Lien invalide',
      message: "Ce lien n'est plus valable : il a expiré, a déjà été utilisé ou un nouveau lien vous a été envoyé. Contactez-nous pour en recevoir un nouveau, ou connectez-vous si votre accès est déjà créé.",
      toLogin: 'Aller à la connexion',
    },
    errors: {
      passwordTooShort: 'Le mot de passe doit contenir au moins 10 caractères.',
      passwordWeak: 'Le mot de passe doit contenir au moins une lettre et un chiffre.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      failed: 'Impossible de créer votre accès. Veuillez réessayer.',
    },
  },

  joinTeam: {
    title: "Rejoindre l'équipe {{team}}",
    intro: '{{merchant}} vous invite à rejoindre cette équipe sur son espace marchand, avec l’habilitation {{habilitation}}.',
    checking: "Vérification de l'invitation…",
    existingLogin: 'Vous avez déjà un accès MyMerchantPay avec cette adresse : acceptez, puis connectez-vous comme d’habitude.',
    submitting: 'Validation…',
    submit: "Accepter l'invitation",
    submitWithPassword: "Créer mon accès et rejoindre l'équipe",
    toLogin: 'Aller à la connexion',
    invalid: {
      title: 'Invitation invalide',
      message: "Cette invitation n'est plus valable : elle a expiré, a déjà été acceptée ou une nouvelle invitation vous a été envoyée. Demandez au marchand de vous la renvoyer.",
      emailTaken: "Cette adresse est déjà utilisée par le compte d'un autre marchand : l'invitation ne peut pas être acceptée. Demandez au marchand de vous inviter avec une autre adresse.",
    },
    joined: {
      title: 'Invitation acceptée',
      message: "Vous faites maintenant partie de l'équipe {{team}}. Connectez-vous avec vos identifiants habituels.",
    },
    errors: {
      failed: "Impossible d'accepter l'invitation. Veuillez réessayer.",
    },
  },

  kyc: {
    title: 'Validation KYC',
    subtitle: 'Complétez et validez les informations de votre entreprise pour activer votre espace marchand.',
    loading: 'Chargement de vos informations KYC…',
    steps: {
      company: 'Entreprise',
      representative: 'Représentant légal',
      documents: 'Documents',
      validation: 'Validation',
    },
    rejected: 'Votre précédente soumission KYC a été rejetée.',
    documentOnFile: 'Déjà fourni — choisissez un fichier pour le remplacer.',
    recap: {
      hint: 'Vérifiez vos informations avant de valider. Elles seront examinées par notre équipe conformité.',
      representative: 'Représentant légal',
    },
    submit: 'Valider mon KYC',
    goToDashboard: 'Accéder à mon tableau de bord',
    banner: 'Votre KYC est en cours de vérification par notre équipe conformité.',
    bannerLink: 'Voir le statut',
    status: {
      pending: {
        title: 'KYC en cours de vérification',
        message: 'Vos informations KYC ont été soumises le {{date}}. Notre équipe conformité les examine ; vous serez averti par email dès leur validation.',
      },
      approved: {
        title: 'KYC validé',
        message: 'Vos informations KYC ont été validées. Votre espace marchand est entièrement activé.',
      },
    },
    errors: {
      loadFailed: 'Impossible de charger vos informations KYC. Veuillez réessayer.',
    },
  },

  site,
};
