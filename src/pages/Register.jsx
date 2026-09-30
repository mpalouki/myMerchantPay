import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthHeader from '../components/AuthHeader.jsx';
import { ApiError, registerMerchant } from '../api/client.js';
import Flag from '../components/Flag.jsx';
import { useCountries } from '../hooks/useCountries.js';
import { useTranslation } from '../i18n/I18nContext.jsx';
const STEPS = ['company', 'representative', 'confirmation'];

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
  acceptedTerms: false,
};

// Returns a translation key (plus params) for the first problem on the step, or null.
function validateStep(step, form) {
  if (STEPS[step] === 'confirmation') {
    if (!form.acceptedTerms) return { key: 'register.errors.termsRequired' };
  }
  return null;
}

function buildPayload(form) {
  const data = new FormData();
  data.append(
      'data',
      JSON.stringify({
        company: form.company,
        representative: form.representative,
        acceptedTerms: form.acceptedTerms,
      }),
  );

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
  // Stored as { key, message? } so the text re-renders in the new language on switch.
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (section, key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => (section ? { ...f, [section]: { ...f[section], [key]: value } } : { ...f, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateStep(step, form);
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
      await registerMerchant(buildPayload(form));
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

  const header = <AuthHeader page="register" />;

  if (done) {
    const [before, after] = t('register.done.message').split('{{email}}');
    return (
        <div className="login-page">
          {header}
          <div className="login-card register-card register-card--done">
            <h1>{t('register.done.title')}</h1>
            <p>
              {before}
              <strong>{form.representative.email}</strong>
              {after}
            </p>
            <Link to="/login" className="btn btn--primary btn--block">
              {t('register.done.backToLogin')}
            </Link>
          </div>
        </div>
    );
  }

  const { company, representative } = form;
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

                  <Field label={t('register.representative.nationality')} required>
                    <input
                        value={representative.nationality}
                        onChange={update('representative', 'nationality')}
                        required
                    />
                  </Field>
                  <Field label={t('register.representative.position')} required>
                    <input
                        placeholder={t('register.representative.positionPlaceholder')}
                        value={representative.position}
                        onChange={update('representative', 'position')}
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
                  <Field label={t('register.representative.email')} required>
                    <input
                        type="email"
                        value={representative.email}
                        onChange={update('representative', 'email')}
                        required
                    />
                  </Field>
                </div>
            )}

            {STEPS[step] === 'confirmation' && (
                <div className="register-grid">
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
