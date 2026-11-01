import { useState } from 'react';
import Modal from '../Modal.jsx';
import usePanelErrors, { firstError } from './usePanelErrors.js';
import Flag from '../Flag.jsx';
import EmailTagsInput from '../EmailTagsInput.jsx';
import RolePicker from './RolePicker.jsx';
import AccountsPicker from './AccountsPicker.jsx';
import AccessSummary from './AccessSummary.jsx';
import { inviteTeamMembers, updateTeamMember } from '../../api/client.js';
import { MAX_INVITES, MEMBER_STATUSES, readApiErrors } from '../../data/team.js';

// Side sheet to invite people ("Ajouter un membre", several emails with the same access) or to
// change a member's name, roles, accounts and teams. Read-only when the member can't be changed
// by the viewer (themselves, the owner's roles, a super administrator).
export default function MemberPanel({ options, member, onClose, onSaved }) {
  const inviting = !member;
  const readOnly = !inviting && !member.editable;
  const [emails, setEmails] = useState([]);
  const [name, setName] = useState(member?.name ?? '');
  const [roles, setRoles] = useState(member ? member.roles.map((r) => r.key) : []);
  const [scope, setScope] = useState({
    allAccounts: member?.allAccounts ?? false,
    accounts: member?.accounts.map((a) => a.id) ?? [],
  });
  const [teams, setTeams] = useState(member?.teams.map((t) => t.id) ?? []);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const formRef = usePanelErrors(errors, message);

  // Per-address errors come back keyed by position (emails.0…): name the address.
  const rejectedEmails = Object.keys(errors)
    .filter((key) => key.startsWith('emails.'))
    .map((key) => emails[Number(key.split('.')[1])])
    .filter(Boolean);
  const emailErrors = Object.entries(errors)
    .filter(([key]) => key.startsWith('emails.'))
    .map(([key, text]) => `${emails[Number(key.split('.')[1])] ?? ''} : ${text}`);
  const footerError = emailErrors[0] ?? firstError(errors, message);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');
    const body = { roles, allAccounts: scope.allAccounts, accounts: scope.allAccounts ? [] : scope.accounts, teams, name: name.trim() || null };
    try {
      if (inviting) {
        const result = await inviteTeamMembers({ ...body, emails, name: emails.length === 1 ? body.name : null });
        onSaved(result.items, result.items.length > 1 ? `${result.items.length} invitations envoyées.` : `Invitation envoyée à ${result.items[0].email}.`);
      } else {
        onSaved(await updateTeamMember(member.id, body), 'Accès enregistrés.');
      }
    } catch (err) {
      const { fields, message: text } = readApiErrors(err);
      if (fields) setErrors(fields);
      else setMessage(text);
    } finally {
      setBusy(false);
    }
  };

  const status = member && MEMBER_STATUSES[member.status];
  const teamsByAccount = options.accounts
    .map((account) => ({ account, teams: options.teams.filter((t) => t.account.id === account.id) }))
    .filter((g) => g.teams.length > 0);

  return (
    <Modal size="drawer" title={inviting ? 'Ajouter un membre' : member.name || member.email} onClose={onClose}>
      <form ref={formRef} className="team-panel" onSubmit={submit} noValidate>
        {!inviting && (
          <div className="team-panel__identity">
            <span>{member.email}</span>
            <span className={`badge badge--${status.tone}`}>{status.label}</span>
            {member.owner && <span className="badge badge--info">Titulaire</span>}
            {member.you && <span className="badge">Vous</span>}
          </div>
        )}
        {readOnly && (
          <p className="team-panel__notice">
            {member.you
              ? 'Vous ne pouvez pas modifier vos propres accès : demandez à un autre administrateur.'
              : 'Seul un super administrateur peut modifier les accès de ce membre.'}
          </p>
        )}
        {message && <div className="toast-inline toast-inline--error">{message}</div>}

        {inviting ? (
          <section className="team-panel__section">
            <label className="team-panel__label" htmlFor="invite-emails">
              Adresses e-mail des membres de l’équipe
            </label>
            <EmailTagsInput
              id="invite-emails"
              value={emails}
              onChange={(list) => {
                setEmails(list.slice(0, MAX_INVITES));
                // Errors are keyed by position: they no longer match once the list changes.
                setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => !key.startsWith('emails'))));
              }}
              invalid={!!errors.emails || emailErrors.length > 0}
              rejected={rejectedEmails}
            />
            <small className="team-panel__hint">Jusqu’à {MAX_INVITES} personnes, qui recevront chacune un lien d’invitation valable 7 jours.</small>
            {errors.emails && <small className="field__error">{errors.emails}</small>}
            {emailErrors.map((text) => (
              <small key={text} className="field__error">
                {text}
              </small>
            ))}
            {emails.length <= 1 && (
              <label className="field field--stacked team-panel__name">
                <span>Nom (facultatif)</span>
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="Par exemple : Ama Mensah" />
                {errors.name && <small className="field__error">{errors.name}</small>}
              </label>
            )}
          </section>
        ) : (
          <label className="field field--stacked team-panel__section">
            <span>Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} disabled={readOnly} />
            {errors.name && <small className="field__error">{errors.name}</small>}
          </label>
        )}

        <section className="team-panel__section">
          <h3 className="team-panel__label">Rôles</h3>
          <small className="team-panel__hint">Ses propres rôles, sur les comptes choisis plus bas. Ses équipes en ajoutent sur leur compte.</small>
          <RolePicker
            options={options}
            value={roles}
            onChange={setRoles}
            canGiveSuperAdmin={options.me.superAdmin}
            lockedKeys={member?.owner ? ['super_admin'] : readOnly ? options.roles.map((r) => r.key) : []}
            invalid={!!errors.roles}
          />
          {errors.roles && <small className="field__error">{errors.roles}</small>}
        </section>

        <section className="team-panel__section">
          <h3 className="team-panel__label">Comptes</h3>
          <AccountsPicker accounts={options.accounts} value={scope} onChange={setScope} disabled={readOnly || member?.owner} invalid={!!errors.accounts} />
          {errors.accounts && <small className="field__error">{errors.accounts}</small>}
        </section>

        {teamsByAccount.length > 0 && (
          <section className="team-panel__section">
            <h3 className="team-panel__label">Équipes</h3>
            <small className="team-panel__hint">Chaque équipe donne ses rôles sur son compte.</small>
            <div className="team-panel__teams">
              {teamsByAccount.map(({ account, teams: accountTeams }) => (
                <div key={account.id} className="team-panel__team-group">
                  <div className="team-panel__team-account">
                    <Flag code={account.countryCode} /> {account.country}
                  </div>
                  {accountTeams.map((team) => (
                    <label key={team.id} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={teams.includes(team.id)}
                        disabled={readOnly}
                        onChange={() => setTeams(teams.includes(team.id) ? teams.filter((t) => t !== team.id) : [...teams, team.id])}
                      />
                      {team.name}
                    </label>
                  ))}
                </div>
              ))}
            </div>
            {errors.teams && <small className="field__error">{errors.teams}</small>}
          </section>
        )}

        {!inviting && (
          <section className="team-panel__section">
            <h3 className="team-panel__label">Accès effectifs</h3>
            <small className="team-panel__hint">Ce que ses rôles et ses équipes lui permettent, tel qu’enregistré.</small>
            <AccessSummary access={member.access} options={options} />
          </section>
        )}

        <div className="team-panel__footer">
          {footerError && (
            <span className="team-panel__footer-error" role="alert">
              {footerError}
            </span>
          )}
          <button type="button" className="btn btn--outline" onClick={onClose}>
            {readOnly ? 'Fermer' : 'Annuler'}
          </button>
          {!readOnly && (
            <button type="submit" className="btn btn--primary" disabled={busy || (inviting && emails.length === 0)}>
              {busy ? '…' : inviting ? (emails.length > 1 ? `Envoyer ${emails.length} invitations` : 'Envoyer l’invitation') : 'Enregistrer'}
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
