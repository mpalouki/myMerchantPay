// Shared bits of the "Intégrez notre API" pages (ApiIntegration, ApiApplicationDetails / New /
// Edit, components/ApplicationForm). The applications themselves come from
// /api/merchant/applications (client.js).

// Tabs of the "Intégrez notre API" pages.
export const API_INTEGRATION_TABS = [
  { key: 'apps', label: 'Applications' },
  { key: 'clients', label: 'Clients fictifs' },
  { key: 'data', label: 'Données internes fictives' },
];

// API service codes => labels.
export const SERVICE_LABELS = { PAYIN: 'Payin', PAYOUT: 'Payout' };

// Values of a new application: what the creation form starts from.
export const NEW_APPLICATION = {
  name: '',
  description: '',
  website: null,
  services: [],
  productionMode: false,
  invoiceEnabled: true,
  paymentMethods: [],
  ipn: { endpoint: null, enabled: false },
};

export const ALL_COUNTRIES_GROUP = 'Tous les pays';

// Payment methods ({ id, name, country | null }) grouped by country, as the form and the
// details page show them: methods valid everywhere first, then countries by name.
// Returns [{ group, methods }].
export function groupPaymentMethods(methods) {
  const groups = new Map();
  for (const method of methods) {
    const group = method.country?.name ?? ALL_COUNTRIES_GROUP;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(method);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => (a === ALL_COUNTRIES_GROUP ? -1 : b === ALL_COUNTRIES_GROUP ? 1 : a.localeCompare(b, 'fr')))
    .map(([group, list]) => ({ group, methods: list }));
}

// "18 octobre 2023 12:10:52", as in the designs.
export function formatCreatedAt(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date);
  const time = new Intl.DateTimeFormat('fr-FR', { timeStyle: 'medium' }).format(date);
  return `${day} ${time}`;
}
