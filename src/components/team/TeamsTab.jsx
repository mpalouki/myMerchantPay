import { useCallback, useEffect, useState } from 'react';
import Icon from '../Icon.jsx';
import Flag from '../Flag.jsx';
import AlertDialog from '../AlertDialog.jsx';
import TeamPanel from './TeamPanel.jsx';
import { deleteTeam, getTeams } from '../../api/client.js';
import { readApiErrors } from '../../data/team.js';
import { useAccount } from '../../context/AccountContext.jsx';

// "Équipes": the teams of one account (the dashboard's, or any), each giving its roles on that
// account to its members.
export default function TeamsTab({ options, onNotice, onTeamsChanged }) {
  const { selectedBalance } = useAccount();
  const [accountId, setAccountId] = useState(selectedBalance?.id ?? '');
  const [teams, setTeams] = useState(null);
  const [error, setError] = useState('');
  const [panel, setPanel] = useState(null); // { team } | { create: true }
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const canManage = options.me.canManage;

  const load = useCallback(() => {
    getTeams(accountId || undefined)
      .then((result) => {
        setTeams(result);
        setError('');
      })
      .catch((err) => setError(readApiErrors(err).message));
  }, [accountId]);

  useEffect(() => load(), [load]);

  const remove = async () => {
    setBusy(true);
    try {
      await deleteTeam(deleting.id);
      onNotice(`Équipe « ${deleting.name} » supprimée.`);
      onTeamsChanged();
      load();
    } catch (err) {
      onNotice(readApiErrors(err).message, 'error');
    } finally {
      setBusy(false);
      setDeleting(null);
    }
  };

  return (
    <div className="team-teams">
      <div className="team-toolbar">
        <select value={accountId} onChange={(e) => setAccountId(e.target.value ? Number(e.target.value) : '')} aria-label="Compte">
          <option value="">Tous les comptes</option>
          {options.accounts.map((a) => (
            <option key={a.id} value={a.id}>
              {a.country} · {a.accountNumberFormatted}
            </option>
          ))}
        </select>
        <span className="team-toolbar__spacer" />
        {canManage && (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setPanel({ create: true })}>
            <Icon name="plus" size={14} /> Créer une équipe
          </button>
        )}
      </div>

      {error && <div className="toast-inline toast-inline--error">{error}</div>}
      {teams && teams.length === 0 && (
        <div className="team-empty">
          <Icon name="users" size={28} />
          <h3>Aucune équipe {accountId ? 'sur ce compte' : ''}</h3>
          <p>Regroupez des membres sur un compte (par exemple « Finance Togo ») pour leur donner les mêmes rôles en une fois.</p>
        </div>
      )}

      <div className="team-cards">
        {teams?.map((team) => (
          <article key={team.id} className="team-card">
            <header>
              <h3>{team.name}</h3>
              <span className="team-card__account">
                <Flag code={team.account.countryCode} /> {team.account.country}
              </span>
            </header>
            {team.description && <p className="team-card__description">{team.description}</p>}
            <div className="team-chips">
              {team.roles.length > 0 ? (
                team.roles.map((r) => (
                  <span key={r.key} className={`team-chip${r.custom ? ' team-chip--custom' : ''}`}>
                    {r.name}
                  </span>
                ))
              ) : (
                <span className="team-muted">Aucun rôle : l’équipe ne donne aucun accès.</span>
              )}
            </div>
            <div className="team-card__members">
              <div className="team-card__avatars" aria-hidden="true">
                {team.members.slice(0, 5).map((m) => (
                  <span key={m.id} className="team-avatar team-avatar--sm" title={m.email}>
                    {(m.name || m.email).slice(0, 1).toUpperCase()}
                  </span>
                ))}
              </div>
              <span>
                {team.members.length} membre{team.members.length > 1 ? 's' : ''}
              </span>
            </div>
            <footer>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => setPanel({ team })}>
                {canManage ? 'Modifier' : 'Voir'}
              </button>
              {canManage && (
                <button type="button" className="btn btn--ghost btn--sm team-card__delete" onClick={() => setDeleting(team)}>
                  <Icon name="trash" size={14} /> Supprimer
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>

      {panel && (
        <TeamPanel
          options={options}
          team={panel.team ?? null}
          defaultAccountId={accountId || selectedBalance?.id}
          onClose={() => setPanel(null)}
          onSaved={(_, text) => {
            setPanel(null);
            onNotice(text);
            onTeamsChanged();
            load();
          }}
        />
      )}
      {deleting && (
        <AlertDialog
          variant="error"
          title="Supprimer cette équipe ?"
          message={`Les ${deleting.members.length} membre(s) de « ${deleting.name} » perdront les rôles qu’elle leur donnait sur le compte ${deleting.account.country}. Ils restent dans l’équipe de l’entreprise.`}
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
