import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AlertDialog from '../components/AlertDialog.jsx';
import Flag from '../components/Flag.jsx';
import Icon from '../components/Icon.jsx';
import { getReloadBankAccounts, getReloadWallets, submitReload } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import {
  BANK_CUTOFF_HOUR_GMT,
  MIN_RELOAD_AMOUNT,
  TRANSFER_ZONES,
  currencyLabel,
  formatAmount,
  isValidPhone,
  normalizePhone,
  phonePlaceholder,
} from '../data/reload.js';

const METHODS = [
  { key: 'mobile', label: 'Mobile money' },
  { key: 'bank', label: 'Compte bancaire' },
];

const HISTORY_PATH = '/dashboard/reload/history';

// "Recharger mon compte": tops one of the merchant's accounts (one per country) up, either from
// a mobile money wallet of that account's country (GET /api/merchant/reload/wallets; wallet,
// number, amount, plus the payment code generated on the phone for wallets with otpRequired ->
// confirmation -> the payer validates on their phone, or on the payment page (paymentUrl) some
// wallets give) or by bank transfer (step 1: MyPay's bank accounts in that country, GET
// /api/merchant/reload/bank-accounts; step 2: the merchant declares the transfer they made). The
// account is the dashboard's selected one (useAccount), switchable here in both tabs.
export default function Reload() {
  const [method, setMethod] = useState('mobile');
  const { balances, selectedBalance, selectCountry, loading, error } = useAccount();

  let content;
  if (loading) {
    content = <p className="reload__empty">Chargement de vos comptes…</p>;
  } else if (error) {
    content = <div className="toast-inline toast-inline--error">Impossible de charger vos comptes : {error.message}</div>;
  } else if (!selectedBalance) {
    content = <p className="reload__empty">Vous n&apos;avez encore aucun compte à recharger.</p>;
  } else if (method === 'mobile') {
    // Keyed by account: another country means other wallets and another dial code.
    content = (
      <MobileMoneyReload
        key={selectedBalance.id}
        account={selectedBalance}
        accountSelect={<AccountSelect balances={balances} value={selectedBalance} onChange={selectCountry} />}
      />
    );
  } else {
    // Keyed by account: another country means other bank accounts.
    content = (
      <BankReload
        key={selectedBalance.id}
        account={selectedBalance}
        accountSelect={<AccountSelect balances={balances} value={selectedBalance} onChange={selectCountry} />}
      />
    );
  }

  return (
    <div className="card reload">
      <div className="card__header">
        Recharger mon compte
        <div className="card__subheader">Recharger via Mobile money ou Compte bancaire</div>
      </div>
      <div className="card__body">
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
          {content}
        </div>
      </div>
    </div>
  );
}

function accountLabel(balance) {
  return `${balance.country.name} — ${balance.accountNumberFormatted}`;
}

// The account to top up; changing it changes the dashboard's selected account too.
function AccountSelect({ balances, value, onChange }) {
  return (
    <label className="field field--stacked">
      <span>
        Compte à recharger <em className="required">*</em>
      </span>
      <select
        value={value.id}
        onChange={(e) => onChange(balances.find((b) => b.id === Number(e.target.value)).country.codeAlpha2)}
      >
        {balances.map((b) => (
          <option key={b.id} value={b.id}>
            {accountLabel(b)}
          </option>
        ))}
      </select>
    </label>
  );
}

// French messages for the API's validation errors (422 { errors: { field } }), by body field.
const RELOAD_ERRORS = {
  method: 'Mode de recharge inconnu.',
  balance: 'Ce compte ne peut pas être rechargé.',
  amount: `Veuillez entrer un montant entier d'au moins ${formatAmount(MIN_RELOAD_AMOUNT)}`,
  paymentType: 'Veuillez choisir un wallet de ce pays',
  phone: 'Veuillez entrer un numéro de téléphone correct',
  otp: 'Veuillez entrer le code de paiement généré sur votre téléphone (4 à 12 chiffres ou lettres)',
  bankAccount: "Ce compte bancaire n'est pas disponible pour les recharges. Choisissez-en un autre ou contactez le support.",
  zone: 'Veuillez choisir la zone du virement',
  rib: 'Veuillez entrer votre RIB (50 caractères maximum)',
  transferDate: "La date du virement est invalide (elle ne peut pas être dans le futur)",
  label: 'Le libellé fait 140 caractères maximum',
};

