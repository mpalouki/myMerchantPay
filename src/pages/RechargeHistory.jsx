import { useMemo, useState } from 'react'
import { RECHARGE_HISTORY } from '../data/mockData.js'

const STATUS_TONE = {
  Validé: 'success',
  'En attente': 'warning',
  Rejeté: 'danger',
}

export default function RechargeHistory() {
  const [pageSize, setPageSize] = useState(10)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return RECHARGE_HISTORY
    const q = query.toLowerCase()
    return RECHARGE_HISTORY.filter((r) =>
      [r.date, r.phoneOrRib, r.amount, r.method, r.account, r.label, r.status]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [query])

  const rows = filtered.slice(0, pageSize)

  return (
    <div className="card">
      <div className="card__header">Mes recharges</div>
      <div className="card__body">
        <div className="table-toolbar">
          <label className="table-toolbar__pagesize">
            Afficher par
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 25, 50].map((n) => (
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
              type="text"
              placeholder="Mot clé"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Date et Heure</th>
              <th>Numéro de téléphone / RIB</th>
              <th>Montant</th>
              <th>Moyen de recharge</th>
              <th>Compte rechargé</th>
              <th>Libelle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="data-table__empty">
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td>{r.phoneOrRib}</td>
                  <td>{r.amount}</td>
                  <td>{r.method}</td>
                  <td>{r.account}</td>
                  <td>{r.label || '—'}</td>
                  <td>
                    <span className={`badge badge--${STATUS_TONE[r.status] || 'info'}`}>{r.status}</span>
                  </td>
                  <td>
                    <button type="button" className="link-btn">
                      Voir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="table-footer">
          {rows.length === 0 ? 'Aucune donnée disponible' : `Affichage de 1 à ${rows.length} sur ${filtered.length} entrées`}
          <div className="table-pagination">
            <button type="button" disabled>
              &laquo;
            </button>
            <button type="button" disabled>
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
