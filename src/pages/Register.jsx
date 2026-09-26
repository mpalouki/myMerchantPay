import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { ApiError, registerMerchant } from '../api/client.js';
import Flag from '../components/Flag.jsx';
import { useCountries } from '../hooks/useCountries.js';
import { useTranslation } from '../i18n/I18nContext.jsx';

const STEPS = ['company', 'representative', 'documents', 'account'];

// Codes are what the API receives; labels come from register.legalForms / sectors / idTypes.
const LEGAL_FORMS = ['SOLE_PROPRIETORSHIP', 'SARL', 'SARLU', 'SA', 'SAS', 'SASU', 'GIE', 'ASSOCIATION', 'NGO'];

const SECTORS = [
  'RETAIL',
  'ECOMMERCE',
  'HOSPITALITY',
  'TRANSPORT',
  'EDUCATION',
  'HEALTH',
  'FINANCIAL_SERVICES',
  'TELECOM',
  'REAL_ESTATE',
  'OTHER',
];

const ID_TYPES = ['CNI', 'PASSPORT', 'RESIDENCE_PERMIT'];

const DOCUMENTS = [
  { key: 'rccm', required: true },
  { key: 'taxCertificate', required: true },
  { key: 'idDocument', required: true },
  { key: 'proofOfAddress', required: true },
  { key: 'statutes', required: false },
];

const ACCEPTED_FILES = '.pdf,.jpg,.jpeg,.png';
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const INITIAL_FORM = {
  company: {
    name: '',
    tradeName: '',
    legalForm: '',
    rccm: '',
    taxId: '',
    sector: '',
    country: '',
    city: '',
    address: '',
    phone: '',
    website: '',
    creationDate: '',
  },
  representative: {
    lastName: '',
    firstName: '',
    birthDate: '',
    nationality: '',
    position: '',
    idType: '',
    idNumber: '',
    idExpiryDate: '',
    email: '',
    phone: '',
  },
  account: {
    email: '',
    password: '',
    passwordConfirm: '',
  },
  acceptedTerms: false,
};

// Returns a translation key (plus params) for the first problem on the step, or null.
function validateStep(step, form, files) {
  if (STEPS[step] === 'documents') {
    const missing = DOCUMENTS.find((d) => d.required && !files[d.key]);
    if (missing) return { key: 'register.errors.missingDocument', document: missing.key };
  }
  if (STEPS[step] === 'account') {
    if (form.account.password.length < 8) return { key: 'register.errors.passwordTooShort' };
    if (form.account.password !== form.account.passwordConfirm)
      return { key: 'register.errors.passwordMismatch' };
    if (!form.acceptedTerms) return { key: 'register.errors.termsRequired' };
  }
  return null;
}

function buildPayload(form, files) {
  const { passwordConfirm, ...account } = form.account;
  const data = new FormData();
  data.append(
    'data',
    JSON.stringify({
      company: form.company,
      representative: form.representative,
      account,
      acceptedTerms: form.acceptedTerms,
    }),
  );
  Object.entries(files).forEach(([key, file]) => {
    if (file) data.append(`documents[${key}]`, file);
  });
  return data;
}

function Field({ label, required, full, children }) {
  return (
    <label className={`field field--stacked ${full ? 'register-grid__full' : ''}`}>
      <span>
        {label}
        {required && ' *'}
      </span>
      {children}
    </label>
  );
}