// The payment code some wallets generate on the phone (Orange Money Côte d'Ivoire…).
const OTP_PATTERN = /^[0-9A-Za-z]{4,12}$/;

function reloadErrorMessage(err, fallback) {
  const field = Object.keys(err?.data?.errors ?? {})[0];
  if (field) return RELOAD_ERRORS[field] ?? err.data.errors[field];
  return err?.message || fallback;
}

function DoneLink() {
  return (
    <p className="alert-dialog__message">
      <Link to={HISTORY_PATH}>Voir mes recharges</Link>
    </p>
  );
}

function MobileMoneyReload({ account, accountSelect }) {
  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletsError, setWalletsError] = useState(null);
  const [walletId, setWalletId] = useState(null);
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  // null | { type: 'error', message } | { type: 'confirm' } | { type: 'done', paymentId, paymentUrl }
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getReloadWallets(account.id)
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setWallets(list);
        setWalletId(list[0]?.id ?? null);
      })
      .catch((err) => {
        if (!cancelled) setWalletsError(err);
      })
      .finally(() => {
        if (!cancelled) setWalletsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [account.id]);

  const countryCode = account.country.codeAlpha2;
  const wallet = wallets.find((w) => w.id === walletId) ?? wallets[0];
  // The wallet's country is the account's; the dial code comes with it.
  const dialCode = wallet?.country.callingCode ?? '';
  const unit = currencyLabel(account.currency);

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = null;
    if (!wallet) {
      message = 'Veuillez choisir un wallet';
    } else if (!isValidPhone(countryCode, phone)) {
      message = 'Veuillez entrer un numéro de téléphone correct';
    } else if (wallet.otpRequired && !OTP_PATTERN.test(otp.trim())) {
      message = RELOAD_ERRORS.otp;
    } else if (!(Number(amount) >= MIN_RELOAD_AMOUNT) || !Number.isInteger(Number(amount))) {
      message = `Veuillez entrer un montant entier d'au moins ${formatAmount(MIN_RELOAD_AMOUNT)} ${unit}`;
    } else if (account.status === false) {
      message = 'Ce compte est bloqué : il ne peut pas être rechargé.';
    }
    setDialog(message ? { type: 'error', message } : { type: 'confirm' });
  };

  const handleConfirm = async () => {
    setBusy(true);
    try {
      const payment = await submitReload({
        method: 'mobile_money',
        balance: account.id,
        paymentType: wallet.id,
        phone: normalizePhone(phone),
        amount: Number(amount),
        ...(wallet.otpRequired ? { otp: otp.trim() } : {}),
      });
      // Sent to the payment provider straight away: it may already have turned it down.
      if (payment.status === 'failed') {
        setDialog({
          type: 'error',
          message: `La recharge ${payment.paymentId} n'a pas pu être initiée avec ${wallet.name}. Réessayez plus tard, ou rechargez avec un autre wallet ou par compte bancaire.`,
        });
      } else {
        setDialog({ type: 'done', paymentId: payment.paymentId, paymentUrl: payment.paymentUrl });
      }
    } catch (err) {
      setDialog({ type: 'error', message: reloadErrorMessage(err, 'La recharge a échoué. Réessayez.') });
    } finally {
      setBusy(false);
    }
  };

  const closeDone = () => {
    setDialog(null);
    setPhone('');
    setAmount('');
    setOtp('');
  };

  return (
    <>
      <form className="reload__form" onSubmit={handleSubmit} noValidate>
        {accountSelect}

        <label className="field field--stacked">
          <span>
            Choix du wallet <em className="required">*</em>
          </span>
          {walletsLoading ? (
            <select disabled>
              <option>Chargement des wallets…</option>
            </select>
          ) : (
            <select
              value={wallet?.id ?? ''}
              onChange={(e) => setWalletId(Number(e.target.value))}
              disabled={!wallets.length}
              required
            >
              {!wallets.length && <option value="">Aucun wallet disponible</option>}
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          )}
          {walletsError && (
            <small className="field__error">Impossible de charger les wallets : {walletsError.message}</small>
          )}
          {!walletsLoading && !walletsError && !wallets.length && (
            <small>
              Aucun wallet mobile money n&apos;est disponible pour {account.country.name}. Rechargez par compte bancaire.
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
              required
            />
          </div>
        </label>

        {wallet?.otpRequired && (
          <label className="field field--stacked">
            <span>
              Code de paiement <em className="required">*</em>
            </span>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={12}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {wallet.otpHint && <small>{wallet.otpHint}</small>}
          </label>
        )}

        <label className="field field--stacked">
          <span>
            Montant {unit} <em className="required">*</em>
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={MIN_RELOAD_AMOUNT}
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn btn--teal reload__submit" disabled={!wallet}>
          Recharger
        </button>
      </form>

      {dialog?.type === 'error' && (
        <AlertDialog variant="error" title="Ooups !" message={dialog.message} onClose={() => setDialog(null)} />
      )}
      {dialog?.type === 'confirm' && (
        <AlertDialog
          title="Rechargement du compte"
          message="Voulez-vous confirmer votre recharge ?"
          onClose={() => setDialog(null)}
          onConfirm={handleConfirm}
          busy={busy}
        >
          <p className="alert-dialog__detail">
            {formatAmount(amount)} {unit} depuis {wallet.name} ({dialCode} {normalizePhone(phone)}) vers le compte{' '}
            {account.accountNumberFormatted}
          </p>
        </AlertDialog>
      )}
      {dialog?.type === 'done' && (
        <AlertDialog
          variant="success"
          title="Recharge initiée"
          message={
            dialog.paymentUrl
              ? `Ouvrez la page de paiement ${wallet.name} pour valider le paiement de ${formatAmount(amount)} ${unit} et créditer votre compte.`
              : `Validez le paiement de ${formatAmount(amount)} ${unit} sur le téléphone ${dialCode} ${normalizePhone(phone)} pour créditer votre compte.`
          }
          onClose={closeDone}
        >
          {dialog.paymentUrl && (
            <p className="alert-dialog__message">
              <a className="btn btn--teal" href={dialog.paymentUrl} target="_blank" rel="noopener noreferrer">
                Ouvrir la page de paiement
              </a>
            </p>
          )}
          <p className="alert-dialog__detail">Référence : {dialog.paymentId}</p>
          <DoneLink />
        </AlertDialog>
      )}
    </>
  );
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (insecure context): the number stays selectable.
    }
  };

  return (
    <button
      type="button"
      className="icon-btn icon-btn--info"
      onClick={handleCopy}
      title={copied ? 'Copié !' : 'Copier le numéro de compte'}
      aria-label={copied ? 'Copié' : 'Copier le numéro de compte'}
    >
      <Icon name={copied ? 'check' : 'copy'} size={15} />
    </button>
  );
}

