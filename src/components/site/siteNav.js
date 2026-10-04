// Pages of the public showcase site, shared by the site header/footer (SiteLayout) and the
// login/register header (AuthHeader). Labels are `site.nav.<key>`.

// Header menu: links, and groups shown as dropdowns (`items` are ROUTES keys).
export const MAIN_NAV = [
  { key: 'product', items: ['presentation', 'services', 'partners'] },
  { key: 'pricing' },
  { key: 'docs' },
  { key: 'help', items: ['faq', 'contact'] },
];

export const FOOTER_NAV = [
  { title: 'product', links: ['presentation', 'services', 'pricing', 'partners'] },
  { title: 'developers', links: ['docs', 'sandbox', 'portal'] },
  { title: 'help', links: ['faq', 'support', 'contact'] },
  { title: 'legal', links: ['terms', 'privacy', 'legal'] },
];

// Every link the footer can show, by key.
export const ROUTES = {
  presentation: '/presentation',
  services: '/services',
  partners: '/partners',
  pricing: '/pricing',
  docs: '/docs',
  sandbox: '/docs#environments',
  portal: '/login',
  faq: '/faq',
  support: '/support',
  contact: '/contact',
  terms: '/terms',
  privacy: '/privacy',
  legal: '/legal',
};