export default function Register() {
  const { t } = useTranslation();
  const { countries } = useCountries();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState({});
  // Stored as { key, message? } so the text re-renders in the new language on switch.
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (section, key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => (section ? { ...f, [section]: { ...f[section], [key]: value } } : { ...f, [key]: value }));
  };

  const updateFile = (key) => (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > MAX_FILE_SIZE) {
      setError({ key: 'register.errors.fileTooLarge' });
      e.target.value = '';
      return;
    }
    setError(null);
    setFiles((f) => ({ ...f, [key]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateStep(step, form, files);
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      await registerMerchant(buildPayload(form, files));
      setDone(true);
    } catch (err) {
      // Server messages are shown as-is; they aren't in our locale files.
      setError(err instanceof ApiError ? { message: err.message } : { key: 'register.errors.submitFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  const errorText =
    error &&
    (error.message ||
      t(error.key, error.document ? { document: t(`register.documents.${error.document}`) } : undefined));

  const header = (
    <>
      <div className="login-page__logo">
        <Logo variant="white" size={32} />
      </div>
      <LanguageSwitcher className="login-page__language" />
    </>
  );

  if (done) {
    const [before, after] = t('register.done.message').split('{{email}}');
    return (
      <div className="login-page">
        {header}
        <div className="login-card register-card register-card--done">
          <h1>{t('register.done.title')}</h1>
          <p>
            {before}
            <strong>{form.account.email}</strong>
            {after}
          </p>
          <Link to="/login" className="btn btn--primary btn--block">
            {t('register.done.backToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  const { company, representative, account } = form;
  const selectPlaceholder = (
    <option value="" disabled>
      {t('common.select')}
    </option>
  );

  return (
    <div className="login-page">
      {header}
      <form className="login-card register-card" onSubmit={handleSubmit}>
        <h1>{t('register.title')}</h1>

        <ol className="register-steps">
          {STEPS.map((key, i) => (
            <li
              key={key}
              className={`register-steps__item ${i === step ? 'register-steps__item--active' : ''} ${
                i < step ? 'register-steps__item--done' : ''
              }`}
            >
              <span className="register-steps__index">{i + 1}</span>
              <span className="register-steps__label">{t(`register.steps.${key}`)}</span>
            </li>
          ))}
        </ol>

        <fieldset className="register-card__fields" disabled={submitting}>
          {STEPS[step] === 'company' && (
            <div className="register-grid">
              <Field label={t('register.company.name')} required>
                <input value={company.name} onChange={update('company', 'name')} required />
              </Field>
              <Field label={t('register.company.tradeName')}>
                <input value={company.tradeName} onChange={update('company', 'tradeName')} />
              </Field>
              <Field label={t('register.company.legalForm')} required>
                <select value={company.legalForm} onChange={update('company', 'legalForm')} required>
                  {selectPlaceholder}
                  {LEGAL_FORMS.map((code) => (
                    <option key={code} value={code}>
                      {t(`register.legalForms.${code}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('register.company.sector')} required>
                <select value={company.sector} onChange={update('company', 'sector')} required>
                  {selectPlaceholder}
                  {SECTORS.map((code) => (
                    <option key={code} value={code}>
                      {t(`register.sectors.${code}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('register.company.rccm')} required>
                <input value={company.rccm} onChange={update('company', 'rccm')} required />
              </Field>
              <Field label={t('register.company.taxId')} required>
                <input value={company.taxId} onChange={update('company', 'taxId')} required />
              </Field>
              <Field label={t('register.company.creationDate')} required>
                <input
                  type="date"
                  value={company.creationDate}
                  onChange={update('company', 'creationDate')}
                  required
                />
              </Field>
              <Field label={t('register.company.country')} required>
                <div className="country-select">
                  <Flag code={company.country} />
                  <select value={company.country} onChange={update('company', 'country')} required>
                    {selectPlaceholder}
                    {countries.map((c) => (
                      <option key={c.codeAlpha2} value={c.codeAlpha2}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>
              <Field label={t('register.company.city')} required>
                <input value={company.city} onChange={update('company', 'city')} required />
              </Field>
              <Field label={t('register.company.phone')} required>
                <input type="tel" value={company.phone} onChange={update('company', 'phone')} required />
              </Field>
              <Field label={t('register.company.address')} required full>
                <input value={company.address} onChange={update('company', 'address')} required />
              </Field>
              <Field label={t('register.company.website')} full>
                <input
                  type="url"
                  placeholder="https://"
                  value={company.website}
                  onChange={update('company', 'website')}
                />
              </Field>
            </div>
          )}

          {STEPS[step] === 'representative' && (
            <div className="register-grid">
              <Field label={t('register.representative.lastName')} required>
                <input value={representative.lastName} onChange={update('representative', 'lastName')} required />
              </Field>
              <Field label={t('register.representative.firstName')} required>
                <input
                  value={representative.firstName}
                  onChange={update('representative', 'firstName')}
                  required
                />
              </Field>
              <Field label={t('register.representative.birthDate')} required>
                <input
                  type="date"
                  value={representative.birthDate}
                  onChange={update('representative', 'birthDate')}
                  required
                />
              </Field>
              <Field label={t('register.representative.nationality')} required>
                <input
                  value={representative.nationality}
                  onChange={update('representative', 'nationality')}
                  required
                />
              </Field>
              <Field label={t('register.representative.position')} required full>
                <input
                  placeholder={t('register.representative.positionPlaceholder')}
                  value={representative.position}
                  onChange={update('representative', 'position')}
                  required
                />
              </Field>
              <Field label={t('register.representative.idType')} required>
                <select value={representative.idType} onChange={update('representative', 'idType')} required>
                  {selectPlaceholder}
                  {ID_TYPES.map((code) => (
                    <option key={code} value={code}>
                      {t(`register.idTypes.${code}`)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t('register.representative.idNumber')} required>
                <input value={representative.idNumber} onChange={update('representative', 'idNumber')} required />
              </Field>
              <Field label={t('register.representative.idExpiryDate')} required>
                <input
                  type="date"
                  value={representative.idExpiryDate}
                  onChange={update('representative', 'idExpiryDate')}
                  required
                />
              </Field>
              <Field label={t('register.representative.phone')} required>
                <input
                  type="tel"
                  value={representative.phone}
                  onChange={update('representative', 'phone')}
                  required
                />
              </Field>
              <Field label={t('register.representative.email')} required full>
                <input
                  type="email"
                  value={representative.email}
                  onChange={update('representative', 'email')}
                  required
                />
              </Field>
            </div>
          )}

          {STEPS[step] === 'documents' && (
            <div className="register-docs">
              <p className="register-card__hint">{t('register.documents.hint')}</p>
              {DOCUMENTS.map((doc) => (
                <label key={doc.key} className="field field--stacked register-docs__item">
                  <span>
                    {t(`register.documents.${doc.key}`)} {doc.required ? '*' : t('common.optional')}
                  </span>
                  <input type="file" accept={ACCEPTED_FILES} onChange={updateFile(doc.key)} />
                  {files[doc.key] && <small>{files[doc.key].name}</small>}
                </label>
              ))}
            </div>
          )}

          {STEPS[step] === 'account' && (
            <div className="register-grid">
              <Field label={t('register.account.email')} required full>
                <input
                  type="email"
                  value={account.email}
                  onChange={update('account', 'email')}
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label={t('register.account.password')} required>
                <input
                  type="password"
                  value={account.password}
                  onChange={update('account', 'password')}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              <Field label={t('register.account.passwordConfirm')} required>
                <input
                  type="password"
                  value={account.passwordConfirm}
                  onChange={update('account', 'passwordConfirm')}
                  autoComplete="new-password"
                  required
                />
              </Field>
              <label className="checkbox-row register-grid__full">
                <input type="checkbox" checked={form.acceptedTerms} onChange={update(null, 'acceptedTerms')} />
                <span>{t('register.account.terms')}</span>
              </label>
            </div>
          )}
        </fieldset>

        {errorText && <div className="login-card__error">{errorText}</div>}

        <div className="form-actions form-actions--split">
          {step > 0 ? (
            <button
              type="button"
              className="btn btn--outline"
              onClick={() => {
                setError(null);
                setStep(step - 1);
              }}
              disabled={submitting}
            >
              {t('common.previous')}
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {step < STEPS.length - 1
              ? t('common.next')
              : submitting
                ? t('register.submitting')
                : t('register.submit')}
          </button>
        </div>

        <Link to="/login" className="login-card__forgot">
          {t('register.haveAccount')}
        </Link>
      </form>
    </div>
  );
}
