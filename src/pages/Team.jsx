import { useCallback, useEffect, useState } from 'react';
import Tabs from '../components/Tabs.jsx';
import MembersTab from '../components/team/MembersTab.jsx';
import TeamsTab from '../components/team/TeamsTab.jsx';
import RolesTab from '../components/team/RolesTab.jsx';
import SecurityTab from '../components/team/SecurityTab.jsx';
import { getTeamOptions } from '../api/client.js';
import { readApiErrors } from '../data/team.js';

// "Équipe et sécurité" (like Stripe's Team & security settings): the merchant's members with
// their roles and accounts, its teams (one account each), the roles — predefined and custom —
// and the security history. Everything is built from GET /api/merchant/team/options; what the
// viewer may change comes from its `me`.
export default function Team() {
  const [options, setOptions] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('members');
  const [notice, setNotice] = useState(null); // { text, tone }

  const loadOptions = useCallback(() => {
    getTeamOptions()
      .then(setOptions)
      .catch((err) => setError(readApiErrors(err).message));
  }, []);

  useEffect(() => loadOptions(), [loadOptions]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(timer);
  }, [notice]);

  const onNotice = (text, tone = 'success') => setNotice({ text, tone });

  const tabs = [
    { key: 'members', label: 'Membres' },
    { key: 'teams', label: 'Équipes' },
    { key: 'roles', label: 'Rôles et permissions' },
    ...(options?.me.canViewHistory ? [{ key: 'security', label: 'Historique de sécurité' }] : []),
  ];

  return (
    <div className="card team-page">
      <div className="card__header">
        <h1>Équipe et sécurité</h1>
        <div className="card__subheader">Invitez vos collaborateurs et choisissez ce que chacun peut faire, sur quels comptes.</div>
      </div>
      <div className="card__body">
        {error && <div className="toast-inline toast-inline--error">{error}</div>}
        {!options && !error && <div className="empty-panel">Chargement…</div>}
        {options && (
          <>
            <Tabs tabs={tabs} active={tab} onChange={setTab} />
            {notice && (
              <div className={`toast-inline team-page__notice${notice.tone === 'error' ? ' toast-inline--error' : ''}`} role="status">
                {notice.text}
              </div>
            )}
            <div className="team-page__panel">
              {tab === 'members' && <MembersTab options={options} onNotice={onNotice} onTeamsChanged={loadOptions} />}
              {tab === 'teams' && <TeamsTab options={options} onNotice={onNotice} onTeamsChanged={loadOptions} />}
              {tab === 'roles' && <RolesTab options={options} onNotice={onNotice} onRolesChanged={loadOptions} />}
              {tab === 'security' && <SecurityTab options={options} />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
