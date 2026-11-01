import { useState } from 'react';
import Modal from '../Modal.jsx';
import usePanelErrors, { firstError } from './usePanelErrors.js';
import { createCustomRole, updateCustomRole } from '../../api/client.js';
import { readApiErrors } from '../../data/team.js';

// Side sheet to compose a custom role from permissions (grouped like the portal's sections).
// Checking a permission also checks what it needs (managing implies viewing).
export default function RolePanel({ options, role, copyOf, onClose, onSaved }) {
  const creating = !role;
  const source = role ?? copyOf;
  const [name, setName] = useState(role?.name ?? (copyOf ? `${copyOf.name} (copie)` : ''));
  const [description, setDescription] = useState(source?.description ?? '');
  const [permissions, setPermissions] = useState(source?.permissions ?? []);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const formRef = usePanelErrors(errors, message);
  const footerError = firstError(errors, message);
  const byKey = Object.fromEntries(options.permissions.map((p) => [p.key, p]));

  const toggle = (key) => {
    if (permissions.includes(key)) {
      // Unchecking also drops what needs it.
      const dependents = options.permissions.filter((p) => p.implies.includes(key)).map((p) => p.key);
      setPermissions(permissions.filter((p) => p !== key && !dependents.includes(p)));
    } else {
      setPermissions([...new Set([...permissions, key, ...byKey[key].implies])]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    const body = { name, description: description.trim() || null, permissions };
    try {
      const saved = creating ? await createCustomRole(body) : await updateCustomRole(role.id, body);
      onSaved(saved, creating ? `Rôle « ${saved.name} » créé.` : 'Rôle enregistré : ses membres ont déjà les nouvelles permissions.');
    } catch (err) {
      const { fields, message: text } = readApiErrors(err);
      if (fields) setErrors(fields);
      else setMessage(text);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal size="drawer" title={creating ? 'Créer un rôle personnalisé' : `Rôle « ${role.name} »`} onClose={onClose}>
      <form ref={formRef} className="team-panel" onSubmit={submit} noValidate>
        {message && <div className="toast-inline toast-inline--error">{message}</div>}
        <label className="field field--stacked team-panel__section">
          <span>Nom du rôle</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Par exemple : Caissier" aria-invalid={!!errors.name} />
          {errors.name && <small className="field__error">{errors.name}</small>}
        </label>
        <label className="field field--stacked team-panel__section">
          <span>Description (facultative)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={255} placeholder="À qui s’adresse ce rôle" />
        </label>

        <section className="team-panel__section">
          <h3 className="team-panel__label">
            Permissions <small>({permissions.length})</small>
          </h3>
          <small className="team-panel__hint">
            Les permissions d’un compte s’appliquent sur les comptes où le rôle est donné ; celles de l’équipe et de l’entreprise valent partout.
          </small>
          {Object.entries(options.permissionGroups).map(([group, label]) => (
            <fieldset key={group} className="permission-group">
              <legend>{label}</legend>
              {options.permissions
                .filter((p) => p.group === group)
                .map((p) => (
                  <label key={p.key} className="checkbox-row">
                    <input type="checkbox" checked={permissions.includes(p.key)} onChange={() => toggle(p.key)} />
                    {p.label}
                  </label>
                ))}
            </fieldset>
          ))}
          {errors.permissions && <small className="field__error">{errors.permissions}</small>}
        </section>

        <div className="team-panel__footer">
          {footerError && (
            <span className="team-panel__footer-error" role="alert">
              {footerError}
            </span>
          )}
          <button type="button" className="btn btn--outline" onClick={onClose}>
            Annuler
          </button>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? '…' : creating ? 'Créer le rôle' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
