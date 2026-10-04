import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { PageHero } from '../../components/site/SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';

// FAQ: questions grouped by topic (site.faq.groups, [{ key, title, items: [{ q, a }] }]),
// with a search box filtering questions and answers.

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Faq() {
  const { t, tRaw } = useTranslation();
  const [query, setQuery] = useState('');
  const groups = tRaw('site.faq.groups') ?? [];

  const needle = normalize(query.trim());
  const filtered = groups
    .map((g) => ({ ...g, items: g.items.filter(({ q, a }) => !needle || normalize(`${q} ${a}`).includes(needle)) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHero eyebrow={t('site.faq.hero.eyebrow')} title={t('site.faq.hero.title')} lead={t('site.faq.hero.lead')}>
        <label className="site-search">
          <Icon name="help" size={18} />
          <span className="sr-only">{t('site.faq.search')}</span>
          <input
            type="search"
            placeholder={t('site.faq.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </PageHero>

      <section className="home-section">
        <div className="home-container site-with-toc">
          <nav className="site-toc" aria-label={t('site.faq.hero.eyebrow')}>
            {groups.map((g) => (
              <a key={g.key} href={`#${g.key}`}>
                {g.title}
              </a>
            ))}
          </nav>

          <div>
            {filtered.length === 0 && <p className="home-lead">{t('site.faq.empty')}</p>}
            {filtered.map((g) => (
              <section key={g.key} id={g.key} className="site-faq-group">
                <h2>{g.title}</h2>
                <div className="site-faq">
                  {g.items.map(({ q, a }) => (
                    <details key={q} className="site-faq__item" open={!!needle}>
                      <summary>
                        {q}
                        <Icon name="chevronDown" size={18} />
                      </summary>
                      <p>{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <div className="site-band site-gap-top">
              <div>
                <h2>{t('site.faq.more.title')}</h2>
                <p className="home-lead">{t('site.faq.more.text')}</p>
              </div>
              <Link to="/contact" className="btn btn--primary home-btn--lg">
                {t('site.faq.more.button')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
