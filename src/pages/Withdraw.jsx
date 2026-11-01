import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertDialog from '../components/AlertDialog.jsx';
import usePermissions from '../hooks/usePermissions.js';
import Flag from '../components/Flag.jsx';
import Icon from '../components/Icon.jsx';
import WithdrawalHistory from '../components/WithdrawalHistory.jsx';
import {
  createWithdrawalAccount,
  deleteWithdrawalAccount,
  getReloadWallets,
  getWithdrawalAccounts,
  setDefaultWithdrawalAccount,
} from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { isValidPhone, normalizePhone, phonePlaceholder } from '../data/reload.js';

// "Retirer de l'argent": the mobile money wallets and bank accounts the merchant's withdrawals are
// paid to, for one of their accounts (the dashboard's selected one, switchable with "Pays"). Each
// account has its own list, with one default (GET/POST /api/merchant/withdrawal-accounts).
// Without any, the page is the "Formulaire d'ajout de compte de retrait"; otherwise it lists them
// ("Mes comptes de retrait"), with a button to open that form. Below either, the account's
// withdrawal history (components/WithdrawalHistory.jsx). Making a withdrawal isn't built yet.

const METHODS = [
  { key: 'mobile', label: 'Mobile money' },
  { key: 'bank', label: 'Compte bancaire' },
];

// French messages for the API's validation errors (422 { errors: { field } }), by body field.
const WITHDRAWAL_ERRORS = {
  method: 'Type de compte de retrait inconnu.',
  balance: 'Ce compte est introuvable.',
  paymentType: 'Veuillez choisir un mobile money de ce pays',
  phone: 'Veuillez entrer un numéro de téléphone correct (ou ce numéro est déjà enregistré pour ce mobile money)',
  bankName: 'Veuillez entrer le nom de la banque (100 caractères maximum)',
  accountName: "Veuillez entrer l'intitulé du compte (150 caractères maximum)",
  rib: 'Veuillez entrer un RIB (50 caractères maximum) qui ne soit pas déjà enregistré',
  ribConfirmation: 'Les deux RIB saisis sont différents',
};

function errorMessage(err, fallback) {
  const errors = err?.data?.errors ?? {};
  const field = Object.keys(errors)[0];
  if (field) return WITHDRAWAL_ERRORS[field] ?? errors[field];
  return err?.message || fallback;
}

// A RIB without spaces, in capitals, to compare two spellings of it (as the API does).
function compactRib(value) {
  return value.replace(/\s+/g, '').toUpperCase();
}

