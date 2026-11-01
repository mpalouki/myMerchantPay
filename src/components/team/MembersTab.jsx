import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../Icon.jsx';
import Flag from '../Flag.jsx';
import AlertDialog from '../AlertDialog.jsx';
import TablePagination from '../TablePagination.jsx';
import MemberPanel from './MemberPanel.jsx';
import {
  deactivateTeamMember,
  getTeamMember,
  getTeamMembers,
  reactivateTeamMember,
  removeTeamMember,
  resendTeamInvitation,
  teamMembersExportUrl,
} from '../../api/client.js';
import { MEMBER_STATUSES, STATUS_TABS, readApiErrors, relativeTime } from '../../data/team.js';

const PAGE_SIZE = 25;

// "Membres": counts per status (tabs), filters, the CSV export, and the members with their
// roles, accounts, teams and last login; each row's menu changes, deactivates or removes them.
export default function MembersTab({ options, onNotice, onTeamsChanged }) {
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('');
  const [team, setTeam] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [panel, setPanel] = useState(null); // { member } | { invite: true }
  const [menu, setMenu] = useState(null);
  const [confirm, setConfirm] = useState(null); // { action, member }
  const [busy, setBusy] = useState(false);
  const canManage = options.me.canManage;

  const load = useCallback(() => {
    let cancelled = false;
    getTeamMembers({ status, q: query.trim(), role, team, page, limit: PAGE_SIZE })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError('');
        }
      })
      .catch((err) => !cancelled && setError(readApiErrors(err).message));
    return () => {
      cancelled = true;
    };
  }, [status, query, role, team, page]);

  useEffect(() => {
    const timer = setTimeout(load, query ? 250 : 0);
    return () => clearTimeout(timer);
  }, [load, query]);

  // A filter change goes back to the first page.
  const filter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const openMember = async (member) => {
    setMenu(null);
    try {
      setPanel({ member: await getTeamMember(member.id) });
    } catch (err) {
      onNotice(readApiErrors(err).message, 'error');
    }
  };

  const run = async (action, member) => {
    setBusy(true);
    try {
      if (action === 'resend') {
        const { emailSent } = await resendTeamInvitation(member.id);
        onNotice(
          emailSent ? `Nouvelle invitation envoyée à ${member.email}.` : 'L’invitation n’a pas pu être envoyée : réessayez plus tard.',
          emailSent ? 'success' : 'error',
        );
      } else if (action === 'deactivate') {
        await deactivateTeamMember(member.id);
        onNotice(`${member.name || member.email} est désactivé : sa connexion est refusée.`);
      } else if (action === 'reactivate') {
        await reactivateTeamMember(member.id);
        onNotice(`${member.name || member.email} est réactivé.`);
      } else if (action === 'remove') {
        await removeTeamMember(member.id);
        onNotice(`${member.name || member.email} a été retiré de l’équipe.`);
        onTeamsChanged();
      }
      load();
    } catch (err) {
      onNotice(readApiErrors(err).message, 'error');
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  };

  const counts = data?.counts ?? {};

  return (
    <div className="team-members">
      <div className="team-status-tabs" role="tablist" aria-label="Statut des membres">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={status === tab.key}
            className={`team-status-tabs__item${status === tab.key ? ' is-active' : ''}`}
            onClick={() => filter(setStatus)(tab.key)}
          >
            <span>{tab.label}</span>
            <strong>{counts[tab.count] ?? '–'}</strong>
          </button>
        ))}
      </div>

      <div className="team-toolbar">
        <input
          type="search"
          className="team-toolbar__search"
          placeholder="Nom ou e-mail"
          value={query}
          onChange={(e) => filter(setQuery)(e.target.value)}
          aria-label="Rechercher un membre"
        />
        <select value={role} onChange={(e) => filter(setRole)(e.target.value)} aria-label="Filtrer par rôle">
          <option value="">Tous les rôles</option>
          {options.roles.map((r) => (
            <option key={r.key} value={r.key}>
              {r.name}
            </option>
          ))}
        </select>
        {options.teams.length > 0 && (
          <select value={team} onChange={(e) => filter(setTeam)(e.target.value)} aria-label="Filtrer par équipe">
            <option value="">Toutes les équipes</option>
            {options.teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.account.countryCode})
              </option>
            ))}
          </select>
        )}
        <span className="team-toolbar__spacer" />
        <a className="btn btn--outline btn--sm" href={teamMembersExportUrl({ status, q: query.trim(), role, team })} download>
          <Icon name="book" size={14} /> Exporter
        </a>
        {canManage && (
          <button type="button" className="btn btn--primary btn--sm" onClick={() => setPanel({ invite: true })}>
            <Icon name="plus" size={14} /> Ajouter un membre
          </button>
        )}
      </div>

      {error && <div className="toast-inline toast-inline--error">{error}</div>}

      <div className="table-scroll">
        <table className="data-table team-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Rôles</th>
              <th>Comptes</th>
              <th>Équipes</th>
              <th>Dernière connexion</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="data-table__empty">
                  Aucun membre ne correspond.
                </td>
              </tr>
            )}
            {!data && !error && (
              <tr>
                <td colSpan={6} className="data-table__empty">
                  Chargement…
                </td>
              </tr>
            )}
            {data?.items.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                canManage={canManage}
                menuOpen={menu === member.id}
                onMenu={() => setMenu(menu === member.id ? null : member.id)}
                onCloseMenu={() => setMenu(null)}
                onOpen={() => openMember(member)}
                onAction={(action) => {
                  setMenu(null);
                  if (action === 'resend' || action === 'reactivate') run(action, member);
                  else setConfirm({ action, member });
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      {data && data.total > PAGE_SIZE && <TablePagination page={page} pageSize={PAGE_SIZE} total={data.total} onPage={setPage} />}

      {panel && (
        <MemberPanel
          options={options}
          member={panel.member ?? null}
          onClose={() => setPanel(null)}
          onSaved={(_, text) => {
            setPanel(null);
            onNotice(text);
            onTeamsChanged();
            load();
          }}
        />
      )}

      {confirm && (
        <AlertDialog
          variant={confirm.action === 'remove' ? 'error' : 'info'}
          title={confirm.action === 'remove' ? 'Retirer ce membre ?' : 'Désactiver ce membre ?'}
          message={
            confirm.action === 'remove'
              ? `${confirm.member.name || confirm.member.email} perdra tout accès et son identifiant de connexion sera supprimé. L’historique de sécurité est conservé.`
              : `${confirm.member.name || confirm.member.email} ne pourra plus se connecter. Ses rôles sont conservés : vous pourrez le réactiver.`
          }
          confirmLabel={confirm.action === 'remove' ? 'Retirer' : 'Désactiver'}
          cancelLabel="Annuler"
          busy={busy}
          onConfirm={() => run(confirm.action, confirm.member)}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

function MemberRow({ member, canManage, menuOpen, onMenu, onCloseMenu, onOpen, onAction }) {
  const menuRef = useRef(null);
  const status = MEMBER_STATUSES[member.status];

  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e) => !menuRef.current?.contains(e.target) && onCloseMenu();
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen, onCloseMenu]);

  const actions = [];
  if (canManage && member.editable) {
    if (member.status === 'invited') actions.push(['resend', 'Renvoyer l’invitation']);
    if (member.status === 'inactive') actions.push(['reactivate', 'Réactiver']);
    else if (!member.owner) actions.push(['deactivate', 'Désactiver']);
    if (!member.owner) actions.push(['remove', 'Retirer de l’équipe', true]);
  }

  return (
    <tr className={member.status === 'inactive' ? 'team-table__row--inactive' : undefined}>
      <td>
        <button type="button" className="team-table__person" onClick={onOpen}>
          <span className="team-avatar" aria-hidden="true">
            {(member.name || member.email).slice(0, 1).toUpperCase()}
          </span>
          <span>
            <strong>
              {member.name || member.email}
              {member.you && <span className="badge">Vous</span>}
              {member.owner && <span className="badge badge--info">Titulaire</span>}
            </strong>
            {member.name && <small>{member.email}</small>}
          </span>
        </button>
      </td>
      <td>
        {member.roles.length > 0 ? (
          <div className="team-chips">
            {member.roles.map((r) => (
              <span key={r.key} className={`team-chip${r.custom ? ' team-chip--custom' : ''}`}>
                {r.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="team-muted">Par ses équipes</span>
        )}
      </td>
      <td>
        {member.roles.length === 0 ? (
          <span className="team-muted">—</span>
        ) : member.allAccounts ? (
          'Tous les comptes'
        ) : (
          <span className="team-flags">
            {member.accounts.map((a) => (
              <span key={a.id} title={`${a.country} · ${a.accountNumberFormatted}`}>
                <Flag code={a.countryCode} /> {a.countryCode}
              </span>
            ))}
          </span>
        )}
      </td>
      <td>
        {member.teams.length > 0 ? (
          <div className="team-chips">
            {member.teams.map((t) => (
              <span key={t.id} className="team-chip team-chip--team" title={t.account.country}>
                <Flag code={t.account.countryCode} /> {t.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="team-muted">—</span>
        )}
      </td>
      <td>{member.status === 'active' ? relativeTime(member.lastLoginAt) : <span className={`badge badge--${status.tone}`}>{status.label}</span>}</td>
      <td className="team-table__menu-cell" ref={menuRef}>
        <button type="button" className="team-table__menu-btn" onClick={onMenu} aria-label={`Actions pour ${member.email}`} aria-expanded={menuOpen}>
          ···
        </button>
        {menuOpen && (
          <div className="team-menu" role="menu">
            <button type="button" role="menuitem" onClick={onOpen}>
              {canManage && member.editable ? 'Modifier les accès' : 'Voir les accès'}
            </button>
            {actions.map(([key, label, danger]) => (
              <button key={key} type="button" role="menuitem" className={danger ? 'is-danger' : undefined} onClick={() => onAction(key)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </td>
    </tr>
  );
}
