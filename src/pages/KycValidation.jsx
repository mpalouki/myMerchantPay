import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ApiError, getKyc, submitKyc } from '../api/client.js';
import { CompanyFields, DocumentsFields, RepresentativeFields, StepIndicator } from '../components/KycFormSteps.jsx';
import {
  DOCUMENTS,
  EMPTY_COMPANY,
  EMPTY_REPRESENTATIVE,
  ID_TYPES,
  LEGAL_FORMS,
  MAX_FILE_SIZE,
  SECTORS,
  buildKycFormData,
  validateDocuments,
} from '../data/kyc.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCountries } from '../hooks/useCountries.js';
import { useTranslation } from '../i18n/I18nContext.jsx';

// Same application as public registration (Register.jsx), for a merchant already logged in:
// no account step, the name and home country are fixed, and the last step is a recap to
// validate. DashboardLayout redirects here while the KYC is not_submitted or rejected.
const STEPS = ['company', 'representative', 'documents', 'validation'];

// Only keep a pre-filled select value the form can show (back-office merchants have a
// free-text sector, for instance).
const knownCode = (value, codes) => (codes.includes(value) ? value : '');

function prefill(kyc) {
  const company = { ...EMPTY_COMPANY, ...kyc.company };
  company.legalForm = knownCode(company.legalForm, LEGAL_FORMS);
  company.sector = knownCode(company.sector, SECTORS);
  const representative = { ...EMPTY_REPRESENTATIVE, ...(kyc.representative ?? {}) };
  representative.idType = knownCode(representative.idType, ID_TYPES);
  return { company, representative, acceptedTerms: false };
}

// Server errors are either { error } (ApiError.message) or { errors: { <field path>: message } }.
function describeError(err) {
  const fields = err instanceof ApiError ? err.data?.errors : null;
  if (fields && typeof fields === 'object') {
    return Object.entries(fields)
      .map(([path, message]) => `${path} : ${message}`)
      .join(' · ');
  }
  return err instanceof ApiError ? err.message : null;
}

function formatDate(isoString, locale) {
  if (!isoString) return '';
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export default function KycValidation() {
  const { t, locale } = useTranslation();
  const { token, merchant, refreshProfile } = useAuth();
  const { countries } = useCountries();
  const [kyc, setKyc] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState({});
  // Stored as { key, message? } so the text re-renders in the new language on switch.
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getKyc(token)
      .then((data) => {
        if (cancelled) return;
        setKyc(data);
        setForm(prefill(data));
        // The status kept in the session may be stale (e.g. approved by an admin since login).
        if (data.status !== merchant?.kycStatus) refreshProfile().catch(() => {});
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loadError) {
    return (
      <div className="alert alert--warning">{describeError(loadError) || t('kyc.errors.loadFailed')}</div>
    );
  }

  if (!kyc) {
    return <div className="card kyc-page__loading">{t('kyc.loading')}</div>;
  }

  if (!kyc.canSubmit) {
    const approved = kyc.status === 'approved';
    return (
      <div className="card kyc-status">
        <div className={`kyc-status__icon kyc-status__icon--${approved ? 'success' : 'warning'}`}>
          {approved ? '✓' : '…'}
        </div>
        <h2>{t(`kyc.status.${approved ? 'approved' : 'pending'}.title`)}</h2>
        <p>
          {t(`kyc.status.${approved ? 'approved' : 'pending'}.message`, {
            date: formatDate(kyc.submittedAt, locale),
          })}
        </p>
        <Link to="/dashboard" className="btn btn--primary">
          {t('kyc.goToDashboard')}
        </Link>
      </div>
    );
  }

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

  const validateStep = () => {
    if (STEPS[step] === 'documents') return validateDocuments(files, kyc.documents);
    if (STEPS[step] === 'validation' && !form.acceptedTerms) return { key: 'register.errors.termsRequired' };
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const invalid = validateStep();
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
      const { company, representative, acceptedTerms } = form;
      await submitKyc(token, buildKycFormData({ company, representative, acceptedTerms }, files));
      await refreshProfile().catch(() => {});
      setKyc((k) => ({ ...k, status: 'pending', canSubmit: false, submittedAt: new Date().toISOString() }));
    } catch (err) {
      // Server messages are shown as-is; they aren't in our locale files.
      const message = describeError(err);
      setError(message ? { message } : { key: 'register.errors.submitFailed' });
    } finally {
      setSubmitting(false);
    }
  };

  const errorText =
    error &&
    (error.message ||
      t(error.key, error.document ? { document: t(`register.documents.${error.document}`) } : undefined));

  const { company, representative } = form;
  const countryName = countries.find((c) => c.codeAlpha2 === company.country)?.name ?? company.country;
  const recap = [
    [t('register.company.name'), company.name],
    [t('register.company.legalForm'), company.legalForm && t(`register.legalForms.${company.legalForm}`)],
    [t('register.company.rccm'), company.rccm],
    [t('register.company.taxId'), company.taxId],
    [t('register.company.country'), [countryName, company.city].filter(Boolean).join(' — ')],
    [t('kyc.recap.representative'), `${representative.firstName} ${representative.lastName}`.trim()],
    [t('register.representative.position'), representative.position],
    [
      t('register.representative.idType'),
      [representative.idType && t(`register.idTypes.${representative.idType}`), representative.idNumber]
        .filter(Boolean)
        .join(' — '),
    ],
  ];

  return (
    <form className="card kyc-page" onSubmit={handleSubmit}>
      <div className="card__header">
        {t('kyc.title')}
        <div className="card__subheader">{t('kyc.subtitle')}</div>
      </div>
      <div className="card__body kyc-page__body">
        {kyc.status === 'rejected' && (
          <div className="alert alert--warning">
            <strong>{t('kyc.rejected')}</strong>
            {kyc.rejectionReason && <> {kyc.rejectionReason}</>}
          </div>
        )}

        <StepIndicator steps={STEPS} current={step} prefix="kyc" />

        <fieldset className="register-card__fields" disabled={submitting}>
          {STEPS[step] === 'company' && (
            <CompanyFields
              values={company}
              onChange={(key) => update('company', key)}
              countries={countries}
              locked={['name', 'country']}
            />
          )}

          {STEPS[step] === 'representative' && (
            <RepresentativeFields values={representative} onChange={(key) => update('representative', key)} />
          )}

          {STEPS[step] === 'documents' && (
            <DocumentsFields files={files} onChange={updateFile} stored={kyc.documents} />
          )}

          {STEPS[step] === 'validation' && (
            <div className="kyc-recap">
              <p className="register-card__hint">{t('kyc.recap.hint')}</p>
              <dl className="kyc-recap__list">
                {recap.map(([label, value]) => (
                  <div key={label} className="kyc-recap__row">
                    <dt>{label}</dt>
                    <dd>{value || '—'}</dd>
                  </div>
                ))}
                <div className="kyc-recap__row">
                  <dt>{t('register.steps.documents')}</dt>
                  <dd>
                    <ul className="kyc-recap__docs">
                      {DOCUMENTS.filter((d) => files[d.key] || kyc.documents[d.key]).map((d) => (
                        <li key={d.key}>{t(`register.documents.${d.key}`)}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
              <label className="checkbox-row">
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
            {step < STEPS.length - 1 ? t('common.next') : submitting ? t('register.submitting') : t('kyc.submit')}
          </button>
        </div>
      </div>
    </form>
  );
}
