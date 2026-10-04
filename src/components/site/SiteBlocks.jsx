import { Link } from 'react-router-dom';
import Icon from '../Icon.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';

// Building blocks shared by the showcase pages.

// Dark banner at the top of every page but the home page.
export function PageHero({ eyebrow, title, lead, children }) {
  return (
    <section className="site-hero">
      <div className="home-container">
        {eyebrow && <span className="home-eyebrow home-eyebrow--light">{eyebrow}</span>}
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = 'center' }) {
  return (
    <div className={`home-heading home-heading--${align}`}>
      {eyebrow && <span className="home-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p className="home-lead">{subtitle}</p>}
    </div>
  );
}

// Card with an icon, used for services, features, audiences…
export function FeatureCard({ icon, title, text, to, linkLabel }) {
  return (
    <article className="home-card">
      <span className="home-card__icon">
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {to && (
        <Link to={to} className="site-more">
          {linkLabel} <Icon name="chevronRight" size={14} />
        </Link>
      )}
    </article>
  );
}

// "Open an account" banner closing most pages.
export function CtaBanner() {
  const { t } = useTranslation();
  return (
    <section className="home-section home-section--tight">
      <div className="home-container">
        <div className="home-cta">
          <div>
            <h2>{t('site.cta.title')}</h2>
            <p>{t('site.cta.text')}</p>
          </div>
          <div className="site-cta__actions">
            <Link to="/register" className="btn home-btn--white home-btn--lg">
              {t('site.cta.button')}
            </Link>
            <Link to="/contact" className="btn home-btn--ghost-light home-btn--lg">
              {t('site.cta.contact')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Ticks({ items }) {
  return (
    <ul className="home-ticks">
      {items.map((item) => (
        <li key={item}>
          <Icon name="check" size={16} /> {item}
        </li>
      ))}
    </ul>
  );
}
