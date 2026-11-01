// What a login may do (role management, "Équipe et sécurité"): GET /api/merchant/me answers
// { permissions: { merchant: [...], accounts: { <balance id>: [...] } } }. Permissions are
// granted per account (balances.view, reloads.create…) except the merchant-wide ones below.
// The API checks every call; the portal only hides what the login can't use.

export const MERCHANT_WIDE_PREFIXES = ['team.', 'security_history.', 'business.'];

export function isMerchantWide(permission) {
  return MERCHANT_WIDE_PREFIXES.some((prefix) => permission.startsWith(prefix));
}

// `permission` on account `balanceId`, or on any account when it is null; merchant-wide ones
// ignore the account.
export function hasPermission(permissions, permission, balanceId = null) {
  if (!permissions) return false;
  if (isMerchantWide(permission)) return (permissions.merchant ?? []).includes(permission);
  const accounts = permissions.accounts ?? {};
  if (balanceId !== null && balanceId !== undefined) return (accounts[balanceId] ?? []).includes(permission);
  return Object.values(accounts).some((list) => list.includes(permission));
}

// What each portal page needs, on the selected account for account-scoped ones.
export const PAGE_PERMISSIONS = {
  dashboard: 'balances.view',
  kyc: 'business.view',
  'payment-links': 'payment_links.view',
  'payment-links-manage': 'payment_links.manage',
  api: 'applications.view',
  'api-manage': 'applications.manage',
  team: 'team.view',
  reload: 'reloads.create',
  'reload-history': 'reloads.view',
  withdraw: 'withdrawals.view',
  transfer: 'transfers.view',
};
