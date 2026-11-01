// "Équipe et sécurité" (pages/Team.jsx): labels and helpers the API doesn't provide. Roles,
// permissions, accounts and teams come from GET /api/merchant/team/options (getTeamOptions).

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_INVITES = 10;

export const MEMBER_STATUSES = {
  active: { label: 'Actif', tone: 'success' },
  invited: { label: 'Invitation en attente', tone: 'warning' },
  inactive: { label: 'Inactif', tone: 'danger' },
};

// The member list's tabs, with the API's counts.
export const STATUS_TABS = [
  { key: '', count: 'all', label: 'Tous les membres' },
  { key: 'active', count: 'active', label: 'Membres actifs' },
  { key: 'invited', count: 'invited', label: 'Invitations en attente' },
  { key: 'inactive', count: 'inactive', label: 'Membres inactifs' },
];

// Field errors from a 422 ({ errors: { field: message } }), else a single message.
export function readApiErrors(err) {
  const errors = err?.data?.errors;
  if (err?.status === 422 && errors && typeof errors === 'object') return { fields: errors };
  return { message: err?.message || 'Une erreur est survenue. Veuillez réessayer.' };
}

// "Togo · TG66 7062 0699 5588"
export function accountLabel(account) {
  return `${account.country} · ${account.accountNumberFormatted}`;
}

// "il y a 3 heures", "hier", "le 12/10/2026"; "Jamais" without a date.
export function relativeTime(iso, never = 'Jamais') {
  if (!iso) return never;
  const date = new Date(iso);
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'à l’instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'hier';
  if (days < 30) return `il y a ${days} jours`;
  return `le ${date.toLocaleDateString('fr-FR')}`;
}

// The roles of a group (or all roles) from options, keyed by group, in API order.
export function groupRoles(roles, roleGroups, { withoutSuperAdmin = false } = {}) {
  return Object.entries(roleGroups)
    .map(([key, label]) => ({
      key,
      label,
      roles: roles.filter((r) => r.group === key && !(withoutSuperAdmin && r.key === 'super_admin')),
    }))
    .filter((group) => group.roles.length > 0);
}

// The union of the permissions of `roleKeys` (options.roles).
export function permissionsOfRoles(roles, roleKeys) {
  const set = new Set();
  roles.filter((r) => roleKeys.includes(r.key)).forEach((r) => r.permissions.forEach((p) => set.add(p)));
  return set;
}
