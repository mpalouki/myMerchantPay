import { useState } from 'react';
import Icon from '../Icon.jsx';
import AlertDialog from '../AlertDialog.jsx';
import RolePanel from './RolePanel.jsx';
import { deleteCustomRole } from '../../api/client.js';
import { groupRoles, readApiErrors } from '../../data/team.js';

// "Rôles et permissions": the predefined roles and the merchant's own, with what each allows;
// custom roles can be created (from scratch or from a copy), changed and deleted when unused.
export default function RolesTab({ options, onNotice, onRolesChanged }) {
  const [openKey, setOpenKey] = useState(null);
  const [panel, setPanel] = useState(null); // { role } | { copyOf } | { create: true }
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const canManage = options.me.canManage;
  const groups = groupRoles(options.roles, options.roleGroups);
  const labelOf = (key) => options.permissions.find((p) => p.key === key)?.label ?? key;

  const remove = async () => {
    setBusy(true);
    try {
      await deleteCustomRole(deleting.id);
      onNotice(`Rôle « ${deleting.name} » supprimé.`);
      onRolesChanged();
    } catch (err) {
      onNotice(readApiErrors(err).message, 'error');
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  return (
    <div className="team-roles">
      <div className="team-toolbar">
        <p className="team-roles__intro">
          Donnez à chacun l’accès dont il a besoin. Un membre peut avoir plusieurs rôles ; ses équipes en ajoutent sur leur compte.
        </p>
        <span className="team-toolbar__spacer" />
        {canManage && (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setPanel({ create: true })}>
            <Icon name="plus" size={14} /> Créer un rôle
          </button>
        )}
      </div>

      {groups.map((group) => (
        <section key={group.key} className="role-group">
          <h3>{group.label}</h3>
          {group.roles.map((role) => {
            const open = openKey === role.key;
            return (
              <article key={role.key} className={`role-card${open ? ' is-open' : ''}`}>
                <button type="button" className="role-card__head" onClick={() => setOpenKey(open ? null : role.key)} aria-expanded={open}>
                  <span className="role-card__title">
                    <strong>{role.name}</strong>
                    {role.description && <small>{role.description}</small>}
                  </span>
                  <span className="role-card__count">{role.permissions.length} permissions</span>
                  <Icon name={open ? 'chevronDown' : 'chevronRight'} size={16} />
                </button>
                {open && (
                  <div className="role-card__body">
                    <div className="role-card__permissions">
                      {Object.entries(options.permissionGroups).map(([key, label]) => {
                        const list = options.permissions.filter((p) => p.group === key);
                        return (
                          <div key={key}>
                            <h4>{label}</h4>
                            <ul>
                              {list.map((p) => (
                                <li key={p.key} className={role.permissions.includes(p.key) ? 'is-granted' : undefined}>
                                  <Icon name={role.permissions.includes(p.key) ? 'check' : 'close'} size={12} /> {labelOf(p.key)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    {canManage && (
                      <div className="role-card__actions">
                        {role.custom ? (
                          <>
                            <button type="button" className="btn btn--outline btn--sm" onClick={() => setPanel({ role })}>
                              <Icon name="edit" size={14} /> Modifier
                            </button>
                            <button type="button" className="btn btn--ghost btn--sm team-card__delete" onClick={() => setDeleting(role)}>
                              <Icon name="trash" size={14} /> Supprimer
                            </button>
                          </>
                        ) : (
                          role.key !== 'super_admin' && (
                            <button type="button" className="btn btn--outline btn--sm" onClick={() => setPanel({ copyOf: role })}>
                              <Icon name="copy" size={14} /> Personnaliser une copie
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      ))}

      {panel && (
        <RolePanel
          options={options}
          role={panel.role ?? null}
          copyOf={panel.copyOf ?? null}
          onClose={() => setPanel(null)}
          onSaved={(_, text) => {
            setPanel(null);
            onNotice(text);
            onRolesChanged();
          }}
        />
      )}
      {deleting && (
        <AlertDialog
          variant="error"
          title="Supprimer ce rôle ?"
          message={`« ${deleting.name} » ne pourra plus être attribué. Il doit d’abord être retiré des membres et des équipes qui l’ont.`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          busy={busy}
          onConfirm={remove}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
