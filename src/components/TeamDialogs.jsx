import { useState } from 'react';
import Modal from './Modal.jsx';
import EmailTagsInput from './EmailTagsInput.jsx';
import Icon from './Icon.jsx';
import { ACCESS_TYPE_HINTS, EMAIL_PATTERN, MEMBER_STATUSES, TEAM_NAME_MAX_LENGTH, readApiErrors } from '../data/teams.js';

// Dialogs of the "Gestion des rôles" page (pages/Roles.jsx). Each validates its form, then
// awaits its async `onSubmit` / `onConfirm` (an API call made by the page): on failure the
// dialog stays open and shows the server's errors, on success the page closes it.
// `profiles` / `permissions` come from getTeamOptions().

// The API answers in English, keyed by body field: show French, per field.
function teamFieldErrors(fields) {
  const errors = {};
  if (fields.name)
    errors.name = /already exists/i.test(fields.name)
      ? 'Une équipe porte déjà ce nom sur ce compte.'
      : `Veuillez saisir un nom de ${TEAM_NAME_MAX_LENGTH} caractères maximum.`;
  if (fields.habilitation) errors.habilitation = 'Veuillez choisir une habilitation.';
  if (fields.access) errors.access = 'Sélectionnez au moins un accès valide.';
  if (fields.emails) errors.emails = `Vérifiez les adresses des membres (${fields.emails}).`;
  if (fields.status) errors.form = 'Statut invalide.';
  if (fields.balance) errors.form = 'Ce compte est introuvable. Rechargez la page.';
  return errors;
}

function FormError({ message }) {
  return message ? (
    <div className="toast-inline toast-inline--error" role="alert">
      {message}
    </div>
  ) : null;
}

