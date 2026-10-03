import { useState } from 'react';
import { SERVICE_LABELS, groupPaymentMethods } from '../data/apiApplications.js';
import { readApiErrors } from '../data/teams.js';

// Configuration form of an "Intégrez notre API" application (designs "2- Add a…" and
// "3- Edit Configuration-des-applications.pdf"): identity, services, production mode,
// invoice, payment methods shown on the payment page, and the IPN endpoint. Used to create
// (pages/ApiApplicationNew.jsx) and edit (pages/ApiApplicationEdit.jsx) an application.
//
// `initial` is an application from the API (or NEW_APPLICATION); `options` comes from
// useApplicationOptions(). onSubmit(body) gets the API body (see createApplication in
// client.js) and is awaited: if it throws, the API's errors are shown on the form.

const URL_PATTERN = /^https?:\/\/[^\s.]+\.[^\s]+$/i;

function validate(values) {
  const errors = {};
  if (!values.name) errors.name = "Veuillez saisir le nom de l'application.";
  else if (values.name.length > 50) errors.name = 'Le nom ne doit pas dépasser 50 caractères.';
  if (!values.description) errors.description = 'Veuillez saisir une petite description.';
  if (values.website && !URL_PATTERN.test(values.website))
    errors.website = 'Saisissez une adresse complète, par exemple https://www.exemple.com.';
  if (values.services.length === 0) errors.services = 'Sélectionnez au moins un service.';
  if (values.paymentMethods.length === 0) errors.paymentMethods = 'Sélectionnez au moins un moyen de paiement.';
  if (values.ipn.enabled && !values.ipn.endpoint)
    errors.ipnEndpoint = "Saisissez l'endpoint IPN pour activer les notifications.";
  else if (values.ipn.endpoint && !URL_PATTERN.test(values.ipn.endpoint))
    errors.ipnEndpoint = 'Saisissez une adresse complète, par exemple https://votresite.com/payment-status.php.';
  return errors;
}

// The API answers in English, keyed by body field: show French, per field.
function serverFieldErrors(fields) {
  const errors = {};
  if (fields.name) errors.name = 'Veuillez saisir un nom de 50 caractères maximum.';
  if (fields.description) errors.description = 'Veuillez saisir une description de 255 caractères maximum.';
  if (fields.website) errors.website = 'Saisissez une adresse complète, par exemple https://www.exemple.com.';
  if (fields.services) errors.services = 'Sélectionnez au moins un service valide.';
  if (fields.paymentMethods)
    errors.paymentMethods = 'Un moyen de paiement choisi n’est plus disponible : rechargez la page.';
  if (fields['ipn.endpoint']) errors.ipnEndpoint = "Vérifiez l'endpoint IPN (adresse complète, requise pour l'activer).";
  if (fields.balance) errors.form = 'Ce compte est introuvable : rechargez la page.';
  return errors;
}

function Row({ label, required, htmlFor, error, children }) {
  return (
    <div className="app-form__row">
      <label className="app-form__label" htmlFor={htmlFor}>
        {required && <em className="required">* </em>}
        {label}
      </label>
      <div className="app-form__control">
        {children}
        {error && <small className="field__error">{error}</small>}
      </div>
    </div>
  );
}

const scrollToFirstError = () =>
  requestAnimationFrame(() => document.querySelector('.app-form .field__error, .app-form .toast-inline--error')?.scrollIntoView({ block: 'center' }));

