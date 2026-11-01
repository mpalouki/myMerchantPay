import { useState } from 'react';
import Icon from './Icon.jsx';
import Tabs from './Tabs.jsx';
import { readApiErrors } from '../data/team.js';
import { currencyLabel } from '../data/reload.js';
import { formatMoney } from '../data/transfer.js';
import { SUBMIT_TYPES, bodyFromForm, formTotal, newItem, toAmount } from '../data/paymentLinks.js';

// The payment link form (pages/PaymentLinkNew.jsx and PaymentLinkEdit.jsx), laid out like
// Stripe's: the settings on the left ("Page de paiement" and "Après le paiement" tabs), a live
// preview of the payer's page on the right. `applications` are the account's (creation only:
// a link keeps its application and mode). onSubmit(body) is awaited; the API's field errors
// (already in French) are shown next to their fields.

const MAX_ITEMS = 20;
const FORM_TABS = [
  { key: 'page', label: 'Page de paiement' },
  { key: 'after', label: 'Après le paiement' },
];

export default function PaymentLinkForm({ initial, applications, currency, merchantName, submitLabel, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial);
  const [tab, setTab] = useState('page');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const creating = Boolean(applications);
  const application = applications?.find((a) => String(a.id) === form.applicationId);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setItem = (key, patch) => set({ items: form.items.map((i) => (i.key === key ? { ...i, ...patch } : i)) });
  const setCustom = (patch) => set({ custom: { ...form.custom, ...patch } });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit(bodyFromForm(form, creating));
    } catch (err) {
      const { fields, message } = readApiErrors(err);
      setErrors(fields ?? { form: message });
      // Show the tab holding the first error.
      const first = Object.keys(fields ?? {})[0] ?? '';
      if (first.startsWith('afterCompletion')) setTab('after');
      else if (first) setTab('page');
    } finally {
      setSubmitting(false);
    }
  };

  const err = (field) => errors[field] && <small className="field__error">{errors[field]}</small>;

  return (
    <form className="plink-form" onSubmit={submit} noValidate>
      <div className="plink-form__settings">
        {creating && (
          <section className="plink-form__section">
            <h3>Encaisser sur</h3>
            <label className="field field--stacked">
              <span>Application</span>
              <select value={form.applicationId} onChange={(e) => set({ applicationId: e.target.value, livemode: false })}>
                {applications.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <small>Le client pourra payer avec les moyens de paiement actifs de cette application.</small>
              {err('application')}
            </label>
            <div className="plink-mode" role="radiogroup" aria-label="Mode">
              <label className={`plink-mode__option${!form.livemode ? ' is-checked' : ''}`}>
                <input type="radio" name="livemode" checked={!form.livemode} onChange={() => set({ livemode: false })} />
                <strong>Test</strong>
                <small>Paiements simulés, pour essayer le lien.</small>
              </label>
              <label className={`plink-mode__option${form.livemode ? ' is-checked' : ''}${application?.productionMode ? '' : ' is-disabled'}`}>
                <input type="radio" name="livemode" checked={form.livemode} disabled={!application?.productionMode} onChange={() => set({ livemode: true })} />
                <strong>Production</strong>
                <small>{application?.productionMode ? 'De vrais paiements.' : 'L’application doit être en production.'}</small>
              </label>
            </div>
            {err('livemode')}
          </section>
        )}

        <Tabs tabs={FORM_TABS} active={tab} onChange={setTab} />

        {tab === 'page' && (
          <>
            <section className="plink-form__section">
              <h3>Type de paiement</h3>
              <div className="plink-choice">
                <label className={`plink-choice__option${form.type === 'fixed' ? ' is-checked' : ''}`}>
                  <input type="radio" name="type" checked={form.type === 'fixed'} onChange={() => set({ type: 'fixed' })} />
                  <Icon name="shop" size={18} />
                  <span>
                    <strong>Produits ou services</strong>
                    <small>Un prix fixé par vous</small>
                  </span>
                </label>
                <label className={`plink-choice__option${form.type === 'customer_chooses' ? ' is-checked' : ''}`}>
                  <input type="radio" name="type" checked={form.type === 'customer_chooses'} onChange={() => set({ type: 'customer_chooses' })} />
                  <Icon name="collect" size={18} />
                  <span>
                    <strong>Le client choisit le montant</strong>
                    <small>Dons, pourboires, acomptes</small>
                  </span>
                </label>
              </div>
            </section>

            {form.type === 'fixed' ? (
              <section className="plink-form__section">
                <h3>Produits</h3>
                {err('lineItems')}
                {form.items.map((item, index) => (
                  <fieldset key={item.key} className="plink-item">
                    <legend className="sr-only">Produit {index + 1}</legend>
                    <div className="plink-item__row">
                      <label className="field field--stacked plink-item__name">
                        <span>Nom</span>
                        <input value={item.name} maxLength={120} placeholder="Par exemple : Sac en wax" onChange={(e) => setItem(item.key, { name: e.target.value })} aria-invalid={Boolean(errors[`lineItems.${index}.name`])} />
                        {err(`lineItems.${index}.name`)}
                      </label>
                      {form.items.length > 1 && (
                        <button type="button" className="plink-item__remove" onClick={() => set({ items: form.items.filter((i) => i.key !== item.key) })} aria-label={`Retirer le produit ${index + 1}`} title="Retirer">
                          <Icon name="trash" size={16} />
                        </button>
                      )}
                    </div>
                    <div className="plink-item__row">
                      <label className="field field--stacked">
                        <span>Prix ({currencyLabel(currency)})</span>
                        <input inputMode="numeric" value={item.unitAmount} placeholder="0" onChange={(e) => setItem(item.key, { unitAmount: e.target.value })} aria-invalid={Boolean(errors[`lineItems.${index}.unitAmount`])} />
                        {err(`lineItems.${index}.unitAmount`)}
                      </label>
                      <label className="field field--stacked plink-item__qty">
                        <span>Quantité</span>
                        <input inputMode="numeric" value={item.quantity} onChange={(e) => setItem(item.key, { quantity: e.target.value })} aria-invalid={Boolean(errors[`lineItems.${index}.quantity`])} />
                        {err(`lineItems.${index}.quantity`)}
                      </label>
                    </div>
                    <details className="plink-item__more" open={Boolean(item.description || item.imageUrl || errors[`lineItems.${index}.imageUrl`])}>
                      <summary>Description et image</summary>
                      <label className="field field--stacked">
                        <span>Description (facultatif)</span>
                        <input value={item.description} maxLength={255} onChange={(e) => setItem(item.key, { description: e.target.value })} />
                        {err(`lineItems.${index}.description`)}
                      </label>
                      <label className="field field--stacked">
                        <span>Adresse de l’image (facultatif)</span>
                        <input value={item.imageUrl} placeholder="https://…" onChange={(e) => setItem(item.key, { imageUrl: e.target.value })} aria-invalid={Boolean(errors[`lineItems.${index}.imageUrl`])} />
                        {err(`lineItems.${index}.imageUrl`)}
                      </label>
                    </details>
                  </fieldset>
                ))}
                {form.items.length < MAX_ITEMS && (
                  <button type="button" className="link-btn plink-form__add" onClick={() => set({ items: [...form.items, newItem()] })}>
                    <Icon name="plus" size={14} /> Ajouter un produit
                  </button>
                )}
              </section>
            ) : (
              <section className="plink-form__section">
                <h3>Montant libre</h3>
                <label className="field field--stacked">
                  <span>Ce que le client paie</span>
                  <input value={form.custom.name} maxLength={120} placeholder="Par exemple : Don pour l’école" onChange={(e) => setCustom({ name: e.target.value })} aria-invalid={Boolean(errors['customAmount.name'])} />
                  {err('customAmount.name')}
                </label>
                <label className="field field--stacked">
                  <span>Description (facultatif)</span>
                  <input value={form.custom.description} maxLength={255} onChange={(e) => setCustom({ description: e.target.value })} />
                  {err('customAmount.description')}
                </label>
                <div className="plink-form__grid">
                  {[
                    ['preset', 'Montant proposé'],
                    ['minimum', 'Minimum'],
                    ['maximum', 'Maximum'],
                  ].map(([key, label]) => (
                    <label key={key} className="field field--stacked">
                      <span>
                        {label} ({currencyLabel(currency)})
                      </span>
                      <input inputMode="numeric" value={form.custom[key]} placeholder={key === 'minimum' ? '100' : key === 'maximum' ? '100 000 000' : 'Facultatif'} onChange={(e) => setCustom({ [key]: e.target.value })} aria-invalid={Boolean(errors[`customAmount.${key}`])} />
                      {err(`customAmount.${key}`)}
                    </label>
                  ))}
                </div>
              </section>
            )}

            <section className="plink-form__section">
              <h3>Options</h3>
              <label className="field field--stacked">
                <span>Texte du bouton</span>
                <select value={form.submitType} onChange={(e) => set({ submitType: e.target.value })}>
                  {SUBMIT_TYPES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.limitEnabled} onChange={(e) => set({ limitEnabled: e.target.checked })} />
                Limiter le nombre de paiements
              </label>
              {form.limitEnabled && (
                <label className="field field--stacked plink-form__indent">
                  <span>Désactiver le lien après</span>
                  <input inputMode="numeric" value={form.maxPayments} placeholder="Par exemple : 50" onChange={(e) => set({ maxPayments: e.target.value })} aria-invalid={Boolean(errors.maxPayments)} />
                  <small>paiements reçus. Utile pour un stock ou des places limités.</small>
                  {err('maxPayments')}
                </label>
              )}
            </section>
          </>
        )}

        {tab === 'after' && (
          <section className="plink-form__section">
            <h3>Après le paiement</h3>
            <label className={`plink-radio${form.afterType === 'message' ? ' is-checked' : ''}`}>
              <input type="radio" name="after" checked={form.afterType === 'message'} onChange={() => set({ afterType: 'message' })} />
              <span>
                <strong>Afficher la page de confirmation</strong>
                <small>GamaPay remercie le client et affiche le reçu.</small>
              </span>
            </label>
            {form.afterType === 'message' && (
              <label className="field field--stacked plink-form__indent">
                <span>Message personnalisé (facultatif)</span>
                <textarea rows={3} maxLength={500} value={form.message} placeholder="Par exemple : Merci ! Nous vous livrons sous 48 h." onChange={(e) => set({ message: e.target.value })} />
                {err('afterCompletion.message')}
              </label>
            )}
            <label className={`plink-radio${form.afterType === 'redirect' ? ' is-checked' : ''}`}>
              <input type="radio" name="after" checked={form.afterType === 'redirect'} onChange={() => set({ afterType: 'redirect' })} />
              <span>
                <strong>Rediriger vers votre site</strong>
                <small>Le client arrive sur votre page, avec les paramètres utm_* du lien.</small>
              </span>
            </label>
            {form.afterType === 'redirect' && (
              <label className="field field--stacked plink-form__indent">
                <span>Adresse de la page</span>
                <input value={form.redirectUrl} placeholder="https://www.votresite.com/merci" onChange={(e) => set({ redirectUrl: e.target.value })} aria-invalid={Boolean(errors['afterCompletion.url'])} />
                <small>{'{CHECKOUT_SESSION_ID}'} y est remplacé par l’identifiant du paiement.</small>
                {err('afterCompletion.url')}
              </label>
            )}
          </section>
        )}

        {errors.form && <div className="toast-inline plink-form__error" role="alert">{errors.form}</div>}

        <div className="plink-form__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel} disabled={submitting}>
            Annuler
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Enregistrement…' : submitLabel}
          </button>
        </div>
      </div>

      <Preview form={form} tab={tab} currency={currency} merchantName={merchantName} livemode={form.livemode} />
    </form>
  );
}

