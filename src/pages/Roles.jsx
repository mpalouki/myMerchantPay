import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { DeleteTeamDialog, MemberDialog, TeamDetailsDialog, TeamFormDialog } from '../components/TeamDialogs.jsx';
import {
  addTeamMember,
  createTeam as createTeamRequest,
  deleteTeam as deleteTeamRequest,
  getTeamOptions,
  getTeams,
  removeTeamMember,
  updateTeam,
} from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { readApiErrors } from '../data/teams.js';

// "Gestion des rôles" (design: roles-management.pdf): the teams of the account selected in
// the dashboard (useAccount().selectedBalance), each with a habilitation, a list of accesses
// and member emails — /api/merchant/teams. Dialogs await the API calls below and show their
// errors; the page replaces the team with the API's answer on success.

const PAGE_SIZES = [5, 10, 25];
const VISIBLE_ACCESSES = 2;

// Column key => value to sort on.
const SORTERS = {
  name: (t) => t.name.toLowerCase(),
  accesses: (t) => t.access.length,
  members: (t) => t.activeMembers,
  status: (t) => (t.status ? 0 : 1),
};

export default function Roles() {
  const { token } = useAuth();
  const { selectedBalance, loading: accountsLoading, error: accountsError } = useAccount();
  const balanceId = selectedBalance?.id;
  const [options, setOptions] = useState(null);
  // null while loading.
  const [teams, setTeams] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key: 'name', dir: 1 });
  // { type: 'create' | 'edit' | 'member' | 'details' | 'delete', teamId? }
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;
    getTeamOptions(token)
      .then((data) => !cancelled && setOptions(data))
      .catch((err) => !cancelled && setLoadError(readApiErrors(err).message));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const loadTeams = useCallback(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getTeams(token, balanceId)
      .then((data) => {
        if (cancelled) return;
        setTeams(Array.isArray(data) ? data : []);
        setLoadError('');
      })
      .catch((err) => !cancelled && setLoadError(readApiErrors(err).message));
    return () => {
      cancelled = true;
    };
  }, [token, balanceId]);

  // Reloads when the account selected in the dashboard changes. The previous account's teams
  // stay on screen until the new ones arrive (the header names the account they belong to).
  useEffect(() => loadTeams(), [loadTeams]);

  const permissionLabel = useCallback(
    (reference) => options?.permissions.find((p) => p.reference === reference)?.label ?? reference,
    [options],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = (t) =>
      [t.name, t.habilitation.name, ...t.access.map(permissionLabel), ...t.members.map((m) => m.email), t.status ? 'actif' : 'inactif']
        .join(' ')
        .toLowerCase()
        .includes(q);
    const list = q ? (teams ?? []).filter(matches) : (teams ?? []);
    const by = SORTERS[sort.key];
    return [...list].sort((a, b) => (by(a) > by(b) ? sort.dir : by(a) < by(b) ? -sort.dir : 0));
  }, [teams, query, sort, permissionLabel]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const dialogTeam = dialog?.teamId ? teams?.find((t) => t.id === dialog.teamId) : null;
  const close = () => setDialog(null);
  const done = (message) => {
    setDialog(null);
    setNotice(message);
  };
  // Puts the API's version of a team in the list.
  const replaceTeam = (team) => setTeams((list) => list.map((t) => (t.id === team.id ? team : t)));

  // The handlers below throw on API errors: the open dialog catches and shows them.
  const createTeam = async ({ name, habilitation, emails, access }) => {
    const team = await createTeamRequest(token, { balance: balanceId, name, habilitation, access, emails });
    setTeams((list) => [...list, team]);
    done(`Équipe « ${team.name} » créée avec ${team.members.length} membre(s) en attente d'invitation.`);
  };

  const editTeam = async (values) => {
    const team = await updateTeam(token, dialogTeam.id, values);
    replaceTeam(team);
    done(`Équipe « ${team.name} » modifiée.`);
  };

  const addMember = async (email) => {
    const team = await addTeamMember(token, dialogTeam.id, email);
    replaceTeam(team);
    done(`${email} a été ajouté à l'équipe « ${team.name} » (invitation en attente).`);
  };

  const removeMember = async (member) => {
    const team = await removeTeamMember(token, dialogTeam.id, member.id);
    replaceTeam(team);
    setNotice(`${member.email} a été retiré de l'équipe « ${team.name} ».`);
  };

  const deleteTeam = async () => {
    await deleteTeamRequest(token, dialogTeam.id);
    setTeams((list) => list.filter((t) => t.id !== dialogTeam.id));
    done(`Équipe « ${dialogTeam.name} » supprimée.`);
  };

  const sortBy = (key) => setSort((s) => ({ key, dir: s.key === key ? -s.dir : 1 }));
  const sortHeader = (key, label) => (
    <th aria-sort={sort.key === key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="data-table__sort" onClick={() => sortBy(key)}>
        {label}
        <span className={`data-table__sort-icon ${sort.key === key ? 'is-active' : ''}`} aria-hidden="true">
          {sort.key === key && sort.dir === -1 ? '▼' : '▲'}
        </span>
      </button>
    </th>
  );

  const takenNames = (exceptId) => (teams ?? []).filter((t) => t.id !== exceptId).map((t) => t.name.toLowerCase());
  const ready = !!options && !!balanceId && teams !== null;
  const noAccount = !accountsLoading && !selectedBalance;

  return (
    <div className="roles-page">
      <div className="card">
        <div className="card__header">
          <Icon name="settings" size={16} className="card__header-icon" /> Gestion des équipes
        </div>
        <div className="card__body roles-page__intro">
          <p>Créer une nouvelle équipe.</p>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setDialog({ type: 'create' })}
            disabled={!ready}
          >
            Créer une nouvelle équipe
          </button>
        </div>
      </div>

      {notice && (
        <div className="toast-inline roles-page__notice" role="status">
          {notice}
          <button type="button" className="icon-btn" onClick={() => setNotice('')} aria-label="Fermer le message">
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <div className="card">
        <div className="card__header">
          Mes équipes
          {selectedBalance && (
            <div className="card__subheader">
              Compte {selectedBalance.country.name} — {selectedBalance.accountNumberFormatted}. Changez de compte
              depuis le tableau de bord.
            </div>
          )}
        </div>
        <div className="card__body">
          <div className="table-toolbar">
            <label className="table-toolbar__pagesize">
              Afficher par
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entrées
            </label>
            <label className="table-toolbar__search">
              Rechercher:
              <input
                type="search"
                placeholder="Mot clé"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </label>
          </div>

          <div className="table-scroll">
            <table className="data-table data-table--bordered roles-table">
              <thead>
                <tr>
                  {sortHeader('name', "Nom de l'équipe")}
                  {sortHeader('accesses', 'Liste des accès')}
                  {sortHeader('members', 'Actif(s)')}
                  {sortHeader('status', 'Statut')}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadError || accountsError || noAccount || teams === null ? (
                  <tr>
                    <td colSpan={5} className="data-table__empty">
                      {loadError || accountsError
                        ? `Impossible de charger les équipes : ${loadError || readApiErrors(accountsError).message}`
                        : noAccount
                          ? "Aucun compte n'est disponible pour ce marchand."
                          : 'Chargement des équipes…'}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="data-table__empty">
                      {query ? 'Aucune équipe ne correspond à votre recherche.' : "Vous n'avez pas encore créé d'équipe sur ce compte."}
                    </td>
                  </tr>
                ) : (
                  rows.map((team) => {
                    const hidden = team.access.length - VISIBLE_ACCESSES;
                    return (
                      <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>
                          {team.access.slice(0, VISIBLE_ACCESSES).map(permissionLabel).join('; ')}
                          {hidden > 0 && (
                            <>
                              {' '}
                              <button
                                type="button"
                                className="link-btn roles-table__more"
                                onClick={() => setDialog({ type: 'details', teamId: team.id })}
                              >
                                et {hidden} autre{hidden > 1 ? 's' : ''}
                              </button>
                            </>
                          )}
                        </td>
                        <td>
                          {team.activeMembers}/{team.members.length}
                        </td>
                        <td>
                          <span className={`badge badge--${team.status ? 'success' : 'danger'}`}>
                            {team.status ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td>
                          <div className="roles-table__actions">
                            <button
                              type="button"
                              className="icon-btn icon-btn--info"
                              onClick={() => setDialog({ type: 'details', teamId: team.id })}
                              aria-label={`Détails de l'équipe ${team.name}`}
                              title="Détails"
                            >
                              <Icon name="info" size={17} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => setDialog({ type: 'edit', teamId: team.id })}
                              aria-label={`Modifier l'équipe ${team.name}`}
                              title="Modifier"
                            >
                              <Icon name="edit" size={16} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn"
                              onClick={() => setDialog({ type: 'member', teamId: team.id })}
                              aria-label={`Ajouter un collaborateur à l'équipe ${team.name}`}
                              title="Ajouter un collaborateur"
                            >
                              <Icon name="plus" size={17} />
                            </button>
                            <button
                              type="button"
                              className="icon-btn icon-btn--danger"
                              onClick={() => setDialog({ type: 'delete', teamId: team.id })}
                              aria-label={`Supprimer l'équipe ${team.name}`}
                              title="Supprimer"
                            >
                              <Icon name="trash" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            Page {currentPage} sur {pageCount}
            <div className="table-pagination">
              <button type="button" onClick={() => setPage(currentPage - 1)} disabled={currentPage === 1} aria-label="Page précédente">
                &laquo;
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  className={n === currentPage ? 'is-active' : undefined}
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button type="button" onClick={() => setPage(currentPage + 1)} disabled={currentPage === pageCount} aria-label="Page suivante">
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div>

      {dialog?.type === 'create' && options && (
        <TeamFormDialog
          profiles={options.profiles}
          permissions={options.permissions}
          takenNames={takenNames()}
          onSubmit={createTeam}
          onClose={close}
        />
      )}
      {dialog?.type === 'edit' && dialogTeam && options && (
        <TeamFormDialog
          team={dialogTeam}
          profiles={options.profiles}
          permissions={options.permissions}
          takenNames={takenNames(dialogTeam.id)}
          onSubmit={editTeam}
          onClose={close}
        />
      )}
      {dialog?.type === 'member' && dialogTeam && <MemberDialog team={dialogTeam} onSubmit={addMember} onClose={close} />}
      {dialog?.type === 'details' && dialogTeam && (
        <TeamDetailsDialog
          team={dialogTeam}
          permissions={options?.permissions ?? []}
          onRemoveMember={removeMember}
          onClose={close}
        />
      )}
      {dialog?.type === 'delete' && dialogTeam && (
        <DeleteTeamDialog team={dialogTeam} onConfirm={deleteTeam} onClose={close} />
      )}
    </div>
  );
}
