import { useState } from 'react';
import Icon from '../Icon.jsx';
import { groupRoles } from '../../data/team.js';

// The roles to give, grouped like Stripe's (administration, development…, then the merchant's
// custom roles): a checkbox per role with its description, and its permissions on demand.
// `value` holds role keys. Super administrator is left out for teams, and locked for those who
// aren't one (`canGiveSuperAdmin`).
export default function RolePicker({ options, value, onChange, forTeam = false, canGiveSuperAdmin = false, lockedKeys = [], invalid }) {
  const groups = groupRoles(options.roles, options.roleGroups, { withoutSuperAdmin: forTeam });
  const [open, setOpen] = useState(
    () =>
      new Set(
        groups
          .filter((g) => g.roles.some((r) => value.includes(r.key)))
          .map((g) => g.key)
          .concat(groups[0]?.key),
      ),
  );
  const [details, setDetails] = useState(null);
  const [query, setQuery] = useState('');
  const labelOf = (key) => options.permissions.find((p) => p.key === key)?.label ?? key;

  const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  const q = query.trim().toLowerCase();

  return (
    <div className={`role-picker${invalid ? ' role-picker--invalid' : ''}`}>
      <input
        type="search"
        className="role-picker__search"
        placeholder="Rechercher un rôle…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Rechercher un rôle"
      />
      {groups.map((group) => {
        const roles = q ? group.roles.filter((r) => r.name.toLowerCase().includes(q) || (r.description ?? '').toLowerCase().includes(q)) : group.roles;
        if (roles.length === 0) return null;
        const selected = group.roles.filter((r) => value.includes(r.key)).length;
        const isOpen = q !== '' || open.has(group.key);
        return (
          <div key={group.key} className="role-picker__group">
            <button
              type="button"
              className="role-picker__group-head"
              aria-expanded={isOpen}
              onClick={() =>
                setOpen((prev) => {
                  const next = new Set(prev);
                  if (next.has(group.key)) next.delete(group.key);
                  else next.add(group.key);
                  return next;
                })
              }
            >
              <Icon name={isOpen ? 'chevronDown' : 'chevronRight'} size={14} />
              <span>{group.label}</span>
              <small>
                {selected} rôle{selected > 1 ? 's' : ''} sélectionné{selected > 1 ? 's' : ''}
              </small>
            </button>
            {isOpen &&
              roles.map((role) => {
                const locked = lockedKeys.includes(role.key) || (role.key === 'super_admin' && !canGiveSuperAdmin);
                return (
                  <div key={role.key} className={`role-picker__role${value.includes(role.key) ? ' is-checked' : ''}`}>
                    <label>
                      <input type="checkbox" checked={value.includes(role.key)} onChange={() => toggle(role.key)} disabled={locked} />
                      <span className="role-picker__name">
                        {role.name}
                        {role.custom && <span className="badge badge--info">Personnalisé</span>}
                      </span>
                    </label>
                    {role.description && <p className="role-picker__description">{role.description}</p>}
                    <button type="button" className="link-btn role-picker__details-btn" onClick={() => setDetails(details === role.key ? null : role.key)}>
                      {details === role.key ? 'Masquer les permissions' : 'Afficher les permissions'}
                    </button>
                    {details === role.key && (
                      <ul className="role-picker__permissions">
                        {role.permissions.map((p) => (
                          <li key={p}>
                            <Icon name="check" size={12} /> {labelOf(p)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {locked && role.key === 'super_admin' && !canGiveSuperAdmin && (
                      <small className="role-picker__locked">Seul un super administrateur peut donner ce rôle.</small>
                    )}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}
