import Flag from '../Flag.jsx';

// What a member may do in the end (GET /api/merchant/team/members/{id} access): their own roles
// plus their teams', merchant-wide permissions first, then per account.
export default function AccessSummary({ access, options }) {
  const labelOf = (key) => options.permissions.find((p) => p.key === key)?.label ?? key;
  if (!access) return null;
  const empty = access.merchant.length === 0 && access.accounts.length === 0;

  return (
    <div className="access-summary">
      {empty && <p className="access-summary__empty">Aucune permission : ajoutez un rôle ou une équipe.</p>}
      {access.merchant.length > 0 && (
        <div className="access-summary__block">
          <h4>Sur toute l’entreprise</h4>
          <ul>
            {access.merchant.map((p) => (
              <li key={p}>{labelOf(p)}</li>
            ))}
          </ul>
        </div>
      )}
      {access.accounts.map(({ account, permissions }) => (
        <div key={account.id} className="access-summary__block">
          <h4>
            <Flag code={account.countryCode} /> {account.country} <small>{account.accountNumberFormatted}</small>
          </h4>
          <ul>
            {permissions.map((p) => (
              <li key={p}>{labelOf(p)}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