export default function ApplicationForm({ initial, options, submitLabel, onSubmit, onCancel }) {
  const [name, setName] = useState(initial.name ?? '');
  const [description, setDescription] = useState(initial.description ?? '');
  const [website, setWebsite] = useState(initial.website ?? '');
  const [services, setServices] = useState(initial.services ?? []);
  const [productionMode, setProductionMode] = useState(initial.productionMode ?? false);
  const [invoiceEnabled, setInvoiceEnabled] = useState(initial.invoiceEnabled ?? true);
  // Payment method ids.
  const [paymentMethods, setPaymentMethods] = useState(() => (initial.paymentMethods ?? []).map((m) => m.id));
  const [ipnEndpoint, setIpnEndpoint] = useState(initial.ipn?.endpoint ?? '');
  const [ipnEnabled, setIpnEnabled] = useState(initial.ipn?.enabled ?? false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const toggle = (setter) => (value) =>
    setter((list) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value]));
  const toggleService = toggle(setServices);
  const toggleMethod = toggle(setPaymentMethods);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = {
      name: name.trim(),
      description: description.trim(),
      website: website.trim() || null,
      // In the options' order whatever the click order.
      services: options.services.filter((s) => services.includes(s)),
      productionMode,
      invoiceEnabled,
      paymentMethods: options.paymentMethods.map((m) => m.id).filter((id) => paymentMethods.includes(id)),
      ipn: { endpoint: ipnEndpoint.trim() || null, enabled: ipnEnabled },
    };
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length > 0) {
      scrollToFirstError();
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      const { fields, message } = readApiErrors(err);
      setErrors(fields ? serverFieldErrors(fields) : { form: message });
      setSubmitting(false);
      scrollToFirstError();
    }
  };

  return (
    <form className="app-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="app-form__fields" disabled={submitting}>
        <div className="app-form__grid">
          <Row label="Nom de l'application" required htmlFor="app-name" error={errors.name}>
            <input
              id="app-name"
              placeholder="Nom de l'application"
              value={name}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
            />
          </Row>
          <Row label="Petite Description" required htmlFor="app-description" error={errors.description}>
            <textarea
              id="app-description"
              rows={4}
              placeholder="Dites-nous ce que fait votre application"
              value={description}
              maxLength={255}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
            />
          </Row>
          <Row label="URL du site Web" htmlFor="app-website" error={errors.website}>
            <input
              id="app-website"
              type="url"
              placeholder="http://www.exemple.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              aria-invalid={!!errors.website}
            />
          </Row>
          <Row label="Services" error={errors.services}>
            <div className="app-form__inline-checks" role="group" aria-label="Services">
              {options.services.map((s) => (
                <label key={s} className="checkbox-row">
                  <input type="checkbox" checked={services.includes(s)} onChange={() => toggleService(s)} />
                  <span>{SERVICE_LABELS[s] ?? s}</span>
                </label>
              ))}
            </div>
          </Row>
          <Row label="Activer le mode production" htmlFor="app-production">
            <select
              id="app-production"
              value={productionMode ? 'yes' : 'no'}
              onChange={(e) => setProductionMode(e.target.value === 'yes')}
            >
              <option value="no">Mode test, je veux faire des tests de paiements.</option>
              <option value="yes">Oui, l&apos;application est prête.</option>
            </select>
          </Row>
          <Row label="Envoyer Facture après paiement" htmlFor="app-invoice">
            <select
              id="app-invoice"
              value={invoiceEnabled ? 'yes' : 'no'}
              onChange={(e) => setInvoiceEnabled(e.target.value === 'yes')}
            >
              <option value="yes">Envoyer une facture au client</option>
              <option value="no">Ne pas envoyer de facture</option>
            </select>
          </Row>
        </div>

        <section className="app-form__section">
          <h3>Moyens de paiements à afficher sur la page de paiement</h3>
          <p className="app-form__hint">
            ⓘ Il s&apos;agit des méthodes de paiement que vous souhaitez activer au niveau de cette intégration.
          </p>
          {options.paymentMethods.length === 0 && (
            <p className="app-form__hint">Aucun moyen de paiement n&apos;est disponible pour le moment.</p>
          )}
          {groupPaymentMethods(options.paymentMethods).map(({ group, methods }) => (
            <fieldset key={group} className="app-form__group">
              <legend>{group}</legend>
              <div className="app-form__group-box">
                {methods.map((m) => (
                  <label key={m.id} className="checkbox-row">
                    <input type="checkbox" checked={paymentMethods.includes(m.id)} onChange={() => toggleMethod(m.id)} />
                    <span>{m.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          {errors.paymentMethods && <small className="field__error">{errors.paymentMethods}</small>}
        </section>

        <section className="app-form__section">
          <h3>Instant Payment Notification (IPN)</h3>
          <p className="app-form__hint">
            ⓘ Il s&apos;agit d&apos;une adresse URL sur laquelle vous serez notifié une fois que le client aura confirmé
            le paiement.
          </p>
          <div className="app-form__group-box app-form__ipn">
            <Row label="Endpoint IPN" htmlFor="app-ipn-endpoint" error={errors.ipnEndpoint}>
              <input
                id="app-ipn-endpoint"
                type="url"
                placeholder="Ex: http://votresite.com/payment-status.php"
                value={ipnEndpoint}
                onChange={(e) => setIpnEndpoint(e.target.value)}
                aria-invalid={!!errors.ipnEndpoint}
              />
            </Row>
            <Row label="Activer" htmlFor="app-ipn-enabled">
              <select
                id="app-ipn-enabled"
                value={ipnEnabled ? 'yes' : 'no'}
                onChange={(e) => setIpnEnabled(e.target.value === 'yes')}
              >
                <option value="no">Non</option>
                <option value="yes">Oui</option>
              </select>
            </Row>
          </div>
        </section>
      </fieldset>

      {errors.form && (
        <div className="toast-inline toast-inline--error app-form__error" role="alert">
          {errors.form}
        </div>
      )}

      <div className="app-form__actions">
        <button type="submit" className="btn btn--teal" disabled={submitting}>
          {submitting ? 'Enregistrement…' : submitLabel}
        </button>
        <span>ou</span>
        <button type="button" className="link-btn" onClick={onCancel} disabled={submitting}>
          Annuler
        </button>
      </div>
    </form>
  );
}
