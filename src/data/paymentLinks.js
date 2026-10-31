import { formatMoney } from './transfer.js';

// Payment links ("Liens de paiement"): the form's model, its API body, and the URL helpers of the
// share panel. See getPaymentLinks… in api/client.js for the link's shape.

export const SUBMIT_TYPES = [
  { value: 'pay', label: 'Payer', button: 'Payer' },
  { value: 'book', label: 'Réserver', button: 'Réserver' },
  { value: 'donate', label: 'Faire un don', button: 'Donner' },
];

// The parameters a link URL may carry (as on Stripe): copied to the payment, invalid values ignored.
export const URL_PARAMETERS = [
  { name: 'client_reference_id', label: 'Référence client', hint: 'Votre numéro de commande ou de client, renvoyé avec le paiement (lettres, chiffres, - et _).' },
  { name: 'prefilled_phone', label: 'Téléphone pré-rempli', hint: 'Format international, par exemple +22890000000.' },
  { name: 'locale', label: 'Langue de la page', hint: 'fr ou en (par défaut : la langue du navigateur).' },
  { name: 'utm_source', label: 'utm_source', hint: 'D’où vient le client : facebook, whatsapp, newsletter…' },
  { name: 'utm_medium', label: 'utm_medium', hint: 'Le canal : social, email, sms…' },
  { name: 'utm_campaign', label: 'utm_campaign', hint: 'Le nom de votre campagne.' },
  { name: 'utm_content', label: 'utm_content', hint: 'Le contenu ou le visuel cliqué.' },
  { name: 'utm_term', label: 'utm_term', hint: 'Les mots-clés d’une annonce.' },
];

let itemKey = 0;
export function newItem(values = {}) {
  itemKey += 1;
  return { key: itemKey, name: '', description: '', imageUrl: '', unitAmount: '', quantity: '1', ...values };
}

export function emptyForm(applicationId = '') {
  return {
    applicationId: applicationId ? String(applicationId) : '',
    livemode: false,
    type: 'fixed',
    items: [newItem()],
    custom: { name: '', description: '', preset: '', minimum: '', maximum: '' },
    submitType: 'pay',
    afterType: 'message',
    message: '',
    redirectUrl: '',
    limitEnabled: false,
    maxPayments: '',
  };
}

const text = (value) => (value === null || value === undefined ? '' : String(value));

// A link from the API, as the form edits it.
export function formFromLink(link) {
  return {
    applicationId: String(link.application.id),
    livemode: link.livemode,
    type: link.type,
    items: link.lineItems.length
      ? link.lineItems.map((i) => newItem({ name: i.name, description: text(i.description), imageUrl: text(i.imageUrl), unitAmount: text(i.unitAmount), quantity: text(i.quantity) }))
      : [newItem()],
    custom: {
      name: text(link.customAmount?.name),
      description: text(link.customAmount?.description),
      preset: text(link.customAmount?.preset),
      minimum: text(link.customAmount?.minimum),
      maximum: text(link.customAmount?.maximum),
    },
    submitType: link.submitType,
    afterType: link.afterCompletion.type,
    message: text(link.afterCompletion.message),
    redirectUrl: text(link.afterCompletion.url),
    limitEnabled: link.maxPayments !== null,
    maxPayments: text(link.maxPayments),
  };
}

// Digits only ("25 000" -> 25000); '' stays '' (the API reports what is missing).
export function toAmount(value) {
  const digits = String(value ?? '').replace(/[\s\u00a0\u202f.,]/g, '');
  return /^\d+$/.test(digits) ? Number(digits) : digits === '' ? null : digits;
}

// The API body. `withTarget` adds the application and the mode (creation only).
export function bodyFromForm(form, withTarget) {
  const body = {
    type: form.type,
    submitType: form.submitType,
    afterCompletion: form.afterType === 'redirect' ? { type: 'redirect', url: form.redirectUrl.trim() } : { type: 'message', message: form.message.trim() || null },
    maxPayments: form.limitEnabled ? toAmount(form.maxPayments) ?? '' : null,
  };
  if (form.type === 'fixed') {
    body.lineItems = form.items.map((i) => ({
      name: i.name.trim(),
      description: i.description.trim() || null,
      imageUrl: i.imageUrl.trim() || null,
      unitAmount: toAmount(i.unitAmount),
      quantity: toAmount(i.quantity) ?? 1,
    }));
  } else {
    body.customAmount = {
      name: form.custom.name.trim(),
      description: form.custom.description.trim() || null,
      preset: toAmount(form.custom.preset),
      minimum: toAmount(form.custom.minimum),
      maximum: toAmount(form.custom.maximum),
    };
  }
  if (withTarget) {
    body.application = Number(form.applicationId) || null;
    body.livemode = form.livemode;
  }
  return body;
}

// The fixed price the form adds up to (0 while prices are missing).
export function formTotal(form) {
  return form.items.reduce((sum, i) => {
    const price = toAmount(i.unitAmount);
    const quantity = toAmount(i.quantity) ?? 1;
    return typeof price === 'number' && typeof quantity === 'number' ? sum + price * quantity : sum;
  }, 0);
}

// What a link asks for, for lists: "25 000 FCFA", or "Montant libre".
export function linkPrice(link) {
  return link.type === 'fixed' ? formatMoney(link.amount, link.currency) : 'Montant libre';
}

// The link URL with the parameters that have a value.
export function urlWithParameters(url, values) {
  const params = new URLSearchParams();
  URL_PARAMETERS.forEach(({ name }) => {
    const value = (values[name] ?? '').trim();
    if (value) params.set(name, value);
  });
  const query = params.toString();
  return query ? `${url}?${query}` : url;
}

// Where to share a link, each opening the app or site with the link filled in.
export function shareTargets(url, name) {
  const message = `${name} : ${url}`;
  return [
    { key: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(message)}` },
    { key: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { key: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(name)}` },
    { key: 'email', label: 'E-mail', href: `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(message)}` },
    { key: 'sms', label: 'SMS', href: `sms:?&body=${encodeURIComponent(message)}` },
  ];
}
