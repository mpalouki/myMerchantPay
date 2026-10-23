import { useEffect, useState } from 'react';
import AlertDialog from '../components/AlertDialog.jsx';
import Flag from '../components/Flag.jsx';
import Icon from '../components/Icon.jsx';
import TransferHistory from '../components/TransferHistory.jsx';
import { createTransfer, quoteTransfer } from '../api/client.js';
import { useAccount } from '../context/AccountContext.jsx';
import { currencyLabel } from '../data/reload.js';
import {
  amountProblem,
  formatMoney,
  formatRate,
  newIdempotencyKey,
  normalizeAmount,
  transferErrorMessage,
} from '../data/transfer.js';

// "Transférer entre mes comptes": moves money from the selected account (the dashboard's, switchable
// here) to another of the merchant's accounts, possibly in another currency. Typing an amount asks
// the API for a quote (debounced): the amount received at a rate held 60 s. "Transférer" confirms,
// then executes that quote (fetching a fresh one first if it expired). Each transfer has its own
// idempotency key, kept when a request is retried, so a double click or a lost answer never moves
// the money twice. Below, the account's transfer history.

const QUOTE_DELAY_MS = 400;

// The countdown's clock, read when a quote arrives and every second while one is shown.
function currentTime() {
  return Date.now();
}

