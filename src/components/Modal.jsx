import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon.jsx';

// Dialog rendered over the page (portal into <body>). Closes on Escape, on the × button and
// on a click on the backdrop; focus moves into the dialog on open and back where it was on
// close (to the first form field, else the dialog itself). Mount it only while open:
// `{open && <Modal …/>}`.
export default function Modal({ title, onClose, children, size = 'md' }) {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const dialog = dialogRef.current;
    // First form field, else the dialog itself — never an action button, so a stray Enter
    // can't delete anything.
    (dialog.querySelector('input, select, textarea') ?? dialog).focus();

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

  return createPortal(
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal__header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Fermer">
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