export default function Withdraw() {
  const [method, setMethod] = useState('mobile');
  const { balances, selectedBalance, selectCountry, loading, error } = useAccount();
  const balanceId = selectedBalance?.id;
  // The answer for one account: loading until it is the selected one.
  const [saved, setSaved] = useState({ balanceId: null, list: [], error: '' });
  const savedLoading = Boolean(balanceId) && saved.balanceId !== balanceId;

  const loadSaved = useCallback(() => {
    if (!balanceId) return undefined;
    let cancelled = false;
    getWithdrawalAccounts(balanceId)
      .then((list) => !cancelled && setSaved({ balanceId, list: Array.isArray(list) ? list : [], error: '' }))
      .catch((err) => !cancelled && setSaved({ balanceId, list: [], error: err?.message || 'Erreur inconnue' }));
    return () => {
      cancelled = true;
    };
  }, [balanceId]);

  useEffect(() => loadSaved(), [loadSaved]);

  // The form is shown when the account has no withdrawal account yet, or on request.
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();
  const hasAccounts = saved.list.length > 0;
  // Adding, removing or changing the default account needs withdrawal_accounts.manage.
  const canManage = usePermissions().can('withdrawal_accounts.manage');

  const closeForm = () => {
    setAdding(false);
    loadSaved();
  };
  // "Revenir en arrière": back to the list, or to the previous page when there is no list.
  const back = () => (hasAccounts ? setAdding(false) : navigate(-1));

  const countrySelect = (label) =>
    selectedBalance && <CountrySelect label={label} balances={balances} value={selectedBalance} onChange={selectCountry} />;

  let message = null;
  if (loading) message = <p className="reload__empty">Chargement de vos comptes…</p>;
  else if (error) message = <div className="toast-inline toast-inline--error">Impossible de charger vos comptes : {error.message}</div>;
  else if (!selectedBalance) message = <p className="reload__empty">Vous n&apos;avez encore aucun compte.</p>;
  else if (savedLoading) message = <p className="reload__empty">Chargement de vos comptes de retrait…</p>;

  if (message) {
    return (
      <div className="card reload withdraw">
        <div className="card__header">Retirer de l&apos;argent</div>
        <div className="card__body">{message}</div>
      </div>
    );
  }

  // Below the list or the form. Keyed by account: another one starts on page 1.
  const history = <WithdrawalHistory key={selectedBalance.id} account={selectedBalance} />;

  if ((hasAccounts && !adding) || !canManage) {
    return (
      <>
        <SavedAccounts
          account={selectedBalance}
          list={saved.list}
          error={saved.error}
          onChanged={loadSaved}
          onAdd={canManage ? () => setAdding(true) : null}
        />
        {history}
      </>
    );
  }

  const form =
    method === 'mobile' ? (
      // Keyed by account: another country means other wallets and another dial code.
      <MobileMoneyForm
        key={selectedBalance.id}
        account={selectedBalance}
        countrySelect={countrySelect('Pays')}
        onSaved={closeForm}
        onBack={back}
      />
    ) : (
      <BankAccountForm
        key={selectedBalance.id}
        account={selectedBalance}
        countrySelect={countrySelect('Choisissez le pays dans lequel le compte est domicilié')}
        onSaved={closeForm}
        onBack={back}
      />
    );

  return (
    <>
      <div className="card reload withdraw">
        <div className="card__header">
          Formulaire d&apos;ajout de compte de retrait
          <div className="card__subheader">Ajouter vos comptes de retrait pour faciliter les retraits</div>
        </div>
        <div className="card__body">
          {saved.error && (
            <div className="toast-inline toast-inline--error">Impossible de charger vos comptes de retrait : {saved.error}</div>
          )}
          <div className="reload__tabs" role="tablist">
            {METHODS.map((m) => (
              <button
                key={m.key}
                type="button"
                role="tab"
                aria-selected={method === m.key}
                className={`reload__tab ${method === m.key ? 'reload__tab--active' : ''}`}
                onClick={() => setMethod(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="reload__panel" role="tabpanel">
            {form}
          </div>
        </div>
      </div>
      {history}
    </>
  );
}

// The account the withdrawal account is for, shown as its country; changing it changes the
// dashboard's selected account too.
function CountrySelect({ label, balances, value, onChange }) {
  return (
    <label className="field field--stacked">
      <span>
        {label} <em className="required">*</em>
      </span>
      <div className="country-select withdraw__country">
        <Flag code={value.country.codeAlpha2} />
        <select
          value={value.id}
          onChange={(e) => onChange(balances.find((b) => b.id === Number(e.target.value)).country.codeAlpha2)}
          disabled={balances.length < 2}
        >
          {balances.map((b) => (
            <option key={b.id} value={b.id}>
              {b.country.name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}

function DefaultCheckbox({ checked, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      Définir comme compte de retrait par défaut
    </label>
  );
}

function FormActions({ busy, disabled, onBack }) {
  return (
    <div className="withdraw__actions">
      <button type="button" className="link-btn withdraw__back" onClick={onBack}>
        <Icon name="chevronRight" size={14} className="withdraw__back-icon" /> Revenir en arrière
      </button>
      <button type="submit" className="btn btn--primary withdraw__submit" disabled={busy || disabled}>
        {busy ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  );
}

// onSaved() is called once the success dialog is closed.
function MobileMoneyForm({ account, countrySelect, onSaved, onBack }) {
  const [wallets, setWallets] = useState(null);
  const [walletsError, setWalletsError] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [busy, setBusy] = useState(false);
  // null | { type: 'error' | 'success', message }
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getReloadWallets(account.id)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setWallets(list);
        setWalletId(list[0]?.id ?? null);
      })
      .catch((err) => !cancelled && setWalletsError(err));
    return () => {
      cancelled = true;
    };
  }, [account.id]);

  const countryCode = account.country.codeAlpha2;
  const wallet = wallets?.find((w) => w.id === walletId) ?? wallets?.[0];
  const dialCode = wallet?.country.callingCode ?? '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) return setDialog({ type: 'error', message: 'Veuillez choisir un mobile money' });
    if (!isValidPhone(countryCode, phone)) {
      return setDialog({ type: 'error', message: 'Veuillez entrer un numéro de téléphone correct' });
    }
    setBusy(true);
    try {
      const saved = await createWithdrawalAccount({
        method: 'mobile_money',
        balance: account.id,
        paymentType: wallet.id,
        phone: normalizePhone(phone),
        isDefault,
      });
      setDialog({
        type: 'success',
        message: `${wallet.name} (${saved.phoneNumber}) est enregistré${saved.isDefault ? ' comme compte de retrait par défaut' : ''}.`,
      });
      setPhone('');
      setIsDefault(false);
    } catch (err) {
      setDialog({ type: 'error', message: errorMessage(err, "L'enregistrement a échoué. Réessayez.") });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <>
      <form className="reload__form" onSubmit={handleSubmit} noValidate>
        {countrySelect}

        <label className="field field--stacked">
          <span>
            Mobile money <em className="required">*</em>
          </span>
          {wallets === null && !walletsError ? (
            <select disabled>
              <option>Chargement…</option>
            </select>
          ) : (
            <select value={wallet?.id ?? ''} onChange={(e) => setWalletId(Number(e.target.value))} disabled={!wallets?.length}>
              {!wallets?.length && <option value="">Aucun mobile money disponible</option>}
              {wallets?.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          )}
          {walletsError && <small className="field__error">Impossible de charger les mobile money : {walletsError.message}</small>}
          {wallets?.length === 0 && (
            <small>
              Aucun mobile money n&apos;est disponible pour {account.country.name}. Enregistrez plutôt un compte bancaire.
            </small>
          )}
        </label>

        <label className="field field--stacked">
          <span>
            Numéro de téléphone <em className="required">*</em>
          </span>
          <div className="phone-input">
            <span className="phone-input__flag">
              <Flag code={countryCode} /> {dialCode}
            </span>
            <input
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder={phonePlaceholder(countryCode)}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </label>

        <DefaultCheckbox checked={isDefault} onChange={setIsDefault} />
        <FormActions busy={busy} disabled={!wallet} onBack={onBack} />
      </form>

      {dialog && (
        <AlertDialog
          variant={dialog.type}
          title={dialog.type === 'error' ? 'Ooups !' : 'Compte de retrait enregistré'}
          message={dialog.message}
          onClose={() => {
            setDialog(null);
            if (dialog.type === 'success') onSaved();
          }}
        />
      )}
    </>
  );
}

const EMPTY_BANK = { bankName: '', accountName: '', rib: '', ribConfirmation: '' };

// onSaved() is called once the success dialog is closed.
function BankAccountForm({ account, countrySelect, onSaved, onBack }) {
  const [form, setForm] = useState(EMPTY_BANK);
  const [isDefault, setIsDefault] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(null);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const ribMismatch = form.ribConfirmation !== '' && compactRib(form.rib) !== compactRib(form.ribConfirmation);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let message = null;
    if (!form.bankName.trim()) message = 'Veuillez entrer le nom de la banque';
    else if (!form.accountName.trim()) message = "Veuillez entrer l'intitulé du compte";
    else if (!form.rib.trim()) message = 'Veuillez entrer votre Relevé d’Identité Bancaire (RIB)';
    else if (compactRib(form.rib) !== compactRib(form.ribConfirmation)) message = 'Les deux RIB saisis sont différents';
    if (message) return setDialog({ type: 'error', message });

    setBusy(true);
    try {
      const saved = await createWithdrawalAccount({ method: 'bank_account', balance: account.id, ...form, isDefault });
      setDialog({
        type: 'success',
        message: `Le compte ${saved.bankName} (${saved.rib}) est enregistré${saved.isDefault ? ' comme compte de retrait par défaut' : ''}.`,
      });
      setForm(EMPTY_BANK);
      setIsDefault(false);
    } catch (err) {
      setDialog({ type: 'error', message: errorMessage(err, "L'enregistrement a échoué. Réessayez.") });
    } finally {
      setBusy(false);
    }
    return undefined;
  };

  return (
    <>
      <form className="reload__form" onSubmit={handleSubmit} noValidate>
        {countrySelect}

        <label className="field field--stacked">
          <span>
            Nom de la banque <em className="required">*</em>
          </span>
          <input type="text" maxLength={100} value={form.bankName} onChange={update('bankName')} />
        </label>

        <label className="field field--stacked">
          <span>
            Intitulé du compte <em className="required">*</em>
          </span>
          <input type="text" maxLength={150} value={form.accountName} onChange={update('accountName')} />
        </label>

        <label className="field field--stacked">
          <span>
            Relevé d&apos;Identité Bancaire (RIB) <em className="required">*</em>
          </span>
          <input type="text" maxLength={50} autoComplete="off" value={form.rib} onChange={update('rib')} />
        </label>

        <label className="field field--stacked">
          <span>
            Ressaisissez le Relevé d&apos;Identité Bancaire (RIB) <em className="required">*</em>
          </span>
          <input
            type="text"
            maxLength={50}
            autoComplete="off"
            value={form.ribConfirmation}
            onChange={update('ribConfirmation')}
            onPaste={(e) => e.preventDefault()}
            aria-invalid={ribMismatch}
          />
          {ribMismatch && <small className="field__error">Les deux RIB saisis sont différents</small>}
        </label>

        <DefaultCheckbox checked={isDefault} onChange={setIsDefault} />
        <FormActions busy={busy} onBack={onBack} />
      </form>

      {dialog && (
        <AlertDialog
          variant={dialog.type}
          title={dialog.type === 'error' ? 'Ooups !' : 'Compte de retrait enregistré'}
          message={dialog.message}
          onClose={() => {
            setDialog(null);
            if (dialog.type === 'success') onSaved();
          }}
        />
      )}
    </>
  );
}

// The selected account's withdrawal accounts: make one the default, or remove one.
function SavedAccounts({ account, list, error, onChanged, onAdd }) {
  // null | { type: 'delete', item } | { type: 'error', message }
  const [dialog, setDialog] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const run = async (id, action, fallback) => {
    setBusyId(id);
    try {
      await action();
      setDialog(null);
      onChanged();
    } catch (err) {
      setDialog({ type: 'error', message: err?.message || fallback });
    } finally {
      setBusyId(null);
    }
  };

  const describe = (item) =>
    item.method === 'mobile_money'
      ? { title: item.paymentType?.name ?? 'Mobile money', detail: item.phoneNumber }
      : { title: `${item.bankName} — ${item.accountName}`, detail: item.rib };

  let body;
  if (error) body = <p className="field__error">Impossible de charger vos comptes de retrait : {error}</p>;
  else if (!list.length) body = <p className="reload__empty">Aucun compte de retrait enregistré pour ce compte.</p>;
  else {
    body = (
      <ul className="withdraw__list">
        {list.map((item) => {
          const { title, detail } = describe(item);
          return (
            <li key={item.id} className="withdraw__item">
              <Icon name={item.method === 'mobile_money' ? 'phone' : 'card'} size={18} className="withdraw__item-icon" />
              <div className="withdraw__item-text">
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
              {item.isDefault ? (
                <span className="badge badge--success">Par défaut</span>
              ) : onAdd && (
                <button
                  type="button"
                  className="link-btn"
                  disabled={busyId === item.id}
                  onClick={() => run(item.id, () => setDefaultWithdrawalAccount(item.id), 'Impossible de changer le compte par défaut.')}
                >
                  Définir par défaut
                </button>
              )}
              {onAdd && (
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => setDialog({ type: 'delete', item })}
                  aria-label={`Supprimer ${title}`}
                  title="Supprimer"
                >
                  <Icon name="trash" size={16} />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="card withdraw__saved">
      <div className="card__header withdraw__saved-header">
        <div>
          Mes comptes de retrait
          <span className="reload-history__account">
            {account.country.name} — {account.accountNumberFormatted}
          </span>
        </div>
        {onAdd && (
          <button type="button" className="btn btn--primary btn--sm" onClick={onAdd}>
            <Icon name="plus" size={14} /> Ajouter un compte de retrait
          </button>
        )}
      </div>
      <div className="card__body">
        {body}
      </div>

      {dialog?.type === 'delete' && (
        <AlertDialog
          title="Supprimer ce compte de retrait ?"
          message={`${describe(dialog.item).title} (${describe(dialog.item).detail})`}
          onClose={() => setDialog(null)}
          onConfirm={() => run(dialog.item.id, () => deleteWithdrawalAccount(dialog.item.id), 'La suppression a échoué.')}
          busy={busyId === dialog.item.id}
        />
      )}
      {dialog?.type === 'error' && (
        <AlertDialog variant="error" title="Ooups !" message={dialog.message} onClose={() => setDialog(null)} />
      )}
    </div>
  );
}