export default function Transfer() {
  const { balances, selectedBalance: source, selectCountry, loading, error, reload } = useAccount();
  const [destinationId, setDestinationId] = useState(null);
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  // Bumped to ask for a new quote with the same inputs (expired rate).
  const [round, setRound] = useState(0);
  const [response, setResponse] = useState({ key: null, quote: null, error: '' });
  const [now, setNow] = useState(currentTime);
  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [failure, setFailure] = useState('');
  const [historyKey, setHistoryKey] = useState(0);

  const others = source ? balances.filter((b) => b.id !== source.id) : [];
  const destination = others.find((b) => b.id === destinationId) ?? others.find((b) => b.status) ?? null;

  const amount = normalizeAmount(amountInput);
  const localProblem = source && amountInput.trim() ? amountProblem(amount, source) : null;
  const canQuote = Boolean(source?.status && destination?.status && amountInput.trim() && !localProblem);
  const requestKey = canQuote ? `${source.id}|${destination.id}|${amount}|${round}` : null;
  const answered = requestKey !== null && response.key === requestKey;
  const quote = answered ? response.quote : null;
  const quoteError = answered ? response.error : '';
  const quoting = canQuote && !answered;
  const secondsLeft = quote ? Math.max(0, Math.ceil((Date.parse(quote.expiresAt) - now) / 1000)) : 0;
  const expired = Boolean(quote) && secondsLeft === 0;

  useEffect(() => {
    if (!requestKey) return undefined;
    let cancelled = false;
    const [from, to, value] = requestKey.split('|');
    const timer = setTimeout(() => {
      quoteTransfer({ from: Number(from), to: Number(to), amount: value })
        .then((result) => {
          if (cancelled) return;
          setNow(currentTime());
          setResponse({ key: requestKey, quote: result, error: '' });
        })
        .catch((err) => !cancelled && setResponse({ key: requestKey, quote: null, error: transferErrorMessage(err) }));
    }, QUOTE_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [requestKey]);

  // The countdown of a held rate.
  useEffect(() => {
    if (!quote) return undefined;
    const timer = setInterval(() => setNow(currentTime()), 1000);
    return () => clearInterval(timer);
  }, [quote]);

  const swap = () => {
    setDestinationId(source.id);
    selectCountry(destination.country.codeAlpha2);
  };

  // A fresh quote when the one shown has expired (or is about to), then the confirmation.
  const review = async () => {
    setFailure('');
    if (quote && secondsLeft > 5) {
      setConfirming(quote);
      return;
    }
    setBusy(true);
    try {
      const fresh = await quoteTransfer({ from: source.id, to: destination.id, amount });
      setNow(currentTime());
      setResponse({ key: requestKey, quote: fresh, error: '' });
      setConfirming(fresh);
    } catch (err) {
      setFailure(transferErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    setBusy(true);
    try {
      const transfer = await createTransfer({ quoteId: confirming.quoteId, idempotencyKey, description: description.trim() || null });
      setConfirming(null);
      setDone(transfer);
      setAmountInput('');
      setDescription('');
      setIdempotencyKey(newIdempotencyKey());
      setHistoryKey((k) => k + 1);
      reload();
    } catch (err) {
      setConfirming(null);
      const code = err?.data?.code;
      if (code === 'quote_expired' || code === 'quote_used') setRound((r) => r + 1);
      // The money may or may not have moved: retrying with the same key is safe.
      setFailure(
        err?.status === 0
          ? 'Impossible de joindre le serveur. Réessayez : le transfert ne sera pas fait deux fois.'
          : transferErrorMessage(err),
      );
    } finally {
      setBusy(false);
    }
  };

  let message = null;
  if (loading) message = 'Chargement de vos comptes…';
  else if (error) message = `Impossible de charger vos comptes : ${error.message}`;
  else if (!source) message = "Vous n'avez encore aucun compte.";
  else if (others.length === 0) message = 'Un transfert se fait entre deux de vos comptes, et vous n’en avez qu’un. Un compte est ouvert pour chaque pays où vous encaissez.';

  if (message) {
    return (
      <div className="card transfer">
        <div className="card__header">Transférer entre mes comptes</div>
        <div className="card__body">
          <p className="reload__empty">{message}</p>
        </div>
      </div>
    );
  }

  const crossCurrency = destination && destination.currency !== source.currency;
  const problem = localProblem || quoteError;

  let rateLine;
  if (!destination) rateLine = 'Aucun autre compte actif.';
  else if (quoting) rateLine = 'Calcul du montant reçu…';
  else if (!crossCurrency) rateLine = 'Même devise : le montant arrive à l’identique.';
  else if (!quote) rateLine = `Conversion ${currencyLabel(source.currency)} → ${currencyLabel(destination.currency)} au taux du moment.`;
  else
    rateLine = (
      <>
        1 {currencyLabel(quote.from.currency)} = {formatRate(quote.rate)} {currencyLabel(quote.to.currency)}
        <span className={`transfer__hold${expired ? ' transfer__hold--expired' : ''}`}>
          {expired ? (
            <button type="button" className="link-btn" onClick={() => setRound((r) => r + 1)}>
              Taux expiré · Actualiser
            </button>
          ) : (
            `Taux garanti ${secondsLeft} s`
          )}
        </span>
      </>
    );

  return (
    <>
      <div className="card transfer">
        <div className="card__header">
          Transférer entre mes comptes
          <div className="card__subheader">Déplacez de l’argent d’un de vos comptes pays à un autre, même dans une autre devise.</div>
        </div>
        <div className="card__body">
          <form
            className="transfer__slip"
            onSubmit={(e) => {
              e.preventDefault();
              if (canQuote && !quoteError) review();
            }}
          >
            <section className="transfer__leg transfer__leg--from" aria-label="Compte débité">
              <AccountSelect
                label="Depuis le compte"
                accounts={balances}
                value={source}
                onChange={(id) => selectCountry(balances.find((b) => b.id === id).country.codeAlpha2)}
              />
              <label className="transfer__amount">
                <span className="transfer__caption">Montant à transférer</span>
                <span className="transfer__figure">
                  <input
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    aria-invalid={Boolean(problem)}
                    aria-describedby="transfer-problem"
                    disabled={!source.status}
                  />
                  <span className="transfer__currency">{currencyLabel(source.currency)}</span>
                </span>
              </label>
              <p className="transfer__balance">
                {source.status ? `Solde disponible : ${formatMoney(source.accountBalance, source.currency)}` : 'Ce compte est bloqué : aucun transfert possible.'}
              </p>
            </section>

            <div className="transfer__bridge">
              <button
                type="button"
                className="transfer__swap"
                onClick={swap}
                disabled={!destination}
                aria-label="Inverser les comptes"
                title="Inverser les comptes"
              >
                <Icon name="disburse" size={18} />
              </button>
              <p className="transfer__rate" aria-live="polite">
                {rateLine}
              </p>
            </div>

            <section className="transfer__leg transfer__leg--to" aria-label="Compte crédité">
              {destination ? (
                <AccountSelect label="Vers le compte" accounts={others} value={destination} onChange={setDestinationId} />
              ) : (
                <p className="transfer__caption">Vos autres comptes sont bloqués.</p>
              )}
              <div className="transfer__amount">
                <span className="transfer__caption">Le compte reçoit</span>
                <output className={`transfer__figure transfer__figure--result${quote && !expired ? '' : ' transfer__figure--pending'}`}>
                  {quote ? formatMoney(quote.to.amount, quote.to.currency) : `— ${destination ? currencyLabel(destination.currency) : ''}`}
                </output>
              </div>
            </section>

            <p id="transfer-problem" className="transfer__problem" role={problem ? 'alert' : undefined}>
              {problem}
            </p>

            <label className="field field--stacked transfer__description">
              <span>Description (facultatif)</span>
              <input
                type="text"
                maxLength={140}
                placeholder="Par exemple : trésorerie de fin de mois"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            {quote && Number(quote.from.fee) > 0 && (
              <p className="transfer__fee">
                Frais : {formatMoney(quote.from.fee, quote.from.currency)} · Total débité : {formatMoney(quote.from.total, quote.from.currency)}
              </p>
            )}

            <button type="submit" className="btn btn--primary transfer__submit" disabled={!canQuote || quoting || Boolean(quoteError) || busy}>
              {busy && !confirming ? 'Vérification du taux…' : 'Transférer'}
            </button>
          </form>
        </div>
      </div>

      <TransferHistory key={source.id} account={source} refreshKey={historyKey} />

      {confirming && (
        <AlertDialog
          title="Voulez-vous confirmer ce transfert ?"
          onClose={() => !busy && setConfirming(null)}
          onConfirm={send}
          confirmLabel="Transférer"
          cancelLabel="Annuler"
          busy={busy}
        >
          <dl className="transfer__recap">
            <div>
              <dt>Débité de {confirming.from.balance.country.name}</dt>
              <dd>{formatMoney(confirming.from.total, confirming.from.currency)}</dd>
            </div>
            <div>
              <dt>Crédité sur {confirming.to.balance.country.name}</dt>
              <dd>{formatMoney(confirming.to.amount, confirming.to.currency)}</dd>
            </div>
            {confirming.crossCurrency && (
              <div>
                <dt>Taux</dt>
                <dd>
                  1 {currencyLabel(confirming.from.currency)} = {formatRate(confirming.rate)} {currencyLabel(confirming.to.currency)}
                </dd>
              </div>
            )}
          </dl>
        </AlertDialog>
      )}

      {done && (
        <AlertDialog
          variant="success"
          title="Transfert effectué"
          message={`${formatMoney(done.to.amount, done.to.currency)} crédités sur votre compte ${done.to.balance.country.name}.`}
          onClose={() => setDone(null)}
        >
          <p className="alert-dialog__detail">Référence : {done.paymentId}</p>
        </AlertDialog>
      )}

      {failure && <AlertDialog variant="error" title="Ooups !" message={failure} onClose={() => setFailure('')} />}
    </>
  );
}

function AccountSelect({ label, accounts, value, onChange }) {
  return (
    <label className="transfer__account">
      <span className="transfer__caption">{label}</span>
      <span className="country-select transfer__select">
        <Flag code={value.country.codeAlpha2} />
        <select value={value.id} onChange={(e) => onChange(Number(e.target.value))} disabled={accounts.length < 2}>
          {accounts.map((b) => (
            <option key={b.id} value={b.id} disabled={!b.status}>
              {b.country.name} — {b.accountNumberFormatted} ({currencyLabel(b.currency)}){b.status ? '' : ' · bloqué'}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
