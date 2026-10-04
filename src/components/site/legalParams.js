import { useTranslation } from '../../i18n/I18nContext.jsx';
import { COMPANY, CONTACT } from '../../data/site.js';

// Values for the `{{name}}` placeholders of the legal texts, from data/site.js (company and
// contact details). A detail that isn't set yet shows as "to be completed" rather than vanishing.
export function useLegalParams() {
  const { t } = useTranslation();
  const missing = t('site.legalCommon.missing');
  const or = (value) => value || missing;
  return {
    brand: COMPANY.brand,
    legalName: or(COMPANY.legalName),
    legalForm: or(COMPANY.legalForm),
    registration: or(COMPANY.registration),
    taxId: or(COMPANY.taxId),
    address: or(COMPANY.address),
    director: or(COMPANY.director),
    host: or(COMPANY.host),
    email: CONTACT.email,
    supportEmail: CONTACT.supportEmail,
    privacyEmail: CONTACT.privacyEmail,
    securityEmail: CONTACT.securityEmail,
  };
}

export const fill = (text, params) => text.replace(/\{\{(\w+)\}\}/g, (match, name) => params[name] ?? match);