// "Création d'une équipe" — or its edit, when `team` is given. `takenNames` holds the other
// teams' names (lower case). onSubmit({ name, habilitation, emails, access, status })
export function TeamFormDialog({ team, profiles, permissions, takenNames, onSubmit, onClose }) {
  const editing = !!team;
  const [name, setName] = useState(team?.name ?? '');
  const [habilitation, setHabilitation] = useState(team ? String(team.habilitation.id) : '');
  const [emails, setEmails] = useState(team?.members.map((m) => m.email) ?? []);
  const [access, setAccess] = useState(team?.access ?? []);
  const [active, setActive] = useState(team ? team.status : true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const profile = profiles.find((p) => String(p.id) === habilitation);
  const toggleAccess = (reference) =>
    setAccess((list) => (list.includes(reference) ? list.filter((r) => r !== reference) : [...list, reference]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    const trimmed = name.trim();
    if (!trimmed) next.name = "Veuillez saisir le nom de l'équipe.";
    else if (takenNames.includes(trimmed.toLowerCase())) next.name = 'Une équipe porte déjà ce nom sur ce compte.';
    if (!habilitation) next.habilitation = 'Veuillez choisir une habilitation.';
    if (emails.length === 0) next.emails = "Ajoutez l'email d'au moins un membre.";
    if (access.length === 0) next.access = 'Sélectionnez au moins un accès.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: trimmed,
        habilitation: Number(habilitation),
        emails,
        access,
        status: active,
      });
    } catch (err) {
      const { fields, message } = readApiErrors(err);
      setErrors(fields ? teamFieldErrors(fields) : { form: message });
      setSubmitting(false);
    }
  };

  return (
    <Modal title={editing ? "Modification de l'équipe" : "Création d'une équipe"} onClose={onClose}>
      <form className="team-form" onSubmit={handleSubmit} noValidate>
        <fieldset className="team-form__fields" disabled={submitting}>
          <label className="field field--stacked">
            <span>
              Nom de l&apos;équipe <em className="required">*</em>
            </span>
            <input
              value={name}
              maxLength={TEAM_NAME_MAX_LENGTH}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
            />
            <small className="team-form__counter">
              {name.length}/{TEAM_NAME_MAX_LENGTH}
            </small>
            {errors.name && <small className="field__error">{errors.name}</small>}
          </label>

          <label className="field field--stacked">
            <span>
              Habilitation <em className="required">*</em>
            </span>
            <select
              value={habilitation}
              onChange={(e) => setHabilitation(e.target.value)}
              aria-invalid={!!errors.habilitation}
            >
              <option value="">-----------</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {errors.habilitation ? (
              <small className="field__error">{errors.habilitation}</small>
            ) : (
              profile && <small>{ACCESS_TYPE_HINTS[profile.accessType]}</small>
            )}
          </label>

          <div className="field field--stacked">
            <label htmlFor="team-emails">
              <span>
                Email des membres de l&apos;équipe <em className="required">*</em>
              </span>
            </label>
            <EmailTagsInput
              id="team-emails"
              value={emails}
              onChange={setEmails}
              invalid={!!errors.emails}
              disabled={submitting}
            />
            {errors.emails && <small className="field__error">{errors.emails}</small>}
            <small>
              {editing ? 'Les nouveaux membres' : 'Chaque membre'} reçoit un email d&apos;invitation pour rejoindre
              l&apos;équipe.
            </small>
          </div>

          <fieldset className="team-form__accesses">
            <legend>
              Liste des accès <em className="required">*</em>
            </legend>
            <div className="team-form__access-grid">
              {permissions.map((p) => (
                <label key={p.reference} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={access.includes(p.reference)}
                    onChange={() => toggleAccess(p.reference)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
            {errors.access && <small className="field__error">{errors.access}</small>}
          </fieldset>

          {editing && (
            <label className="checkbox-row">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
              <span>Équipe active (décochez pour suspendre les accès de ses membres)</span>
            </label>
          )}
        </fieldset>

        <FormError message={errors.form} />

        <div className="modal__actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// "Nouveau Collaborateur": adds one member to `team`. onSubmit(email)
export function MemberDialog({ team, onSubmit, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(value)) return setError('Veuillez saisir une adresse électronique valide.');
    if (team.members.some((m) => m.email === value)) return setError('Cette personne fait déjà partie de l’équipe.');

    setSubmitting(true);
    try {
      await onSubmit(value);
    } catch (err) {
      const { fields, message } = readApiErrors(err);
      setError(
        fields?.email
          ? /already a member/i.test(fields.email)
            ? 'Cette personne fait déjà partie de l’équipe.'
            : 'Veuillez saisir une adresse électronique valide.'
          : message,
      );
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Nouveau Collaborateur" onClose={onClose} size="sm">
      <form className="team-form" onSubmit={handleSubmit} noValidate>
        <p className="team-form__hint">
          Équipe <strong>{team.name}</strong> — une invitation à rejoindre l&apos;équipe sera envoyée à cette
          adresse.
        </p>
        <label className="field field--stacked">
          <span>
            Email de l&apos;utilisateur <em className="required">*</em>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            disabled={submitting}
            aria-invalid={!!error}
          />
          {error && <small className="field__error">{error}</small>}
        </label>
        <div className="modal__actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Ajout…' : 'Créer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Details of a team (the "i" action and the "et N autres" link).
// onRemoveMember(member), onResendInvitation(member)
export function TeamDetailsDialog({ team, permissions, onRemoveMember, onResendInvitation, onClose }) {
  // Id of the member being removed or re-invited.
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const label = (reference) => permissions.find((p) => p.reference === reference)?.label ?? reference;

  const run = async (member, action, failure) => {
    setBusy(member.id);
    setError('');
    setSent('');
    try {
      await action(member);
      return true;
    } catch (err) {
      setError(readApiErrors(err).message ?? failure);
      return false;
    } finally {
      setBusy(null);
    }
  };
  const remove = (member) => run(member, onRemoveMember, 'Impossible de retirer ce membre.');
  const resend = async (member) => {
    if (await run(member, onResendInvitation, "Impossible de renvoyer l'invitation.")) {
      setSent(`Invitation renvoyée à ${member.email}.`);
    }
  };

  return (
    <Modal title={`Équipe ${team.name}`} onClose={onClose} size="lg">
      <table className="kv-table team-details__summary">
        <tbody>
          <tr>
            <th>Compte</th>
            <td>
              {team.balance.country.name} — {team.balance.accountNumberFormatted}
            </td>
          </tr>
          <tr>
            <th>Habilitation</th>
            <td>{team.habilitation.name}</td>
          </tr>
          <tr>
            <th>Statut</th>
            <td>
              <span className={`badge badge--${team.status ? 'success' : 'danger'}`}>
                {team.status ? 'Actif' : 'Inactif'}
              </span>
            </td>
          </tr>
          <tr>
            <th>Créée le</th>
            <td>{new Date(team.dateCreation).toLocaleDateString('fr-FR', { dateStyle: 'long' })}</td>
          </tr>
          <tr>
            <th>Liste des accès</th>
            <td>
              <ul className="team-details__accesses">
                {team.access.map((r) => (
                  <li key={r}>{label(r)}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>

      <h3 className="team-details__title">Membres ({team.members.length})</h3>
      <FormError message={error} />
      {sent && (
        <div className="toast-inline" role="status">
          {sent}
        </div>
      )}
      {team.members.length === 0 ? (
        <p className="team-form__hint">Aucun membre pour le moment.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Habilitation</th>
              <th>Statut</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {team.members.map((m) => {
              const status = MEMBER_STATUSES[m.status] ?? { label: m.status, tone: 'info' };
              return (
                <tr key={m.id}>
                  <td>{m.email}</td>
                  <td>{m.habilitation.name}</td>
                  <td>
                    <span className={`badge badge--${status.tone}`}>{status.label}</span>
                  </td>
                  <td className="team-details__remove">
                    {m.status === 'invited' && (
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => resend(m)}
                        disabled={busy !== null}
                        aria-label={`Renvoyer l'invitation à ${m.email}`}
                        title="Renvoyer l'invitation"
                      >
                        <Icon name="send" size={15} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="icon-btn icon-btn--danger"
                      onClick={() => remove(m)}
                      disabled={busy !== null}
                      aria-label={`Retirer ${m.email} de l'équipe`}
                      title="Retirer de l'équipe"
                    >
                      <Icon name="trash" size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </Modal>
  );
}

export function DeleteTeamDialog({ team, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(readApiErrors(err).message ?? "Impossible de supprimer l'équipe.");
      setDeleting(false);
    }
  };

  return (
    <Modal title="Supprimer l'équipe" onClose={onClose} size="sm">
      <p className="team-form__hint">
        Supprimer l&apos;équipe <strong>{team.name}</strong> ? Ses {team.members.length} membre(s) perdront les
        accès qu&apos;elle leur donne. Cette action est irréversible.
      </p>
      <FormError message={error} />
      <div className="modal__actions modal__actions--split">
        <button type="button" className="btn btn--outline" onClick={onClose} disabled={deleting}>
          Annuler
        </button>
        <button type="button" className="btn btn--danger" onClick={confirm} disabled={deleting}>
          {deleting ? 'Suppression…' : 'Supprimer'}
        </button>
      </div>
    </Modal>
  );
}
