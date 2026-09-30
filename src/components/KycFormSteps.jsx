import Flag from './Flag.jsx';
import { ACCEPTED_FILES, DOCUMENTS, ID_TYPES, LEGAL_FORMS, SECTORS } from '../data/kyc.js';
import { useTranslation } from '../i18n/I18nContext.jsx';

// Form steps for the KYC part of a merchant application, shared by public registration
// (Register.jsx) and KYC validation inside the portal (KycValidation.jsx). Field labels live
// under register.*; constants and payload helpers are in data/kyc.js.

export function Field({ label, required, full, children }) {
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

// `steps` are keys under register.steps (or kyc.steps when prefix is 'kyc').
export function StepIndicator({ steps, current, prefix = 'register' }) {
  const { t } = useTranslation();
  return (
    <ol className="register-steps">
      {steps.map((key, i) => (
        <li
          key={key}
          className={`register-steps__item ${i === current ? 'register-steps__item--active' : ''} ${
            i < current ? 'register-steps__item--done' : ''
          }`}
        >
          <span className="register-steps__index">{i + 1}</span>
          <span className="register-steps__label">{t(`${prefix}.steps.${key}`)}</span>
        </li>
      ))}
    </ol>
  );
}

function SelectPlaceholder() {
  const { t } = useTranslation();
  return (
    <option value="" disabled>
      {t('common.select')}
    </option>
  );
}

// `onChange(key)` returns the input's change handler. `locked` lists company keys shown
// read-only (the portal can't change the name or home country set at merchant creation).
export function CompanyFields({ values, onChange, countries, locked = [] }) {
  const { t } = useTranslation();
  const isLocked = (key) => locked.includes(key);
  return (
    <div className="register-grid">
      <Field label={t('register.company.name')} required>
        <input value={values.name} onChange={onChange('name')} readOnly={isLocked('name')} required />
      </Field>
      <Field label={t('register.company.tradeName')}>
        <input value={values.tradeName} onChange={onChange('tradeName')} />
      </Field>
      <Field label={t('register.company.legalForm')} required>
        <select value={values.legalForm} onChange={onChange('legalForm')} required>
          <SelectPlaceholder />
          {LEGAL_FORMS.map((code) => (
            <option key={code} value={code}>
              {t(`register.legalForms.${code}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('register.company.sector')} required>
        <select value={values.sector} onChange={onChange('sector')} required>
          <SelectPlaceholder />
          {SECTORS.map((code) => (
            <option key={code} value={code}>
              {t(`register.sectors.${code}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('register.company.rccm')} required>
        <input value={values.rccm} onChange={onChange('rccm')} required />
      </Field>
      <Field label={t('register.company.taxId')} required>
        <input value={values.taxId} onChange={onChange('taxId')} required />
      </Field>
      <Field label={t('register.company.creationDate')} required>
        <input type="date" value={values.creationDate} onChange={onChange('creationDate')} required />
      </Field>
      <Field label={t('register.company.country')} required>
        <div className="country-select">
          <Flag code={values.country} />
          <select value={values.country} onChange={onChange('country')} disabled={isLocked('country')} required>
            <SelectPlaceholder />
            {countries.map((c) => (
              <option key={c.codeAlpha2} value={c.codeAlpha2}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Field>
      <Field label={t('register.company.city')} required>
        <input value={values.city} onChange={onChange('city')} required />
      </Field>
      <Field label={t('register.company.phone')} required>
        <input type="tel" value={values.phone} onChange={onChange('phone')} required />
      </Field>
      <Field label={t('register.company.address')} required full>
        <input value={values.address} onChange={onChange('address')} required />
      </Field>
      <Field label={t('register.company.website')} full>
        <input type="url" placeholder="https://" value={values.website} onChange={onChange('website')} />
      </Field>
    </div>
  );
}

export function RepresentativeFields({ values, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="register-grid">
      <Field label={t('register.representative.lastName')} required>
        <input value={values.lastName} onChange={onChange('lastName')} required />
      </Field>
      <Field label={t('register.representative.firstName')} required>
        <input value={values.firstName} onChange={onChange('firstName')} required />
      </Field>
      <Field label={t('register.representative.birthDate')} required>
        <input type="date" value={values.birthDate} onChange={onChange('birthDate')} required />
      </Field>
      <Field label={t('register.representative.nationality')} required>
        <input value={values.nationality} onChange={onChange('nationality')} required />
      </Field>
      <Field label={t('register.representative.position')} required full>
        <input
          placeholder={t('register.representative.positionPlaceholder')}
          value={values.position}
          onChange={onChange('position')}
          required
        />
      </Field>
      <Field label={t('register.representative.idType')} required>
        <select value={values.idType} onChange={onChange('idType')} required>
          <SelectPlaceholder />
          {ID_TYPES.map((code) => (
            <option key={code} value={code}>
              {t(`register.idTypes.${code}`)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={t('register.representative.idNumber')} required>
        <input value={values.idNumber} onChange={onChange('idNumber')} required />
      </Field>
      <Field label={t('register.representative.idExpiryDate')} required>
        <input type="date" value={values.idExpiryDate} onChange={onChange('idExpiryDate')} required />
      </Field>
      <Field label={t('register.representative.phone')} required>
        <input type="tel" value={values.phone} onChange={onChange('phone')} required />
      </Field>
      <Field label={t('register.representative.email')} required full>
        <input type="email" value={values.email} onChange={onChange('email')} required />
      </Field>
    </div>
  );
}

// `onChange(key)` returns the file input's change handler. A document already on file
// (`stored[key]`) isn't required again: picking a new file replaces it.
export function DocumentsFields({ files, onChange, stored = {} }) {
  const { t } = useTranslation();
  return (
    <div className="register-docs">
      <p className="register-card__hint">{t('register.documents.hint')}</p>
      {DOCUMENTS.map((doc) => (
        <label key={doc.key} className="field field--stacked register-docs__item">
          <span>
            {t(`register.documents.${doc.key}`)} {doc.required && !stored[doc.key] ? '*' : t('common.optional')}
          </span>
          <input type="file" accept={ACCEPTED_FILES} onChange={onChange(doc.key)} />
          {files[doc.key] ? (
            <small>{files[doc.key].name}</small>
          ) : (
            stored[doc.key] && <small className="register-docs__stored">{t('kyc.documentOnFile')}</small>
          )}
        </label>
      ))}
    </div>
  );
}
