// "Gestion des rôles": a merchant groups its collaborators into teams on one of its accounts,
// each with a habilitation (profile) and the portal sections it can access (permissions).
// Profiles and permissions come from GET /api/merchant/teams/options (getTeamOptions); this
// file only holds the form rules and UI text the API doesn't provide.

export const TEAM_NAME_MAX_LENGTH = 30;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Shown under the habilitation select, by profile accessType.
export const ACCESS_TYPE_HINTS = {
  read: 'Consulte les sections autorisées, sans effectuer d’opération.',
  write: 'Effectue les opérations des sections autorisées.',
  admin: 'Opérations et administration des sections autorisées.',
};

export const MEMBER_STATUSES = {
  invited: { label: 'Invitation en attente', tone: 'warning' },
  active: { label: 'Actif', tone: 'success' },
  inactive: { label: 'Inactif', tone: 'danger' },
};

// Field errors from a 422 ({ errors: { field: message } }), else a single message.
export function readApiErrors(err) {
  const errors = err?.data?.errors;
  if (err?.status === 422 && errors && typeof errors === 'object') return { fields: errors };
  return { message: err?.message || 'Une erreur est survenue. Veuillez réessayer.' };
}
