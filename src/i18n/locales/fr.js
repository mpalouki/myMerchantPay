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
}
