import Flag from '../Flag.jsx';

// Where a member's own roles apply: every account of the merchant (today's and future ones) or
// a chosen list. `value` is { allAccounts, accounts: [balance id] }.
export default function AccountsPicker({ accounts, value, onChange, disabled = false, invalid }) {
  const toggle = (id) => onChange({ ...value, accounts: value.accounts.includes(id) ? value.accounts.filter((a) => a !== id) : [...value.accounts, id] });

  return (
    <div className={`accounts-picker${invalid ? ' accounts-picker--invalid' : ''}`}>
      <label className={`accounts-picker__mode${value.allAccounts ? ' is-checked' : ''}`}>
        <input type="radio" checked={value.allAccounts} onChange={() => onChange({ ...value, allAccounts: true })} disabled={disabled} />
        <span>
          <strong>Tous les comptes</strong>
          <small>Les comptes actuels et ceux ouverts plus tard.</small>
        </span>
      </label>
      <label className={`accounts-picker__mode${!value.allAccounts ? ' is-checked' : ''}`}>
        <input type="radio" checked={!value.allAccounts} onChange={() => onChange({ ...value, allAccounts: false })} disabled={disabled} />
        <span>
          <strong>Certains comptes</strong>
          <small>Les rôles ne s’appliquent qu’aux comptes cochés.</small>
        </span>
      </label>
      {!value.allAccounts && (
        <div className="accounts-picker__list">
          {accounts.map((account) => (
            <label key={account.id} className="accounts-picker__account">
              <input type="checkbox" checked={value.accounts.includes(account.id)} onChange={() => toggle(account.id)} disabled={disabled} />
              <Flag code={account.countryCode} />
              <span>
                {account.country}
                <small>
                  {account.accountNumberFormatted} · {account.currency}
                </small>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
