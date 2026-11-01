import { useEffect, useState } from 'react';
import Modal from '../Modal.jsx';
import usePanelErrors, { firstError } from './usePanelErrors.js';
import RolePicker from './RolePicker.jsx';
import { createTeam, getTeamMembers, updateTeam } from '../../api/client.js';
import { MEMBER_STATUSES, accountLabel, readApiErrors } from '../../data/team.js';

// Side sheet to create a team on one account (fixed once created) or change it: name,
// description, the roles it gives on its account, and its members.
export default function TeamPanel({ options, team, defaultAccountId, onClose, onSaved }) {
  const creating = !team;
  const [balance, setBalance] = useState(team?.account.id ?? defaultAccountId ?? options.accounts[0]?.id ?? '');
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [roles, setRoles] = useState(team?.roles.map((r) => r.key) ?? []);
  const [memberIds, setMemberIds] = useState(team?.members.map((m) => m.id) ?? []);
  const [members, setMembers] = useState(null);
  const [query, setQuery] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const formRef = usePanelErrors(errors, message);
  const footerError = firstError(errors, message);

  useEffect(() => {
    getTeamMembers({ limit: 100 })
      .then((result) => setMembers(result.items))
      .catch((err) => setMessage(readApiErrors(err).message));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    const body = { name, description: description.trim() || null, roles, members: memberIds };
    try {
      const saved = creating ? await createTeam({ ...body, balance: Number(balance) }) : await updateTeam(team.id, body);
      onSaved(saved, creating ? `Équipe « ${saved.name} » créée.` : 'Équipe enregistrée.');
    } catch (err) {
      const { fields, message: text } = readApiErrors(err);
      if (fields) setErrors(fields);
      else setMessage(text);
    } finally {
      setBusy(false);
    }
  };

  const q = query.trim().toLowerCase();
  const shown = (members ?? []).filter((m) => !q || m.email.includes(q) || (m.name ?? '').toLowerCase().includes(q));

  return (
    <Modal size="drawer" title={creating ? 'Créer une équipe' : `Équipe « ${team.name} »`} onClose={onClose}>
      <form ref={formRef} className="team-panel" onSubmit={submit} noValidate>
        {message && <div className="toast-inline toast-inline--error">{message}</div>}

        <label className="field field--stacked team-panel__section">
          <span>Compte</span>
          <select value={balance} onChange={(e) => setBalance(e.target.value)} disabled={!creating}>
            {options.accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {accountLabel(a)}
              </option>
            ))}
          </select>
          <small>{creating ? 'Les rôles de l’équipe s’appliquent sur ce compte uniquement.' : 'Le compte d’une équipe ne change pas.'}</small>
          {errors.balance && <small className="field__error">{errors.balance}</small>}
        </label>

        <label className="field field--stacked team-panel__section">
          <span>Nom de l’équipe</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={60} placeholder="Par exemple : Finance Togo" aria-invalid={!!errors.name} />
          {errors.name && <small className="field__error">{errors.name}</small>}
        </label>

        <label className="field field--stacked team-panel__section">
          <span>Description (facultative)</span>
          <input value={description} onChange={(e) => setDescription(e.target.value)} maxLength={255} />
          {errors.description && <small className="field__error">{errors.description}</small>}
        </label>

        <section className="team-panel__section">
          <h3 className="team-panel__label">Rôles de l’équipe</h3>
          <RolePicker options={options} value={roles} onChange={setRoles} forTeam invalid={!!errors.roles} />
          {errors.roles && <small className="field__error">{errors.roles}</small>}
        </section>

        <section className="team-panel__section">
          <h3 className="team-panel__label">
            Membres <small>({memberIds.length})</small>
          </h3>
          <input
            type="search"
            className="role-picker__search"
            placeholder="Rechercher un membre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un membre"
          />
          <div className="team-panel__members">
            {members === null && <p className="team-muted">Chargement…</p>}
            {shown.map((m) => (
              <label key={m.id} className="team-panel__member">
                <input
                  type="checkbox"
                  checked={memberIds.includes(m.id)}
                  onChange={() => setMemberIds(memberIds.includes(m.id) ? memberIds.filter((id) => id !== m.id) : [...memberIds, m.id])}
                />
                <span>
                  {m.name || m.email}
                  {m.name && <small>{m.email}</small>}
                </span>
                {m.status !== 'active' && <span className={`badge badge--${MEMBER_STATUSES[m.status].tone}`}>{MEMBER_STATUSES[m.status].label}</span>}
              </label>
            ))}
          </div>
          <small className="team-panel__hint">Pour inviter quelqu’un de nouveau, utilisez « Ajouter un membre » dans l’onglet Membres.</small>
          {errors.members && <small className="field__error">{errors.members}</small>}
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
            {busy ? '…' : creating ? 'Créer l’équipe' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
