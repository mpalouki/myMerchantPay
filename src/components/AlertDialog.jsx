import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';

// Small centred message box: an error ("Ooups !"), a success, or a yes/no question
// (`onConfirm` given). Escape and a click on the backdrop call `onClose` — the "no" answer.
// Mount it only while open: `{open && <AlertDialog …/>}`.
export default function AlertDialog({
  variant = 'info',
  title,
  message,
  onClose,
  onConfirm,
  confirmLabel = 'OUI',
  cancelLabel = 'Non',
  closeLabel = 'OK',
  busy = false,
  children,
}) {
  const titleId = useId();
  const messageId = useId();
  const primaryRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    primaryRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('modal-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('modal-open');
      previouslyFocused?.focus?.();
    };
  }, []);

  const icon = { error: 'close', success: 'check' }[variant];

  return createPortal(
    <div className="modal-backdrop modal-backdrop--centered" onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div
        className={`alert-dialog alert-dialog--${variant}`}
        role={onConfirm || variant === 'error' ? 'alertdialog' : 'dialog'}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? messageId : undefined}
      >
        {icon && (
          <div className="alert-dialog__icon" aria-hidden="true">
            <Icon name={icon} size={40} />
          </div>
        )}
        <h2 id={titleId} className="alert-dialog__title">
          {title}
        </h2>
        {message && (
          <p id={messageId} className="alert-dialog__message">
            {message}
          </p>
        )}
        {children}
        <div className="alert-dialog__actions">
          {onConfirm ? (
            <>
              <button type="button" className="btn alert-dialog__cancel" onClick={onClose} disabled={busy}>
                {cancelLabel}
              </button>
              <button ref={primaryRef} type="button" className="btn btn--teal" onClick={onConfirm} disabled={busy}>
                {busy ? '…' : confirmLabel}
              </button>
            </>
          ) : (
            <button ref={primaryRef} type="button" className="btn alert-dialog__ok" onClick={onClose}>
              {closeLabel}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
