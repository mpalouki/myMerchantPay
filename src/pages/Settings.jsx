import { useState } from 'react'
import Tabs from '../components/Tabs.jsx'
import Flag from '../components/Flag.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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

function PasswordTab() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!current || !next || !confirm) {
      setMessage('Veuillez remplir tous les champs.')
      return
    }
    if (next !== confirm) {
      setMessage('Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    setMessage('Mot de passe changé avec succès.')
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <label className="field field--stacked">
        <span>Mot de passe actuel</span>
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      </label>
      <label className="field field--stacked">
        <span>Nouveau mot de passe</span>
        <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
      </label>
      <label className="field field--stacked">
        <span>Confirmer votre nouveau mot de passe</span>
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </label>
      <button type="submit" className="btn btn--teal">
        Changer de mot de passe
      </button>
      {message && <div className="toast-inline">{message}</div>}
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
