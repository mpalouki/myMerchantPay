import { PageHero } from './SiteBlocks.jsx';
import { useTranslation } from '../../i18n/I18nContext.jsx';
import { fill, useLegalParams } from './legalParams.js';

// Long-form page (CGU, privacy policy, security & legal notice) from `site.<page>`:
// { hero: { eyebrow, title, lead }, updated, sections: [{ id, title, paragraphs?, list? }] }.
// `{{name}}` placeholders in the text are filled by useLegalParams() (legalParams.js).

export default function LegalPage({ page, children }) {
  const { t, tRaw } = useTranslation();
  const params = useLegalParams();
  const sections = tRaw(`site.${page}.sections`) ?? [];

  return (
    <>
      <PageHero
        eyebrow={t(`site.${page}.hero.eyebrow`)}
        title={t(`site.${page}.hero.title`)}
        lead={fill(t(`site.${page}.hero.lead`), params)}
      >
        <p className="site-hero__meta">{t('site.legalCommon.updated', { date: t(`site.${page}.updated`) })}</p>
      </PageHero>

      <section className="home-section">
        <div className="home-container site-with-toc">
          <nav className="site-toc" aria-label={t('site.legalCommon.toc')}>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>
                {s.title}
              </a>
            ))}
          </nav>

          <div className="site-prose">
            {children}
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2>{s.title}</h2>
                {(s.paragraphs ?? []).map((p) => (
                  <p key={p}>{fill(p, params)}</p>
                ))}
                {s.list && (
                  <ul>
                    {s.list.map((item) => (
                      <li key={item}>{fill(item, params)}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
