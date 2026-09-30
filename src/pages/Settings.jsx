import { useEffect, useState } from 'react';
import Tabs from '../components/Tabs.jsx';
import Flag from '../components/Flag.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError, getPersonalInfo, updatePassword, updatePersonalInfo } from '../api/client.js';

const TABS = [
  { key: 'info', label: 'Changer vos informations personnelles' },
  { key: 'password', label: 'Changer de mot de passe' },
  { key: 'others', label: 'Autres' },
];

export default function Settings() {
  const [tab, setTab] = useState('info');

  return (
    <div className="card">
      <div className="card__header">Paramètres du compte</div>
      <div className="card__body">
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <div className="tab-panel">
          {tab === 'info' && <PersonalInfoTab />}
          {tab === 'password' && <PasswordTab />}
          {tab === 'others' && <OthersTab />}
        </div>
      </div>
    </div>
  );
}

// The stored phone is international (+228...): the form edits the local part after the
// home country's calling code.
function localPhone(phone, callingCode) {
  if (!phone) return '';
  return callingCode && phone.startsWith(callingCode) ? phone.slice(callingCode.length).trim() : phone;
}

// Server field errors come back in English, keyed by API field name.
function mapServerInfoErrors(serverErrors = {}) {
  const errors = {};
  if (serverErrors.trade_name) errors.tradeName = 'Le nom commercial ne doit pas dépasser 150 caractères.';
  if (serverErrors.legal_name)
    errors.legalName = serverErrors.legal_name.includes('KYC')
      ? 'Le nom juridique ne peut plus être modifié après la soumission du KYC. Contactez le support.'
      : 'Veuillez saisir un nom juridique valide (150 caractères maximum).';
  if (serverErrors.email)
    errors.email = serverErrors.email.includes('already exists')
      ? 'Cette adresse est déjà utilisée par un autre compte.'
      : 'Veuillez saisir une adresse électronique valide.';
  if (serverErrors.phone) errors.phone = 'Veuillez saisir un numéro de téléphone valide.';
  if (serverErrors.current_password)
    errors.currentPassword =
      serverErrors.current_password === 'This field is required.'
        ? 'Veuillez saisir votre mot de passe actuel.'
        : 'Le mot de passe actuel est incorrect.';
  return errors;
}

// One "Nom commercial" / "Nom juridique" line: the current value, and an input once
// "Modifier" is clicked. `lockedHint` replaces the button when the value can't be changed.
function EditableRow({ label, value, editing, onEdit, onChange, error, disabled, lockedHint }) {
  if (editing) {
    return (
      <label className="field field--stacked">
        <span>{label}</span>
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} aria-invalid={!!error} />
        {error && <small className="field__error">{error}</small>}
      </label>
    );
  }
  return (
    <div className="settings-row">
      <span className="settings-row__label">{label}</span>
      <span className="settings-row__value">{value || '—'}</span>
      {lockedHint ? (
        <small className="settings-row__hint">{lockedHint}</small>
      ) : (
        <button type="button" className="link-btn" onClick={onEdit} disabled={disabled}>
          Modifier
        </button>
      )}
      {error && <small className="field__error settings-row__error">{error}</small>}
    </div>
  );
}

