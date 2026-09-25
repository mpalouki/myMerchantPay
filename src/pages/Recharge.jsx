import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BANK_ACCOUNTS, ZONES } from '../data/mockData.js'

const METHODS = [
  { key: 'mobile', label: 'Mobile Money' },
  { key: 'bank', label: 'Compte bancaire' },
]

export default function Recharge() {
  const [method, setMethod] = useState('bank')
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    bank: BANK_ACCOUNTS[0].id,
    zone: '',
    rib: '',
    amount: '',
    date: '',
    label: '',
    phone: '',
    operator: '',
  })

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/dashboard/recharge/history')
  }

  return (
    <div className="card">
      <div className="card__header">
        Recharger mon compte
        <div className="card__subheader">Recharger via Mobile money ou Compte bancaire</div>
      </div>
      <div className="card__body">
        <div className="stepper-tabs">
          {METHODS.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`stepper-tabs__item ${method === m.key ? 'stepper-tabs__item--active' : ''}`}
              onClick={() => {
                setMethod(m.key)
                setStep(1)
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="stepper-progress" />

        <div className="stepper-step-label">Etape {step}/2</div>
        <h2 className="section-title-lg">Formulaire de recharge</h2>

        {step === 1 && (
          <form
            className="settings-form"
            onSubmit={(e) => {
              e.preventDefault()
              setStep(2)
            }}
          >
            {method === 'bank' ? (
              <label className="field field--stacked">
                <span>Depuis quelle banque avez-vous effectué le virement ? *</span>
                <select value={form.bank} onChange={update('bank')} required>
                  {BANK_ACCOUNTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label className="field field--stacked">
                  <span>Numéro de téléphone Mobile Money *</span>
                  <input type="text" value={form.phone} onChange={update('phone')} required />
                </label>
                <label className="field field--stacked">
                  <span>Opérateur *</span>
                  <input
                    type="text"
                    placeholder="Ex: Orange Money, MTN, Moov..."
                    value={form.operator}
                    onChange={update('operator')}
                    required
                  />
                </label>
              </>
            )}
            <div className="form-actions">
              <button type="submit" className="btn btn--primary">
                Suivant
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="settings-form" onSubmit={handleSubmit}>
            {method === 'bank' && (
              <label className="field field--stacked">
                <span>Depuis quelle banque avez-vous effectué le virement ? *</span>
                <select value={form.bank} onChange={update('bank')} required>
                  {BANK_ACCOUNTS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="field field--stacked">
              <span>Depuis quelle zone avez-vous effectué le virement ? *</span>
              <select value={form.zone} onChange={update('zone')} required>
                <option value="" disabled>
                  Sélectionner une zone
                </option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </label>

            <label className="field field--stacked">
              <span>Votre RIB *</span>
              <input type="text" value={form.rib} onChange={update('rib')} required />
            </label>

            <label className="field field--stacked">
              <span>Montant *</span>
              <div className="amount-input">
                <input type="number" min="0" value={form.amount} onChange={update('amount')} required />
                <span>FCFA</span>
              </div>
            </label>

            <label className="field field--stacked">
              <span>Quand avez-vous effectué le virement ? *</span>
              <input type="date" value={form.date} onChange={update('date')} required />
            </label>

            <label className="field field--stacked">
              <span>Libellé du virement (optionnel)</span>
              <input type="text" value={form.label} onChange={update('label')} />
            </label>

            <div className="form-actions form-actions--split">
              <button type="button" className="btn btn--outline" onClick={() => setStep(1)}>
                Précédent
              </button>
              <button type="submit" className="btn btn--primary">
                Soumettre
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
