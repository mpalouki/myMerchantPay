// Public showcase site (SiteLayout and src/pages/site/*), under the `site` key of fr.js.
// Legal texts (terms, privacy, legal) are drafts to be reviewed by a lawyer before publication;
// `{{name}}` placeholders in them are filled from data/site.js by LegalPage.

export default {
  nav: {
    label: 'Menu principal',
    home: 'Accueil MyMerchantPay',
    product: 'Produit',
    help: 'Aide',
    presentation: 'Présentation',
    services: 'Services',
    partners: 'Partenaires',
    pricing: 'Tarifs',
    docs: 'Documentation API',
    faq: 'FAQ',
    contact: 'Contact',
    support: 'Support',
    sandbox: 'Environnement de test',
    portal: 'Espace marchand',
    terms: 'Conditions générales d’utilisation',
    privacy: 'Politique de confidentialité',
    legal: 'Sécurité et mentions légales',
    login: 'Se connecter',
    signup: 'Ouvrir un compte',
    dashboard: 'Tableau de bord',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
  },

  footer: {
    tagline: 'La plateforme de paiement des entreprises en Afrique de l’Ouest.',
    product: 'Produit',
    developers: 'Développeurs',
    help: 'Aide',
    legal: 'Légal',
    rights: 'Tous droits réservés.',
  },

  cta: {
    title: 'Prêt à développer votre activité ?',
    text: 'Ouvrez votre compte marchand gratuitement et commencez à encaisser dès la validation de votre KYC.',
    button: 'Créer mon compte',
    contact: 'Parler à un conseiller',
  },

  legalCommon: {
    updated: 'Dernière mise à jour : {{date}}',
    toc: 'Sommaire',
    missing: '[à compléter]',
  },

  home: {
    hero: {
      eyebrow: 'Paiements pour les entreprises africaines',
      title: 'Encaissez et payez partout en Afrique de l’Ouest, en un seul compte.',
      subtitle:
        'Mobile money, cartes bancaires et virements : MyMerchantPay réunit tous vos moyens de paiement dans une seule plateforme, avec une seule intégration API.',
      primaryCta: 'Ouvrir un compte marchand',
      secondaryCta: 'Découvrir MyMerchantPay',
      note: 'Inscription gratuite · Vérification KYC rapide · Aucun frais caché',
    },
    mock: {
      balance: 'Solde disponible',
      toastTitle: 'Paiement reçu',
    },
    presentation: {
      eyebrow: 'Présentation',
      title: 'Une seule plateforme pour tous vos flux de paiement',
      text: 'MyMerchantPay connecte votre entreprise aux opérateurs de mobile money et aux réseaux de cartes de la région. Vous encaissez, vous payez et vous suivez tout depuis un espace marchand unique.',
      link: 'Découvrir l’application',
      highlights: {
        oneAccount: { title: 'Un compte par pays', text: 'Des soldes séparés dans chaque pays, gérés depuis le même espace.' },
        oneApi: { title: 'Une seule intégration', text: 'Une API REST pour tous les opérateurs, en test comme en production.' },
        realTime: { title: 'Suivi en temps réel', text: 'Chaque transaction est visible et notifiée dès qu’elle aboutit.' },
        verified: { title: 'Comptes vérifiés', text: 'Chaque marchand est contrôlé par notre équipe conformité.' },
      },
    },
    services: {
      eyebrow: 'Services et produits',
      title: 'Tout ce qu’il faut pour gérer votre argent',
      subtitle: 'Encaissement, paiements de masse, transferts et liens de paiement, dans tous les pays couverts.',
      link: 'Voir tous les services',
    },
    partners: {
      eyebrow: 'Partenaires',
      title: 'Présents là où sont vos clients',
      subtitle: 'Un seul compte pour opérer dans chaque pays, avec les opérateurs que vos clients utilisent déjà.',
      link: 'Nos partenaires et nos clients',
    },
    pricing: {
      eyebrow: 'Tarifs',
      title: 'Ouverture gratuite, paiement à l’usage',
      text: 'Pas d’abonnement ni de frais d’installation : vous ne payez qu’une commission sur les transactions réussies.',
      link: 'Voir les tarifs',
    },
    security: {
      eyebrow: 'Sécurité',
      title: 'Une sécurité toujours active',
      text: 'Vos fonds et les données de vos clients sont protégés à chaque étape, de l’inscription à chaque transaction.',
      link: 'Notre approche de la sécurité',
      points: {
        encryption: { title: 'Chiffrement de bout en bout', text: 'Toutes les communications et données sensibles sont chiffrées.' },
        kyc: { title: 'Marchands vérifiés', text: 'Chaque compte est contrôlé par notre équipe conformité avant activation.' },
        monitoring: { title: 'Surveillance des transactions', text: 'Les opérations inhabituelles sont détectées et bloquées en temps réel.' },
        keys: { title: 'Connexion protégée', text: 'Code envoyé par e-mail à chaque connexion et clés API séparées pour le test et la production.' },
      },
    },
    developers: {
      eyebrow: 'Développeurs',
      title: 'Une API pensée pour les développeurs',
      text: 'Une intégration REST unique pour tous les pays et tous les opérateurs. Démarrez en environnement de test et passez en production sans changer votre code.',
      link: 'Lire la documentation API',
      codeLabel: 'Exemple de requête',
      points: {
        sandbox: 'Environnement de test complet',
        webhooks: 'Notifications IPN en temps réel',
        oneApi: 'Une seule API pour tous les opérateurs',
      },
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      link: 'Toutes les questions',
    },
  },

  presentation: {
    hero: {
      eyebrow: 'Présentation de l’application',
      title: 'MyMerchantPay, l’agrégateur de paiement des entreprises d’Afrique de l’Ouest',
      lead: 'Une plateforme qui réunit le mobile money, les cartes bancaires et les virements, pour encaisser et payer dans plusieurs pays avec un seul compte et une seule intégration.',
    },
    pillars: {
      eyebrow: 'Ce que nous faisons',
      title: 'Trois briques, une seule plateforme',
      subtitle: 'MyMerchantPay se place entre votre entreprise et les opérateurs de paiement, pour que vous n’ayez qu’un seul partenaire à gérer.',
      items: {
        aggregate: { title: 'L’agrégation des moyens de paiement', text: 'Nous nous connectons aux opérateurs de chaque pays : vous acceptez tous les moyens de paiement de vos clients sans signer un contrat avec chacun.' },
        portal: { title: 'Un espace marchand complet', text: 'Soldes, transactions, équipes, applications API et rapports : toute votre activité de paiement au même endroit.' },
        api: { title: 'Une API unique', text: 'Une intégration REST documentée, avec un environnement de test et des notifications en temps réel, pour automatiser vos flux.' },
      },
    },
    portal: {
      eyebrow: 'L’espace marchand',
      title: 'Pilotez votre activité au quotidien',
      subtitle: 'L’espace marchand est accessible depuis votre navigateur, sans installation.',
      items: {
        dashboard: { title: 'Tableau de bord', text: 'Vos soldes, vos encaissements et vos décaissements des sept derniers jours, pays par pays.' },
        accounts: { title: 'Comptes multi-pays', text: 'Un compte et un numéro de compte par pays, et un sélecteur pour passer de l’un à l’autre.' },
        teams: { title: 'Équipes et rôles', text: 'Invitez vos collaborateurs et attribuez-leur une habilitation : consultant, éditeur ou administrateur.' },
        applications: { title: 'Applications API', text: 'Créez vos applications, choisissez leurs moyens de paiement et récupérez leurs clés de test et de production.' },
        recharge: { title: 'Recharges et retraits', text: 'Approvisionnez votre compte pour vos paiements et retirez vos fonds vers votre compte bancaire.' },
        reporting: { title: 'Rapports', text: 'Exportez l’historique de vos transactions pour votre comptabilité et vos rapprochements.' },
      },
    },
    steps: {
      eyebrow: 'Comment ça marche',
      title: 'De l’inscription au premier paiement',
      items: {
        signup: { title: 'Inscrivez-vous', text: 'Remplissez le formulaire de contact avec les informations de votre entreprise.' },
        kyc: { title: 'Validez votre KYC', text: 'Recevez votre accès, complétez votre dossier et transmettez vos documents. Notre équipe conformité le vérifie.' },
        integrate: { title: 'Intégrez', text: 'Créez une application, testez avec vos clés de test ou utilisez directement les liens de paiement.' },
        live: { title: 'Encaissez', text: 'Passez en production et suivez vos paiements en temps réel depuis votre espace.' },
      },
    },
    mission: {
      eyebrow: 'Notre mission',
      title: 'Rendre le paiement simple pour chaque entreprise de la région',
      text: 'La diversité des opérateurs et des réglementations freine les entreprises qui veulent grandir au-delà de leurs frontières. MyMerchantPay leur offre un point d’entrée unique, fiable et transparent.',
      values: {
        simplicity: { title: 'Simplicité', text: 'Un compte, une intégration, un interlocuteur.' },
        transparency: { title: 'Transparence', text: 'Des tarifs publics et un historique complet de chaque opération.' },
        security: { title: 'Sécurité', text: 'Des contrôles à l’entrée, pendant et après chaque transaction.' },
        proximity: { title: 'Proximité', text: 'Une équipe qui connaît les marchés locaux et répond en français.' },
      },
    },
  },

  services: {
    hero: {
      eyebrow: 'Services et produits',
      title: 'Des services de paiement pour chaque besoin',
      lead: 'Encaissez vos clients, payez vos partenaires et gérez vos fonds dans plusieurs pays, depuis l’espace marchand ou par API.',
    },
    items: {
      collect: {
        title: 'Collecter des paiements',
        summary: 'Acceptez le mobile money et les cartes sur votre site, votre application ou en boutique.',
        text: 'Vos clients paient avec le moyen qu’ils utilisent déjà. Vous recevez les fonds sur votre compte MyMerchantPay du pays concerné et une notification à chaque paiement réussi.',
        points: ['Mobile money et cartes Visa / Mastercard', 'Paiement sur site web, application mobile ou point de vente', 'Notification IPN à chaque changement de statut'],
      },
      disburse: {
        title: 'Débourser en masse',
        summary: 'Payez vos fournisseurs, agents et employés en une seule opération, dans plusieurs pays.',
        text: 'Envoyez des centaines de paiements en une fois, vers des portefeuilles mobiles ou des comptes bancaires, et suivez le statut de chacun.',
        points: ['Paiements groupés par fichier ou par API', 'Suivi individuel de chaque bénéficiaire', 'Idéal pour les salaires, commissions et remboursements'],
      },
      send: {
        title: 'Envoyer de l’argent',
        summary: 'Transférez des fonds vers n’importe quel portefeuille mobile ou compte bancaire en quelques secondes.',
        text: 'Effectuez un transfert ponctuel depuis votre espace marchand, sans intégration technique, vers un bénéficiaire de n’importe quel pays couvert.',
        points: ['Transfert en quelques secondes', 'Vers portefeuille mobile ou compte bancaire', 'Reçu disponible dans votre historique'],
      },
      paymentLinks: {
        title: 'Liens et QR codes de paiement',
        summary: 'Partagez un lien ou un QR code et soyez payé sans intégration technique.',
        text: 'Créez une demande de paiement et partagez-la par SMS, WhatsApp ou e-mail. Votre client choisit son moyen de paiement et vous êtes notifié dès que c’est réglé.',
        points: ['Aucune ligne de code nécessaire', 'Partage par lien ou QR code', 'Idéal pour la vente sur les réseaux sociaux'],
      },
      accounts: {
        title: 'Comptes multi-pays',
        summary: 'Un compte par pays, géré depuis le même espace.',
        text: 'Chaque pays dispose de son propre compte et de son propre solde dans la devise locale. Vous passez de l’un à l’autre en un clic depuis le tableau de bord.',
        points: ['Un numéro de compte par pays', 'Soldes et historiques séparés', 'Mouvements des sept derniers jours en un coup d’œil'],
      },
      recharge: {
        title: 'Recharges et retraits',
        summary: 'Approvisionnez votre compte et retirez vos fonds quand vous le souhaitez.',
        text: 'Rechargez votre compte pour financer vos paiements sortants, et retirez vos encaissements vers votre compte bancaire ou votre portefeuille mobile.',
        points: ['Recharge par mobile money ou virement', 'Retrait vers compte bancaire ou mobile money', 'Historique complet des recharges'],
      },
    },
    products: {
      eyebrow: 'Nos produits',
      title: 'Trois façons d’utiliser MyMerchantPay',
      subtitle: 'Choisissez celle qui correspond à votre organisation, ou combinez-les.',
      items: {
        portal: { title: 'L’espace marchand', text: 'Pour gérer vos comptes, vos équipes et vos opérations sans compétences techniques.', link: 'Accéder à l’espace' },
        api: { title: 'L’API MyMerchantPay', text: 'Pour intégrer le paiement à votre site, votre application ou votre système d’information.', link: 'Lire la documentation' },
        links: { title: 'Les liens de paiement', text: 'Pour vous faire payer à distance en quelques secondes, sans site web.', link: 'Ouvrir un compte' },
      },
    },
  },

  partners: {
    hero: {
      eyebrow: 'Partenaires, marchands et clients',
      title: 'Un réseau au service de votre croissance',
      lead: 'Nous travaillons avec les principaux opérateurs de paiement de la région pour servir des entreprises de toutes tailles.',
    },
    operators: {
      eyebrow: 'Partenaires de paiement',
      title: 'Les moyens de paiement de vos clients',
      subtitle: 'Mobile money et cartes bancaires : vos clients paient avec ce qu’ils ont déjà.',
      countries: 'Pays couverts',
    },
    merchants: {
      eyebrow: 'Marchands et clients',
      title: 'Ils encaissent avec MyMerchantPay',
      subtitle: 'Des entreprises de tous les secteurs, de la boutique en ligne au grand compte.',
      items: {
        ecommerce: { title: 'E-commerce', text: 'Boutiques en ligne et places de marché qui encaissent dans plusieurs pays.' },
        retail: { title: 'Commerce de proximité', text: 'Boutiques et points de vente qui acceptent le mobile money par QR code.' },
        services: { title: 'Services et abonnements', text: 'Écoles, assurances, fournisseurs d’énergie ou de télécoms qui collectent des paiements récurrents.' },
        gaming: { title: 'Jeux et divertissement', text: 'Plateformes qui gèrent de gros volumes de dépôts et de retraits en temps réel.' },
        ngo: { title: 'ONG et institutions', text: 'Organisations qui versent des aides et des indemnités à de nombreux bénéficiaires.' },
        enterprise: { title: 'Grandes entreprises', text: 'Groupes multi-pays qui centralisent leurs encaissements et leurs paiements fournisseurs.' },
      },
    },
    join: {
      eyebrow: 'Devenir partenaire',
      title: 'Construisons ensemble',
      text: 'Opérateur, banque, intégrateur ou agence : rejoignez notre réseau pour proposer MyMerchantPay à vos clients ou connecter vos services à notre plateforme.',
      button: 'Proposer un partenariat',
      types: {
        operators: { title: 'Opérateurs de paiement', text: 'Rendez vos services accessibles à tous les marchands MyMerchantPay.' },
        banks: { title: 'Banques et institutions financières', text: 'Proposez l’encaissement multi-pays à vos clients entreprises.' },
        integrators: { title: 'Intégrateurs et agences', text: 'Intégrez MyMerchantPay aux projets de vos clients et bénéficiez d’un accompagnement dédié.' },
      },
    },
  },

  contact: {
    hero: {
      eyebrow: 'Contacts',
      title: 'Parlons de votre projet',
      lead: 'Une question commerciale, un partenariat ou besoin d’aide ? Notre équipe vous répond.',
    },
    channels: {
      title: 'Nous joindre',
      email: 'Contact commercial',
      support: 'Support marchands',
      phone: 'Téléphone',
      whatsapp: 'WhatsApp',
      address: 'Adresse',
      hours: 'Horaires',
      helpPrefix: 'Une question rapide ? Consultez la',
    },
    form: {
      title: 'Écrivez-nous',
      name: 'Nom complet',
      company: 'Entreprise',
      email: 'Adresse électronique',
      phone: 'Téléphone',
      subject: 'Sujet',
      message: 'Message',
      subjects: {
        sales: 'Ouvrir un compte / question commerciale',
        partnership: 'Partenariat',
        support: 'Support technique',
        other: 'Autre demande',
      },
      submit: 'Envoyer le message',
      hint: 'Le bouton ouvre votre messagerie avec le message prérempli : il ne vous reste qu’à l’envoyer.',
      sent: 'Votre messagerie s’est ouverte. Si ce n’est pas le cas, écrivez-nous directement à {{email}}.',
      errors: {
        required: 'Ce champ est obligatoire.',
        email: 'Saisissez une adresse électronique valide.',
        message: 'Votre message doit contenir au moins 10 caractères.',
      },
    },
  },

  faq: {
    hero: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      lead: 'Les réponses aux questions que se posent le plus souvent nos marchands.',
    },
    search: 'Rechercher une question…',
    empty: 'Aucune question ne correspond à votre recherche.',
    more: {
      title: 'Vous n’avez pas trouvé votre réponse ?',
      text: 'Notre équipe est là pour vous aider.',
      button: 'Nous contacter',
    },
    groups: [
      {
        key: 'account',
        title: 'Compte et inscription',
        items: [
          { q: 'Qui peut ouvrir un compte MyMerchantPay ?', a: 'Toute entreprise légalement enregistrée dans l’un des pays couverts : société, entreprise individuelle, association ou ONG. Un registre de commerce (RCCM) ou équivalent vous sera demandé lors du KYC.' },
          { q: 'Combien coûte l’ouverture d’un compte ?', a: 'L’ouverture est gratuite, sans abonnement ni frais d’installation. Vous ne payez qu’une commission sur les transactions réussies (voir la page Tarifs).' },
          { q: 'Comment se passe l’inscription ?', a: 'Vous remplissez le formulaire avec les informations de votre entreprise et de son représentant légal. Nous vous envoyons ensuite un lien pour créer votre accès, puis vous complétez votre KYC depuis l’espace marchand.' },
          { q: 'Puis-je donner accès à mes collaborateurs ?', a: 'Oui. Depuis « Gestion des rôles », créez des équipes et invitez vos collaborateurs par e-mail, avec une habilitation adaptée : consultant, éditeur ou administrateur.' },
        ],
      },
      {
        key: 'kyc',
        title: 'KYC et conformité',
        items: [
          { q: 'Quels documents faut-il fournir ?', a: 'Le registre de commerce (RCCM), l’attestation fiscale, une pièce d’identité du représentant légal et un justificatif de domicile. Les statuts sont facultatifs.' },
          { q: 'Combien de temps prend la vérification ?', a: 'Notre équipe conformité examine votre dossier dès sa soumission, généralement sous quelques jours ouvrés. Vous êtes informé de la décision et pouvez corriger votre dossier s’il est refusé.' },
          { q: 'Pourquoi faut-il valider un KYC ?', a: 'La réglementation impose de vérifier l’identité des entreprises qui encaissent des paiements, afin de lutter contre la fraude et le blanchiment. C’est aussi une garantie pour vos clients.' },
        ],
      },
      {
        key: 'payments',
        title: 'Paiements et fonds',
        items: [
          { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Les principaux portefeuilles de mobile money de la région (Orange Money, MTN MoMo, Moov Money, Wave, T-Money, Free Money…) et les cartes Visa et Mastercard, selon le pays.' },
          { q: 'Dans quels pays puis-je encaisser ?', a: 'Dans tous les pays affichés sur la page Partenaires. Vous disposez d’un compte par pays, avec son propre solde en devise locale.' },
          { q: 'Quand les fonds sont-ils disponibles ?', a: 'Un paiement réussi est crédité sur votre compte MyMerchantPay du pays concerné. Vous pouvez ensuite l’utiliser pour vos paiements sortants ou le retirer vers votre compte bancaire.' },
          { q: 'Que se passe-t-il en cas de paiement contesté ?', a: 'Contactez le support avec la référence de la transaction. Nous examinons la demande avec l’opérateur concerné et vous tenons informé de son traitement.' },
        ],
      },
      {
        key: 'technical',
        title: 'Intégration technique',
        items: [
          { q: 'Faut-il un développeur pour utiliser MyMerchantPay ?', a: 'Non : l’espace marchand et les liens de paiement s’utilisent sans aucune ligne de code. L’API est là pour automatiser vos paiements dans votre site ou votre application.' },
          { q: 'Existe-t-il un environnement de test ?', a: 'Oui. Chaque application dispose de clés de test et de clés de production : vous développez et testez en environnement de test, puis passez en production sans changer votre code.' },
          { q: 'Comment suis-je informé d’un paiement ?', a: 'Par une notification IPN envoyée à l’URL de votre choix à chaque changement de statut, et dans l’historique de votre espace marchand.' },
        ],
      },
      {
        key: 'security',
        title: 'Sécurité',
        items: [
          { q: 'Comment mon compte est-il protégé ?', a: 'Par votre mot de passe et par un code à usage unique envoyé par e-mail à chaque connexion. Les tentatives répétées avec un mauvais mot de passe sont bloquées.' },
          { q: 'MyMerchantPay peut-il me demander mon mot de passe ?', a: 'Jamais. Nous ne vous demanderons jamais votre mot de passe, votre code de connexion ni votre clé privée, que ce soit par e-mail, par téléphone ou par message.' },
        ],
      },
    ],
  },

  pricing: {
    hero: {
      eyebrow: 'Tarifs',
      title: 'Des tarifs simples et transparents',
      lead: 'Pas d’abonnement, pas de frais d’installation : une commission uniquement sur les opérations réussies.',
    },
    free: 'Gratuit',
    perTransaction: 'par transaction réussie',
    perOperation: 'par opération',
    note: 'Tarifs indicatifs hors taxes, susceptibles d’évoluer. Les conditions applicables à votre compte figurent dans votre contrat.',
    items: {
      account: { title: 'Ouverture et tenue de compte', text: 'Inscription, espace marchand, comptes dans chaque pays et environnement de test.' },
      mobileMoney: { title: 'Encaissement mobile money', text: 'Paiements reçus via les portefeuilles mobiles de vos clients.' },
      cards: { title: 'Encaissement par carte', text: 'Paiements par cartes Visa et Mastercard.' },
      payouts: { title: 'Paiements sortants', text: 'Déboursements et transferts vers portefeuilles mobiles et comptes bancaires.' },
      paymentLinks: { title: 'Liens et QR codes de paiement', text: 'Même tarif que l’encaissement correspondant, sans frais supplémentaires.' },
      withdrawals: { title: 'Retrait vers compte bancaire', text: 'Virement de votre solde vers votre compte bancaire.' },
    },
    included: {
      eyebrow: 'Inclus',
      title: 'Tout ce qui est compris, sans supplément',
      items: {
        account: 'Ouverture de compte et comptes multi-pays',
        portal: 'Accès à l’espace marchand',
        sandbox: 'Environnement de test illimité',
        support: 'Support par e-mail',
        reporting: 'Historique et exports des transactions',
        teams: 'Équipes et rôles pour vos collaborateurs',
      },
    },
    volume: {
      title: 'Gros volumes ?',
      text: 'Au-delà d’un certain volume mensuel, nous proposons des conditions adaptées à votre activité.',
      button: 'Demander un devis',
    },
    questions: {
      title: 'Questions sur les tarifs',
      items: [
        { q: 'Y a-t-il des frais cachés ?', a: 'Non. Vous ne payez que les commissions affichées, sur les opérations réussies. Une transaction échouée ou annulée n’est pas facturée.' },
        { q: 'Comment les commissions sont-elles prélevées ?', a: 'Elles sont déduites automatiquement du montant de chaque opération. Le détail figure dans l’historique de vos transactions.' },
        { q: 'Les tarifs sont-ils les mêmes dans tous les pays ?', a: 'Les tarifs affichés s’appliquent par défaut. Certains moyens de paiement peuvent avoir des conditions particulières, précisées dans votre contrat.' },
      ],
    },
  },

  support: {
    hero: {
      eyebrow: 'Support',
      title: 'Comment pouvons-nous vous aider ?',
      lead: 'Trouvez une réponse par vous-même ou contactez notre équipe support.',
    },
    resources: {
      faq: { title: 'FAQ', text: 'Les réponses aux questions les plus fréquentes.' },
      docs: { title: 'Documentation API', text: 'Guides et références pour vos développeurs.' },
      portal: { title: 'Espace marchand', text: 'Consultez vos transactions et l’état de votre compte.' },
      contact: { title: 'Contacter le support', text: 'Écrivez-nous, nous vous répondons rapidement.' },
    },
    request: {
      eyebrow: 'Ouvrir une demande',
      title: 'Pour une réponse rapide',
      text: 'Écrivez-nous depuis l’adresse de votre compte marchand et indiquez :',
      checklist: [
        'le nom de votre entreprise et le pays du compte concerné ;',
        'la référence de la transaction ou de l’application en cause ;',
        'la date et l’heure du problème, et le message d’erreur éventuel ;',
        'les étapes pour reproduire le problème et une capture d’écran si possible.',
      ],
    },
    contact: {
      title: 'Support marchands',
      never: 'Nous ne vous demanderons jamais votre mot de passe, votre code de connexion ni votre clé privée.',
    },
    priorities: {
      title: 'Nos délais de prise en charge',
      subtitle: 'Les demandes sont traitées par ordre de priorité, pendant nos heures d’ouverture.',
      level: 'Priorité',
      examples: 'Exemples',
      target: 'Première réponse',
      items: {
        critical: { label: 'Critique', examples: 'Encaissements impossibles, suspicion de fraude ou de compromission du compte', target: 'Sous 2 heures ouvrées' },
        high: { label: 'Haute', examples: 'Transaction bloquée, notification IPN non reçue, accès impossible', target: 'Sous 8 heures ouvrées' },
        normal: { label: 'Normale', examples: 'Question sur une fonctionnalité, demande d’information, KYC', target: 'Sous 2 jours ouvrés' },
      },
    },
  },

  terms: {
    hero: {
      eyebrow: 'Légal',
      title: 'Conditions générales d’utilisation',
      lead: 'Les règles d’utilisation du site et de la plateforme {{brand}}.',
    },
    updated: '4 octobre 2026',
    sections: [
      {
        id: 'object',
        title: '1. Objet',
        paragraphs: [
          'Les présentes conditions générales d’utilisation (CGU) définissent les conditions d’accès et d’utilisation du site et de la plateforme MyMerchantPay, éditée par {{legalName}}, ainsi que les droits et obligations des utilisateurs.',
          'Les services de paiement fournis aux marchands font en outre l’objet d’un contrat marchand, qui prévaut sur les présentes CGU en cas de contradiction.',
        ],
      },
      {
        id: 'acceptance',
        title: '2. Acceptation',
        paragraphs: [
          'L’inscription à la plateforme vaut acceptation pleine et entière des présentes CGU. Si vous n’acceptez pas ces conditions, vous ne devez pas utiliser la plateforme.',
        ],
      },
      {
        id: 'account',
        title: '3. Inscription et compte marchand',
        paragraphs: [
          'La plateforme est réservée aux entreprises et organisations légalement constituées. Le marchand garantit l’exactitude des informations transmises lors de l’inscription et s’engage à les tenir à jour.',
          'L’activation du compte est subordonnée à la validation de la procédure de connaissance client (KYC). MyMerchantPay peut refuser ou suspendre un compte, notamment en cas d’informations inexactes ou de documents non conformes.',
        ],
      },
      {
        id: 'access',
        title: '4. Identifiants et sécurité',
        paragraphs: ['Le marchand est responsable de la confidentialité de ses identifiants, de ses codes de connexion et de ses clés API, ainsi que de toute opération effectuée avec eux. Il s’engage à :'],
        list: [
          'ne jamais communiquer son mot de passe, ses codes de connexion ou ses clés privées ;',
          'n’accorder des accès qu’aux collaborateurs qui en ont besoin, avec l’habilitation adaptée ;',
          'signaler sans délai toute utilisation non autorisée à {{securityEmail}}.',
        ],
      },
      {
        id: 'use',
        title: '5. Utilisation autorisée',
        paragraphs: ['Le marchand s’engage à utiliser la plateforme conformément aux lois en vigueur. Sont notamment interdits :'],
        list: [
          'la vente de biens ou services illicites ou interdits par les opérateurs de paiement ;',
          'toute opération de blanchiment de capitaux ou de financement du terrorisme ;',
          'toute tentative d’accès non autorisé, de perturbation ou de contournement des mesures de sécurité ;',
          'l’utilisation de la plateforme pour le compte d’un tiers non déclaré.',
        ],
      },
      {
        id: 'fees',
        title: '6. Tarifs',
        paragraphs: ['Les services sont facturés selon les tarifs en vigueur publiés sur le site ou prévus au contrat marchand. Les commissions sont prélevées sur les opérations réussies.'],
      },
      {
        id: 'availability',
        title: '7. Disponibilité',
        paragraphs: ['MyMerchantPay met en œuvre les moyens raisonnables pour assurer l’accès à la plateforme 24 h/24, sous réserve des opérations de maintenance et des interruptions indépendantes de sa volonté, notamment celles des opérateurs de paiement.'],
      },
      {
        id: 'liability',
        title: '8. Responsabilité',
        paragraphs: ['MyMerchantPay ne saurait être tenue responsable des dommages résultant d’une utilisation non conforme de la plateforme, d’une faute du marchand ou d’un tiers, ou d’un cas de force majeure. Sa responsabilité est en tout état de cause limitée dans les conditions prévues au contrat marchand.'],
      },
      {
        id: 'suspension',
        title: '9. Suspension et résiliation',
        paragraphs: ['MyMerchantPay peut suspendre ou fermer un compte en cas de manquement aux présentes CGU, de suspicion de fraude ou sur demande d’une autorité. Le marchand peut fermer son compte à tout moment ; les fonds disponibles lui sont restitués après déduction des sommes dues.'],
      },
      {
        id: 'data',
        title: '10. Données personnelles',
        paragraphs: ['Le traitement des données personnelles est décrit dans notre politique de confidentialité.'],
      },
      {
        id: 'ip',
        title: '11. Propriété intellectuelle',
        paragraphs: ['La marque MyMerchantPay, le site, la plateforme et leurs contenus sont protégés. Toute reproduction ou utilisation sans autorisation préalable est interdite.'],
      },
      {
        id: 'changes',
        title: '12. Modification des CGU',
        paragraphs: ['MyMerchantPay peut modifier les présentes CGU. Les marchands sont informés de toute modification substantielle avant son entrée en vigueur ; la poursuite de l’utilisation de la plateforme vaut acceptation.'],
      },
      {
        id: 'law',
        title: '13. Droit applicable et litiges',
        paragraphs: ['Les présentes CGU sont soumises au droit du pays du siège de {{legalName}}. En cas de litige, les parties recherchent une solution amiable avant toute action devant les juridictions compétentes. Pour toute question : {{email}}.'],
      },
    ],
  },

  privacy: {
    hero: {
      eyebrow: 'Légal',
      title: 'Politique de confidentialité',
      lead: 'Comment nous collectons, utilisons et protégeons vos données personnelles.',
    },
    updated: '4 octobre 2026',
    sections: [
      {
        id: 'controller',
        title: '1. Responsable du traitement',
        paragraphs: ['Les données personnelles collectées sur le site et la plateforme MyMerchantPay sont traitées par {{legalName}}, {{address}}. Pour toute question relative à vos données : {{privacyEmail}}.'],
      },
      {
        id: 'collected',
        title: '2. Données collectées',
        paragraphs: ['Nous collectons uniquement les données nécessaires à nos services :'],
        list: [
          'informations sur l’entreprise : raison sociale, nom commercial, RCCM, adresse, secteur ;',
          'informations sur le représentant légal et les utilisateurs : nom, prénom, e-mail, téléphone, pièce d’identité, justificatif de domicile ;',
          'données de connexion : adresse IP, date et heure de connexion, journaux de sécurité ;',
          'données de transaction : montants, moyens de paiement, références, bénéficiaires.',
        ],
      },
      {
        id: 'purposes',
        title: '3. Finalités',
        list: [
          'ouvrir et gérer votre compte marchand ;',
          'vérifier votre identité et respecter nos obligations de lutte contre le blanchiment et la fraude (KYC) ;',
          'exécuter les opérations de paiement et vous en informer ;',
          'sécuriser l’accès à la plateforme (codes de connexion, détection des tentatives frauduleuses) ;',
          'répondre à vos demandes de contact et de support.',
        ],
      },
      {
        id: 'legal-basis',
        title: '4. Bases légales',
        paragraphs: ['Les traitements reposent sur l’exécution du contrat qui nous lie, le respect de nos obligations légales et réglementaires, et notre intérêt légitime à sécuriser nos services.'],
      },
      {
        id: 'recipients',
        title: '5. Destinataires',
        paragraphs: ['Vos données sont accessibles aux seules équipes habilitées de MyMerchantPay. Elles peuvent être transmises aux opérateurs de paiement nécessaires à l’exécution des opérations, à nos prestataires techniques (hébergement, envoi d’e-mails) et aux autorités lorsque la loi l’exige. Nous ne vendons jamais vos données.'],
      },
      {
        id: 'retention',
        title: '6. Durée de conservation',
        paragraphs: ['Les données sont conservées pendant la durée de la relation contractuelle, puis archivées pendant la durée imposée par la réglementation applicable, notamment en matière de lutte contre le blanchiment et de comptabilité.'],
      },
      {
        id: 'security',
        title: '7. Sécurité',
        paragraphs: ['Nous mettons en œuvre des mesures techniques et organisationnelles adaptées : chiffrement des communications, stockage des documents hors de tout accès public, mots de passe hachés, codes de connexion à usage unique et contrôle des accès.'],
      },
      {
        id: 'rights',
        title: '8. Vos droits',
        paragraphs: ['Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition, ainsi que du droit de saisir l’autorité de protection des données compétente. Pour exercer vos droits : {{privacyEmail}}.'],
      },
      {
        id: 'cookies',
        title: '9. Cookies et stockage local',
        paragraphs: ['Le site n’utilise pas de cookies publicitaires. Il stocke dans votre navigateur votre choix de langue et, pendant votre session, les informations nécessaires à votre connexion.'],
      },
      {
        id: 'changes',
        title: '10. Modifications',
        paragraphs: ['Cette politique peut évoluer. La date de dernière mise à jour figure en haut de cette page.'],
      },
    ],
  },

  legal: {
    hero: {
      eyebrow: 'Légal',
      title: 'Sécurité et mentions légales',
      lead: 'L’éditeur du site et les mesures qui protègent votre compte et vos paiements.',
    },
    updated: '4 octobre 2026',
    identity: {
      title: 'Mentions légales',
      legalName: 'Éditeur',
      legalForm: 'Forme juridique',
      registration: 'RCCM',
      taxId: 'NIF',
      address: 'Siège social',
      director: 'Directeur de la publication',
      email: 'Contact',
      host: 'Hébergeur',
    },
    sections: [
      {
        id: 'commitment',
        title: 'Notre engagement sécurité',
        paragraphs: ['La sécurité est au cœur de MyMerchantPay. Elle s’applique à chaque étape : à l’ouverture du compte, à chaque connexion et à chaque transaction.'],
      },
      {
        id: 'measures',
        title: 'Les mesures en place',
        list: [
          'Vérification KYC de chaque marchand par notre équipe conformité avant activation ;',
          'Connexion en deux étapes : mot de passe puis code à usage unique envoyé par e-mail ;',
          'Blocage temporaire après plusieurs tentatives de connexion échouées ;',
          'Communications chiffrées (HTTPS) et mots de passe stockés sous forme hachée ;',
          'Documents KYC conservés hors de tout accès public ;',
          'Clés API distinctes pour le test et la production, et habilitations par équipe ;',
          'Surveillance des transactions pour détecter les opérations inhabituelles.',
        ],
      },
      {
        id: 'phishing',
        title: 'Se protéger contre la fraude',
        paragraphs: ['MyMerchantPay ne vous demandera jamais votre mot de passe, votre code de connexion ou votre clé privée. Méfiez-vous de tout message qui vous le demande, même s’il semble venir de nous.'],
        list: [
          'Vérifiez toujours l’adresse du site avant de saisir vos identifiants ;',
          'Ne partagez jamais votre code de connexion, même avec un collaborateur ;',
          'Utilisez un mot de passe unique et changez-le en cas de doute.',
        ],
      },
      {
        id: 'disclosure',
        title: 'Signaler une vulnérabilité',
        paragraphs: ['Vous pensez avoir découvert une faille de sécurité ? Écrivez-nous à {{securityEmail}} en décrivant le problème et les étapes pour le reproduire. Merci de ne pas l’exploiter ni de la divulguer avant que nous l’ayons corrigée.'],
      },
      {
        id: 'ip',
        title: 'Propriété intellectuelle',
        paragraphs: ['L’ensemble des éléments du site (textes, logos, interfaces) est la propriété de {{legalName}}. Toute reproduction sans autorisation est interdite.'],
      },
    ],
  },

  docs: {
    hero: {
      eyebrow: 'Documentation API',
      title: 'Intégrez le paiement en quelques lignes',
      lead: 'Une API REST unique pour encaisser et payer dans tous les pays couverts, avec un environnement de test et des notifications en temps réel.',
      getKeys: 'Obtenir mes clés',
      quickstart: 'Démarrage rapide',
    },
    toc: 'Sommaire de la documentation',
    preview: 'Aperçu : l’API de paiement est en cours d’ouverture. Les points d’accès et les formats ci-dessous peuvent encore évoluer avant leur publication définitive.',
    request: 'Requête',
    response: 'Réponse',
    notification: 'Notification',
    copy: 'Copier',
    copied: 'Copié',
    yes: 'Oui',
    no: 'Non',
    sections: {
      introduction: {
        title: 'Introduction',
        text: 'L’API MyMerchantPay est une API REST qui échange du JSON en HTTPS. Elle permet de :',
        points: [
          'collecter des paiements mobile money et carte ;',
          'suivre le statut de chaque transaction ;',
          'envoyer des paiements vers des portefeuilles mobiles et des comptes bancaires ;',
          'être notifié en temps réel par IPN.',
        ],
      },
      quickstart: {
        title: 'Démarrage rapide',
        steps: [
          'Ouvrez votre compte marchand et faites valider votre KYC.',
          'Dans « Intégrez notre API », créez une application : choisissez ses services (encaissement, décaissement), ses moyens de paiement et son URL de notification.',
          'Récupérez les clés de test de l’application.',
          'Envoyez votre premier paiement de test, puis vérifiez la notification reçue.',
          'Passez l’application en production et remplacez les clés de test par les clés de production.',
        ],
      },
      authentication: {
        title: 'Authentification',
        text: 'Chaque application dispose d’une clé maître et, pour le test comme pour la production, d’une clé publique, d’une clé privée et d’un jeton. Authentifiez vos appels serveur avec la clé privée, dans l’en-tête Authorization.',
        head: ['Clé', 'Préfixe', 'Usage'],
        keys: [
          { name: 'Clé publique', prefix: 'pk_test_ / pk_live_', use: 'Identifie votre application côté client (pages de paiement).' },
          { name: 'Clé privée', prefix: 'sk_test_ / sk_live_', use: 'Authentifie vos appels serveur et signe les notifications.' },
          { name: 'Jeton', prefix: 'tk_test_ / tk_live_', use: 'Identifiant technique de l’application.' },
        ],
        warning: 'Votre clé privée donne accès à votre compte : ne l’intégrez jamais dans une application mobile ou du code exécuté dans le navigateur, et ne la partagez pas.',
      },
      environments: {
        title: 'Environnements',
        text: 'L’environnement de test reproduit le fonctionnement de la production, sans mouvement d’argent réel. L’environnement est déterminé par la clé utilisée.',
        head: ['Environnement', 'URL de base', 'Clés'],
        sandbox: 'Test',
        live: 'Production',
      },
      payments: {
        title: 'Collecter un paiement',
        text: 'Créez un paiement en indiquant le montant, le pays, le moyen de paiement et le client. Le paiement est créé au statut pending ; le client le valide sur son téléphone ou sa page de paiement.',
        head: ['Champ', 'Type', 'Obligatoire', 'Description'],
        fields: [
          { name: 'amount', type: 'integer', required: true, description: 'Montant en unité de la devise (le franc CFA n’a pas de centimes).' },
          { name: 'currency', type: 'string', required: true, description: 'Code ISO 4217, par exemple XOF.' },
          { name: 'country', type: 'string', required: true, description: 'Code pays ISO 3166-1 alpha-2, par exemple SN.' },
          { name: 'method', type: 'string', required: true, description: 'Code du moyen de paiement (voir Moyens de paiement).' },
          { name: 'customer.phone', type: 'string', required: true, description: 'Numéro du payeur au format international.' },
          { name: 'reference', type: 'string', required: true, description: 'Votre référence, unique par paiement.' },
          { name: 'ipn_url', type: 'string', required: false, description: 'URL de notification, à défaut celle de l’application.' },
        ],
      },
      status: {
        title: 'Suivre un paiement',
        text: 'Consultez à tout moment le statut d’un paiement à partir de son identifiant. Privilégiez toutefois les notifications IPN plutôt que des appels répétés.',
        head: ['Statut', 'Signification'],
        statuses: {
          pending: 'En attente de validation par le client.',
          succeeded: 'Paiement réussi, fonds crédités sur votre compte.',
          failed: 'Paiement refusé ou expiré.',
          cancelled: 'Paiement annulé avant validation.',
          refunded: 'Paiement remboursé au client.',
        },
      },
      payouts: {
        title: 'Envoyer un paiement',
        text: 'Envoyez des fonds vers un portefeuille mobile ou un compte bancaire. Le montant est débité du solde de votre compte dans le pays du bénéficiaire ; l’application doit avoir le service de décaissement activé.',
      },
      ipn: {
        title: 'Notifications IPN',
        text: 'À chaque changement de statut, nous envoyons une requête POST à l’URL de notification de votre application. Répondez par un code HTTP 2xx : sans réponse, la notification est renvoyée plusieurs fois.',
        signature: 'Chaque notification est signée : l’en-tête X-MMP-Signature contient un horodatage (t) et une signature HMAC-SHA256 (v1) du corps de la requête, calculée avec votre clé privée. Vérifiez-la avant de traiter la notification.',
        rules: [
          'Vérifiez toujours la signature et rejetez les notifications de plus de 5 minutes.',
          'Traitez les notifications de façon idempotente : une même notification peut arriver plusieurs fois.',
          'Ne livrez une commande qu’après une notification au statut succeeded.',
        ],
      },
      methods: {
        title: 'Moyens de paiement',
        text: 'Les moyens de paiement disponibles dépendent du pays et de ceux activés sur votre application. Exemples de codes :',
        head: ['Code', 'Pays'],
        allCountries: 'Tous les pays',
      },
      errors: {
        title: 'Erreurs',
        text: 'Les erreurs renvoient un code HTTP adapté et un objet error avec un code stable, un message lisible et, le cas échéant, le champ en cause.',
        head: ['Code HTTP', 'Signification'],
        codes: {
          200: 'Succès.',
          201: 'Ressource créée.',
          400: 'Requête mal formée.',
          401: 'Clé absente ou invalide.',
          403: 'Service non activé pour cette application.',
          404: 'Ressource introuvable.',
          409: 'Référence déjà utilisée.',
          422: 'Données invalides (voir le champ en cause).',
          429: 'Trop de requêtes : réessayez plus tard.',
          500: 'Erreur de notre côté : réessayez, puis contactez le support.',
        },
      },
      practices: {
        title: 'Bonnes pratiques',
        items: [
          'Conservez vos clés privées côté serveur, dans des variables d’environnement.',
          'Utilisez une référence unique par opération pour éviter les doublons.',
          'Appuyez-vous sur les notifications IPN plutôt que sur des interrogations répétées.',
          'Testez tous les statuts en environnement de test avant de passer en production.',
        ],
        help: 'Une question sur l’intégration ? Consultez la page',
      },
    },
  },
};
