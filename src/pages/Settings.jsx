import { useState } from 'react'
import Tabs from '../components/Tabs.jsx'
import Flag from '../components/Flag.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { ApiError, updatePassword } from '../api/client.js'

const TABS = [
  { key: 'info', label: 'Changer vos informations personnelles' },
  { key: 'password', label: 'Changer de mot de passe' },
  { key: 'sav', label: 'Ajouter vos contacts SAV' },
  { key: 'others', label: 'Autres' },
]

export default function Settings() {
  const [tab, setTab] = useState('info')

  return (
    <div className="card">
      <div className="card__header">Paramètres du compte</div>
      <div className="card__body">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="tab-panel">
          {tab === 'info' && <PersonalInfoTab />}
          {tab === 'password' && <PasswordTab />}
          {tab === 'sav' && <SavTab />}
          {tab === 'others' && <OthersTab />}
        </div>
      </div>
    </div>
  )
}

function PersonalInfoTab() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [saved, setSaved] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <div className="settings-row">
        <span className="settings-row__label">Nom commercial</span>
        <button type="button" className="link-btn">
          Modifier
        </button>
      </div>
      <div className="settings-row">
        <span className="settings-row__label">Nom juridique</span>
        <button type="button" className="link-btn">
          Modifier
        </button>
      </div>

      <label className="field field--stacked">
        <span>Logo de l'entreprise</span>
        <div>
          <button type="button" className="btn btn--primary btn--sm">
            Choisir une nouvelle image
          </button>
        </div>
      </label>

      <label className="field field--stacked">
        <span>Adresse électronique</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>

      <label className="field field--stacked">
        <span>Numéro de téléphone</span>
        <div className="phone-input">
          <span className="phone-input__flag">
            <Flag code="tg" /> +228
          </span>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </label>

      <label className="field field--stacked">
        <span>Mot de passe actuel</span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <small>Vous devez entrer votre mot de passe actuel afin de confirmer les modifications.</small>
      </label>

      <button type="submit" className="btn btn--teal">
        Appliquer les modifications
      </button>
      {saved && <div className="toast-inline">Modifications enregistrées.</div>}
    </form>
  )
}

// Mirrors the server policy in myPay's Api\Merchant\PasswordController, so most
// mistakes are caught before a round trip. The server stays the source of truth.
function validatePasswordForm({ current, next, confirm }) {
  const errors = {}
  if (!current) errors.current = 'Veuillez saisir votre mot de passe actuel.'
  if (!next) errors.next = 'Veuillez saisir un nouveau mot de passe.'
  else if (next.length < 10) errors.next = 'Le mot de passe doit contenir au moins 10 caractères.'
  else if (!/[A-Za-z]/.test(next) || !/\d/.test(next))
    errors.next = 'Le mot de passe doit contenir au moins une lettre et un chiffre.'
  else if (next === current) errors.next = "Le nouveau mot de passe doit être différent de l'actuel."
  if (!confirm) errors.confirm = 'Veuillez confirmer le nouveau mot de passe.'
  else if (next && confirm !== next) errors.confirm = 'Les nouveaux mots de passe ne correspondent pas.'
  return errors
}

// Server field errors come back in English, keyed by API field name.
function mapServerPasswordErrors(serverErrors = {}) {
  const errors = {}
  if (serverErrors.current_password) errors.current = 'Le mot de passe actuel est incorrect.'
  if (serverErrors.new_password) errors.next = serverErrors.new_password
  if (serverErrors.confirm_password) errors.confirm = 'Les nouveaux mots de passe ne correspondent pas.'
  return errors
}

function PasswordTab() {
  const { token } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess(false)
    setFormError('')

    const errors = validatePasswordForm({ current, next, confirm })
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setSubmitting(true)
    try {
      await updatePassword(token, { currentPassword: current, newPassword: next, confirmPassword: confirm })
      setSuccess(true)
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.data?.errors) {
        setFieldErrors(mapServerPasswordErrors(err.data.errors))
      } else if (err instanceof ApiError && err.status === 401) {
        setFormError('Votre session a expiré. Veuillez vous reconnecter.')
      } else {
        setFormError(err instanceof ApiError && err.status === 0 ? err.message : 'Une erreur est survenue. Veuillez réessayer.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <label className="field field--stacked">
        <span>Mot de passe actuel</span>
        <input
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          disabled={submitting}
          aria-invalid={!!fieldErrors.current}
        />
        {fieldErrors.current && <small className="field__error">{fieldErrors.current}</small>}
      </label>
      <label className="field field--stacked">
        <span>Nouveau mot de passe</span>
        <input
          type="password"
          autoComplete="new-password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          disabled={submitting}
          aria-invalid={!!fieldErrors.next}
        />
        {fieldErrors.next ? (
          <small className="field__error">{fieldErrors.next}</small>
        ) : (
          <small>Au moins 10 caractères, dont une lettre et un chiffre.</small>
        )}
      </label>
      <label className="field field--stacked">
        <span>Confirmer votre nouveau mot de passe</span>
        <input
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          disabled={submitting}
          aria-invalid={!!fieldErrors.confirm}
        />
        {fieldErrors.confirm && <small className="field__error">{fieldErrors.confirm}</small>}
      </label>
      <button type="submit" className="btn btn--teal" disabled={submitting}>
        {submitting ? 'Modification en cours…' : 'Changer de mot de passe'}
      </button>
      {success && <div className="toast-inline">Mot de passe changé avec succès.</div>}
      {formError && <div className="toast-inline toast-inline--error">{formError}</div>}
    </form>
  )
}

function SavTab() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [added, setAdded] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setAdded(true)
    setName('')
    setEmail('')
    setPhone('')
    setTimeout(() => setAdded(false), 2500)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label className="field field--stacked">
        <span>Nom du contact</span>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label className="field field--stacked">
        <span>Adresse électronique</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="field field--stacked">
        <span>Numéro de téléphone</span>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <button type="submit" className="btn btn--teal">
        Ajouter le contact
      </button>
      {added && <div className="toast-inline">Contact SAV ajouté.</div>}
    </form>
  )
}

function OthersTab() {
  return (
    <div className="settings-others">
      <label className="checkbox-row">
        <input type="checkbox" defaultChecked />
        <span>Recevoir les notifications par e-mail</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" />
        <span>Recevoir les notifications par SMS</span>
      </label>
      <label className="checkbox-row">
        <input type="checkbox" defaultChecked />
        <span>Activer l'authentification à deux facteurs</span>
      </label>
    </div>
  )
}
