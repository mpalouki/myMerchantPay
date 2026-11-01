import { useEffect, useRef } from 'react';

// For the side panels: once a save fails, scrolls the panel to the first field error (the
// submit button is in the sticky footer, often far below it). Returns the form's ref.
export default function usePanelErrors(errors, message) {
  const formRef = useRef(null);

  useEffect(() => {
    if (!message && Object.keys(errors).length === 0) return;
    formRef.current?.querySelector('.field__error, .toast-inline--error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [errors, message]);

  return formRef;
}

// The text shown next to the panel's buttons: the first field error, or the general message.
export function firstError(errors, message) {
  return message || Object.values(errors)[0] || '';
}
