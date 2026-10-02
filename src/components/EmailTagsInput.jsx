import { useState } from 'react';
import Icon from './Icon.jsx';
import { EMAIL_PATTERN } from '../data/teams.js';

// Several email addresses as removable tags: typed text becomes a tag on Enter, comma,
// semicolon, space or blur (pasting a list works too); Backspace in an empty input removes
// the last tag. Invalid addresses stay in the input with a message; duplicates are ignored.
export default function EmailTagsInput({ id, value, onChange, invalid, disabled }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const commit = (raw = text) => {
    const candidates = raw
      .split(/[\s,;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (candidates.length === 0) return;

    const bad = candidates.filter((e) => !EMAIL_PATTERN.test(e));
    const good = candidates.filter((e) => EMAIL_PATTERN.test(e) && !value.includes(e));
    if (good.length > 0) onChange([...value, ...new Set(good)]);
    setText(bad.join(' '));
    setError(bad.length > 0 ? `Adresse électronique invalide : ${bad.join(', ')}` : '');
  };

  const onKeyDown = (e) => {
    if (['Enter', ',', ';', ' '].includes(e.key)) {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && text === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="email-tags-wrapper">
      <div
        className={`email-tags ${invalid || error ? 'email-tags--invalid' : ''} ${disabled ? 'email-tags--disabled' : ''}`}
        onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
      >
        {value.map((email) => (
          <span key={email} className="email-tags__tag">
            {email}
            <button
              type="button"
              aria-label={`Retirer ${email}`}
              onClick={() => onChange(value.filter((e) => e !== email))}
              disabled={disabled}
            >
              <Icon name="close" size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="email"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError('');
          }}
          onKeyDown={onKeyDown}
          onBlur={() => commit()}
          onPaste={(e) => {
            const pasted = e.clipboardData.getData('text');
            if (/[\s,;]/.test(pasted.trim())) {
              e.preventDefault();
              commit(`${text} ${pasted}`);
            }
          }}
          placeholder="Appuyez sur la touche Entrée pour valider les emails"
          disabled={disabled}
          aria-invalid={invalid || !!error}
        />
      </div>
      {error && <small className="field__error">{error}</small>}
    </div>
  );
}