function PersonalInfoTab() {
  const { token, refreshProfile } = useAuth();
  // Last values returned by the API; the form only sends fields that differ from them.
  const [info, setInfo] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [editing, setEditing] = useState({ tradeName: false, legalName: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const applyInfo = (data) => {
    setInfo(data);
    setTradeName(data.tradeName ?? '');
    setLegalName(data.legalName ?? '');
    setEmail(data.email ?? '');
    setPhone(localPhone(data.phone, data.callingCode));
    setEditing({ tradeName: false, legalName: false });
  };

  useEffect(() => {
    let cancelled = false;
    getPersonalInfo(token)
      .then((data) => {
        if (!cancelled) applyInfo(data);
      })
      .catch((err) => {
        if (!cancelled)
          setLoadError(err instanceof ApiError && err.status === 0 ? err.message : 'Impossible de charger vos informations.');
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loadError) return <div className="toast-inline toast-inline--error">{loadError}</div>;
  if (!info) return <p className="settings-form__loading">Chargement…</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setFormError('');

    const fullPhone = phone.trim() ? `${info.callingCode}${phone.replace(/\s+/g, '')}` : '';
    const changes = {};
    if (tradeName.trim() !== (info.tradeName ?? '')) changes.tradeName = tradeName.trim();
    if (legalName.trim() !== info.legalName) changes.legalName = legalName.trim();
    if (email.trim().toLowerCase() !== info.email) changes.email = email.trim();
    if (phone.trim() !== localPhone(info.phone, info.callingCode)) changes.phone = fullPhone;

    const errors = {};
    if ('legalName' in changes && !changes.legalName) errors.legalName = 'Veuillez saisir le nom juridique.';
    if ('email' in changes && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(changes.email))
      errors.email = 'Veuillez saisir une adresse électronique valide.';
    if ('phone' in changes && !/^\+?\d{6,20}$/.test(changes.phone))
      errors.phone = 'Veuillez saisir un numéro de téléphone valide.';
    if (Object.keys(changes).length > 0 && !currentPassword)
      errors.currentPassword = 'Veuillez saisir votre mot de passe actuel.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (Object.keys(changes).length === 0) {
      setMessage('Aucune modification à enregistrer.');
      return;
    }

    setSubmitting(true);
    try {
      const { token: nextToken, ...data } = await updatePersonalInfo(token, { ...changes, currentPassword });
      applyInfo(data);
      setCurrentPassword('');
      setMessage('Modifications enregistrées.');
      // Updates the topbar name, and switches to the new token when the email changed.
      await refreshProfile(nextToken ?? token).catch(() => {});
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.data?.errors) {
        setFieldErrors(mapServerInfoErrors(err.data.errors));
      } else if (err instanceof ApiError && err.status === 401) {
        setFormError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setFormError(err instanceof ApiError && err.status === 0 ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <EditableRow
        label="Nom commercial"
        value={tradeName}
        editing={editing.tradeName}
        onEdit={() => setEditing((v) => ({ ...v, tradeName: true }))}
        onChange={setTradeName}
        error={fieldErrors.tradeName}
        disabled={submitting}
      />
      <EditableRow
        label="Nom juridique"
        value={legalName}
        editing={editing.legalName}
        onEdit={() => setEditing((v) => ({ ...v, legalName: true }))}
        onChange={setLegalName}
        error={fieldErrors.legalName}
        disabled={submitting}
        lockedHint={info.legalNameEditable ? null : 'Verrouillé après la soumission du KYC'}
      />

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
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email ? (
          <small className="field__error">{fieldErrors.email}</small>
        ) : (
          <small>C'est l'adresse que vous utilisez pour vous connecter.</small>
        )}
      </label>

      <label className="field field--stacked">
        <span>Numéro de téléphone</span>
        <div className="phone-input">
          <span className="phone-input__flag">
            <Flag code={info.countryCode} /> {info.callingCode}
          </span>
          <input
            type="tel"
            autoComplete="tel-national"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={submitting}
            aria-invalid={!!fieldErrors.phone}
          />
        </div>
        {fieldErrors.phone && <small className="field__error">{fieldErrors.phone}</small>}
      </label>

      <label className="field field--stacked">
        <span>Mot de passe actuel</span>
        <input
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={submitting}
          aria-invalid={!!fieldErrors.currentPassword}
        />
        {fieldErrors.currentPassword ? (
          <small className="field__error">{fieldErrors.currentPassword}</small>
        ) : (
          <small>Vous devez entrer votre mot de passe actuel afin de confirmer les modifications.</small>
        )}
      </label>

      <button type="submit" className="btn btn--teal" disabled={submitting}>
        {submitting ? 'Enregistrement…' : 'Appliquer les modifications'}
      </button>
      {message && <div className="toast-inline">{message}</div>}
      {formError && <div className="toast-inline toast-inline--error">{formError}</div>}
    </form>
  );
}

// Mirrors the server policy in myPay's Api\Merchant\PasswordController, so most
// mistakes are caught before a round trip. The server stays the source of truth.
function validatePasswordForm({ current, next, confirm }) {
  const errors = {};
  if (!current) errors.current = 'Veuillez saisir votre mot de passe actuel.';
  if (!next) errors.next = 'Veuillez saisir un nouveau mot de passe.';
  else if (next.length < 10) errors.next = 'Le mot de passe doit contenir au moins 10 caractères.';
  else if (!/[A-Za-z]/.test(next) || !/\d/.test(next))
    errors.next = 'Le mot de passe doit contenir au moins une lettre et un chiffre.';
  else if (next === current) errors.next = "Le nouveau mot de passe doit être différent de l'actuel.";
  if (!confirm) errors.confirm = 'Veuillez confirmer le nouveau mot de passe.';
  else if (next && confirm !== next) errors.confirm = 'Les nouveaux mots de passe ne correspondent pas.';
  return errors;
}

// Server field errors come back in English, keyed by API field name.
function mapServerPasswordErrors(serverErrors = {}) {
  const errors = {};
  if (serverErrors.current_password) errors.current = 'Le mot de passe actuel est incorrect.';
  if (serverErrors.new_password) errors.next = serverErrors.new_password;
  if (serverErrors.confirm_password) errors.confirm = 'Les nouveaux mots de passe ne correspondent pas.';
  return errors;
}

function PasswordTab() {
  const { token } = useAuth();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setFormError('');

    const errors = validatePasswordForm({ current, next, confirm });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await updatePassword(token, { currentPassword: current, newPassword: next, confirmPassword: confirm });
      setSuccess(true);
      setCurrent('');
      setNext('');
      setConfirm('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 422 && err.data?.errors) {
        setFieldErrors(mapServerPasswordErrors(err.data.errors));
      } else if (err instanceof ApiError && err.status === 401) {
        setFormError('Votre session a expiré. Veuillez vous reconnecter.');
      } else {
        setFormError(err instanceof ApiError && err.status === 0 ? err.message : 'Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setSubmitting(false);
    }
  };

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
  );
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
  );
}