const EMPTY_TRANSFER = { bankId: '', zone: '', rib: '', amount: '', transferDate: '', label: '' };

function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function BankReload({ account, accountSelect }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY_TRANSFER);
  // null | { type: 'error', message } | { type: 'done', amount, paymentId }
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);

  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [banksError, setBanksError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getReloadBankAccounts(account.id)
      .then((data) => {
        if (!cancelled) setBanks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setBanksError(err);
      })
      .finally(() => {
        if (!cancelled) setBanksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [account.id]);

  const unit = currencyLabel(account.currency);
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const goToForm = () => {
    setForm((f) => ({ ...f, bankId: f.bankId || String(banks[0]?.id ?? '') }));
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payment = await submitReload({
        method: 'bank_transfer',
        balance: account.id,
        bankAccount: Number(form.bankId),
        zone: form.zone,
        rib: form.rib,
        amount: Number(form.amount),
        transferDate: form.transferDate,
        label: form.label || null,
      });
      setDialog({ type: 'done', amount: form.amount, paymentId: payment.paymentId });
    } catch (err) {
      setDialog({ type: 'error', message: reloadErrorMessage(err, "La déclaration n'a pas pu être envoyée. Réessayez.") });
    } finally {
      setBusy(false);
    }
  };

  const closeDone = () => {
    setDialog(null);
    setForm(EMPTY_TRANSFER);
    setStep(1);
  };

  return (
    <>
      <div className="reload__step">Etape {step}/2</div>
      <h2 className="reload__title">{step === 1 ? 'Procédure de recharge' : 'Formulaire de recharge'}</h2>

      {step === 1 && (
        <div className="reload__form">
          <p className="reload__warning">
            <Icon name="info" size={16} />
            <span>
              Les recharges sont traitées le jour même pour les virements reçus avant {BANK_CUTOFF_HOUR_GMT}H GMT.
              Après {BANK_CUTOFF_HOUR_GMT}h00, traitement reporté au jour ouvré suivant.
            </span>
          </p>
          <p className="reload__text">
            Pour recharger votre compte via un compte bancaire, effectuez dans un premier temps un virement dans
            l&apos;une de nos banques partenaires.
          </p>
          <p className="reload__text">Choisissez une de nos banques en fonction du compte MyPay à recharger.</p>

          {accountSelect}

          {banksLoading && <p className="reload__empty">Chargement des banques…</p>}
          {banksError && (
            <div className="toast-inline toast-inline--error">
              Impossible de charger les banques : {banksError.message}
            </div>
          )}
          {!banksLoading && !banksError && (banks.length ? (
            <div className="reload__banks">
              {banks.map((bank) => (
                <dl key={bank.id} className="reload__bank">
                  <div>
                    <dt>Nom de la banque</dt>
                    <dd>{bank.bankName}</dd>
                  </div>
                  <div>
                    <dt>Nom du compte</dt>
                    <dd>{bank.accountName}</dd>
                  </div>
                  <div>
                    <dt>Numéro de compte</dt>
                    <dd>
                      {bank.accountNumber}
                      <CopyButton value={bank.accountNumber} />
                    </dd>
                  </div>
                </dl>
              ))}
            </div>
          ) : (
            <p className="reload__empty">
              Aucune banque partenaire n&apos;est encore disponible pour ce pays. Contactez le support.
            </p>
          ))}

          <button type="button" className="btn btn--primary btn--block" onClick={goToForm} disabled={!banks.length}>
            J&apos;ai effectué le virement
          </button>
        </div>
      )}

      {step === 2 && (
        <form className="reload__form" onSubmit={handleSubmit}>
          <label className="field field--stacked">
            <span>
              Depuis quelle banque avez-vous effectué le virement ? <em className="required">*</em>
            </span>
            <select value={form.bankId} onChange={update('bankId')} required>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} ({b.accountNumber})
                </option>
              ))}
            </select>
          </label>

          <label className="field field--stacked">
            <span>
              Depuis quelle zone avez-vous effectué le virement ? <em className="required">*</em>
            </span>
            <select value={form.zone} onChange={update('zone')} required>
              <option value="" disabled>
                Sélectionner une zone
              </option>
              {TRANSFER_ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </label>

          <label className="field field--stacked">
            <span>
              Votre RIB <em className="required">*</em>
            </span>
            <input type="text" value={form.rib} onChange={update('rib')} required minLength={10} />
          </label>

          <label className="field field--stacked">
            <span>
              Montant <em className="required">*</em>
            </span>
            <div className="amount-input">
              <input
                type="number"
                inputMode="numeric"
                min={MIN_RELOAD_AMOUNT}
                step="1"
                value={form.amount}
                onChange={update('amount')}
                required
              />
              <span>{unit}</span>
            </div>
          </label>

          <label className="field field--stacked">
            <span>
              Quand avez-vous effectué le virement ? <em className="required">*</em>
            </span>
            <input type="date" max={todayIso()} value={form.transferDate} onChange={update('transferDate')} required />
          </label>

          <label className="field field--stacked">
            <span>Libellé du virement (optionnel)</span>
            <input type="text" value={form.label} onChange={update('label')} maxLength={140} />
          </label>

          <div className="reload__actions">
            <button type="button" className="btn btn--outline" onClick={() => setStep(1)} disabled={busy}>
              Précédent
            </button>
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? 'Envoi…' : 'Soumettre'}
            </button>
          </div>
        </form>
      )}

      {dialog?.type === 'error' && (
        <AlertDialog variant="error" title="Ooups !" message={dialog.message} onClose={() => setDialog(null)} />
      )}
      {dialog?.type === 'done' && (
        <AlertDialog
          variant="success"
          title="Recharge enregistrée"
          message={`Votre recharge de ${formatAmount(dialog.amount)} ${unit} sera créditée sur votre compte ${account.accountNumberFormatted} dès réception du virement.`}
          onClose={closeDone}
        >
          <p className="alert-dialog__detail">Référence : {dialog.paymentId}</p>
          <DoneLink />
        </AlertDialog>
      )}
    </>
  );
}