// The payer's page as the form stands, on a browser frame.
function Preview({ form, tab, currency, merchantName, livemode }) {
  const submit = SUBMIT_TYPES.find((s) => s.value === form.submitType)?.button ?? 'Payer';
  const fixed = form.type === 'fixed';
  const total = formTotal(form);
  const preset = toAmount(form.custom.preset);

  return (
    <aside className="plink-preview" aria-label="Aperçu">
      <div className="plink-preview__title">Aperçu</div>
      <div className="plink-preview__frame">
        <div className="plink-preview__bar">
          <span />
          <span />
          <span />
          <div className="plink-preview__url">
            <Icon name="lock" size={10} /> {tab === 'after' && form.afterType === 'redirect' ? form.redirectUrl || 'votresite.com' : 'Page de paiement GamaPay'}
          </div>
        </div>

        {tab === 'after' ? (
          <div className="plink-preview__page plink-preview__page--done">
            {form.afterType === 'redirect' ? (
              <p className="plink-preview__muted">Le client est redirigé vers votre site.</p>
            ) : (
              <>
                <span className="plink-preview__check">✓</span>
                <strong>Paiement reçu</strong>
                <p>{form.message.trim() || `Merci ! ${merchantName} a bien reçu votre paiement de ${formatMoney(fixed ? total : preset || 0, currency)}.`}</p>
              </>
            )}
          </div>
        ) : (
          <div className="plink-preview__page">
            <div className="plink-preview__summary">
              <div className="plink-preview__merchant">
                {merchantName} {!livemode && <span className="plink-preview__badge">Mode test</span>}
              </div>
              {fixed ? (
                <>
                  <div className="plink-preview__total">{formatMoney(total, currency)}</div>
                  <ul className="plink-preview__items">
                    {form.items.map((i) => (
                      <li key={i.key}>
                        {i.imageUrl.startsWith('https://') ? <img src={i.imageUrl} alt="" /> : <span className="plink-preview__thumb">{(i.name.trim() || '?').charAt(0).toUpperCase()}</span>}
                        <span>
                          {i.name.trim() || 'Nom du produit'}
                          {Number(toAmount(i.quantity)) > 1 && <small>Qté {i.quantity}</small>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <div className="plink-preview__name">{form.custom.name.trim() || 'Ce que le client paie'}</div>
                  {form.custom.description.trim() && <p className="plink-preview__muted">{form.custom.description}</p>}
                </>
              )}
            </div>
            <div className="plink-preview__pay">
              {fixed ? (
                <>
                  <div className="plink-preview__field">Pays</div>
                  <div className="plink-preview__method is-checked">Mobile money</div>
                  <div className="plink-preview__method">Carte bancaire</div>
                  <div className="plink-preview__field">Numéro de téléphone</div>
                </>
              ) : (
                <div className="plink-preview__field plink-preview__field--amount">{preset ? formatMoney(preset, currency) : `Montant (${currencyLabel(currency)})`}</div>
              )}
              <div className="plink-preview__button">{fixed ? `${submit} ${formatMoney(total, currency)}` : 'Continuer'}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
