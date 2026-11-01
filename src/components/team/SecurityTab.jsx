import { Fragment, useEffect, useState } from 'react';
import TablePagination from '../TablePagination.jsx';
import { getSecurityEvents } from '../../api/client.js';
import { readApiErrors } from '../../data/team.js';
import { formatDateTime } from '../../data/reload.js';

const PAGE_SIZE = 25;

// "Historique de sécurité": who did what, from which IP, when — logins, wrong passwords,
// password and email changes, and every change to members, teams and roles.
export default function SecurityTab({ options }) {
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);

  // A filter change goes back to the first page.
  const filter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(
      () => {
        getSecurityEvents({ category, type, q: query.trim(), from, to, page, limit: PAGE_SIZE })
          .then((result) => {
            if (!cancelled) {
              setData(result);
              setError('');
            }
          })
          .catch((err) => !cancelled && setError(readApiErrors(err).message));
      },
      query ? 250 : 0,
    );
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, type, query, from, to, page]);

  const types = options.eventTypes.filter((t) => !category || t.category === category);

  return (
    <div className="team-security">
      <div className="team-toolbar">
        <select
          value={category}
          onChange={(e) => {
            filter(setCategory)(e.target.value);
            setType('');
          }}
          aria-label="Catégorie"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(options.eventCategories).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => filter(setType)(e.target.value)} aria-label="Action">
          <option value="">Toutes les actions</option>
          {types.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        <input
          type="search"
          className="team-toolbar__search"
          placeholder="Utilisateur, cible ou adresse IP"
          value={query}
          onChange={(e) => filter(setQuery)(e.target.value)}
          aria-label="Rechercher"
        />
        <label className="team-toolbar__date">
          Du <input type="date" value={from} onChange={(e) => filter(setFrom)(e.target.value)} />
        </label>
        <label className="team-toolbar__date">
          au <input type="date" value={to} onChange={(e) => filter(setTo)(e.target.value)} />
        </label>
      </div>

      {error && <div className="toast-inline toast-inline--error">{error}</div>}

      <div className="table-scroll">
        <table className="data-table team-history">
          <thead>
            <tr>
              <th>Action</th>
              <th>Catégorie</th>
              <th>Adresse IP</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="data-table__empty">
                  Aucun événement.
                </td>
              </tr>
            )}
            {data?.items.map((event) => (
              <Fragment key={event.id}>
                <tr>
                  <td>
                    <button
                      type="button"
                      className="team-history__action"
                      onClick={() => setOpenId(openId === event.id ? null : event.id)}
                      disabled={!event.details}
                      aria-expanded={openId === event.id}
                    >
                      <strong>{event.actor ?? 'Quelqu’un'}</strong> {event.action}
                      {event.target && event.target !== event.actor && <strong> {event.target}</strong>}
                    </button>
                  </td>
                  <td>{options.eventCategories[event.category]}</td>
                  <td className="team-history__ip">{event.ip ?? '—'}</td>
                  <td>{formatDateTime(event.createdAt)}</td>
                </tr>
                {openId === event.id && event.details && (
                  <tr className="team-history__details">
                    <td colSpan={4}>
                      <EventDetails details={event.details} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {data && <TablePagination page={page} pageSize={PAGE_SIZE} total={data.total} onPage={setPage} />}
    </div>
  );
}

const DETAIL_LABELS = {
  roles: 'Rôles',
  accounts: 'Comptes',
  account: 'Compte',
  teams: 'Équipes',
  members: 'Membres',
  name: 'Nom',
  permissions: 'Permissions',
  previous: 'Avant',
};

function show(value) {
  if (value === 'all') return 'Tous les comptes';
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—';
  return value ?? '—';
}

// Before/after of a change, or its plain details.
function EventDetails({ details }) {
  if (details.before || details.after) {
    const keys = [...new Set([...Object.keys(details.before ?? {}), ...Object.keys(details.after ?? {})])];
    const before = details.before ?? {};
    const after = details.after ?? {};
    if (Array.isArray(details.after)) {
      return (
        <dl className="team-history__diff">
          <dt>Avant</dt>
          <dd>{show(details.before)}</dd>
          <dt>Après</dt>
          <dd>{show(details.after)}</dd>
        </dl>
      );
    }
    return (
      <dl className="team-history__diff">
        {keys
          .filter((k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]))
          .map((k) => (
            <Fragment key={k}>
              <dt>{DETAIL_LABELS[k] ?? k}</dt>
              <dd>
                {details.before && <span className="team-history__before">{show(before[k])}</span>}
                <span className="team-history__after">{show(after[k])}</span>
              </dd>
            </Fragment>
          ))}
      </dl>
    );
  }
  return (
    <dl className="team-history__diff">
      {Object.entries(details).map(([k, v]) => (
        <Fragment key={k}>
          <dt>{DETAIL_LABELS[k] ?? k}</dt>
          <dd>{show(v)}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
