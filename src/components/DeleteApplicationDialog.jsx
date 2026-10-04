import { useState } from 'react';
import Modal from './Modal.jsx';
import { readApiErrors } from '../data/teams.js';

// Confirmation before deleting an "Intégrez notre API" application (list and details pages).
// `onConfirm` is awaited (the API call); on failure the dialog stays open with the error.
export default function DeleteApplicationDialog({ app, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setDeleting(true);
    setError('');
    try {
      await onConfirm();
    } catch (err) {
      setError(readApiErrors(err).message);
      setDeleting(false);
    }
  };

  return (
    <Modal title="Supprimer l'application" onClose={onClose} size="sm">
      <p className="team-form__hint">
        Supprimer l&apos;application <strong>{app.name}</strong> ? Ses clés API cesseront de fonctionner
        immédiatement. Cette action est irréversible.
      </p>
      {error && (
        <div className="toast-inline toast-inline--error" role="alert">
          {error}
        </div>
      )}
      <div className="modal__actions modal__actions--split">
        <button type="button" className="btn btn--outline" onClick={onClose} disabled={deleting}>
          Annuler
        </button>
        <button type="button" className="btn btn--danger" onClick={confirm} disabled={deleting}>
          {deleting ? 'Suppression…' : 'Supprimer'}
        </button>
      </div>
    </Modal>
  );
}
