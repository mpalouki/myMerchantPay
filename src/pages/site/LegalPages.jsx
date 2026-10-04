import LegalPage from '../../components/site/LegalPage.jsx';
import { useLegalParams } from '../../components/site/legalParams.js';
import { useTranslation } from '../../i18n/I18nContext.jsx';

// CGU, politique de confidentialité, sécurité & mentions légales. Their text lives in the
// locale files (site.terms / site.privacy / site.legal) and must be reviewed by a lawyer
// before publication; company details come from data/site.js.

export function Terms() {
  return <LegalPage page="terms" />;
}

export function Privacy() {
  return <LegalPage page="privacy" />;
}

const IDENTITY = ['legalName', 'legalForm', 'registration', 'taxId', 'address', 'director', 'email', 'host'];

// Mentions légales open with the publisher's identity card, then the security sections.
export function Legal() {
  const { t } = useTranslation();
  const params = useLegalParams();

  return (
    <LegalPage page="legal">
      <section id="publisher" className="site-identity">
        <h2>{t('site.legal.identity.title')}</h2>
        <dl>
          {IDENTITY.map((key) => (
            <div key={key}>
              <dt>{t(`site.legal.identity.${key}`)}</dt>
              <dd>{params[key]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </LegalPage>
  );
}
