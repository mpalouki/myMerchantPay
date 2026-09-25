import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import fr from './locales/fr.js'
import en from './locales/en.js'

export const LOCALES = {
  fr: { label: 'Français', messages: fr },
  en: { label: 'English', messages: en },
}

const DEFAULT_LOCALE = 'fr'
const LOCALE_KEY = 'mmp_locale'

const I18nContext = createContext(null)

function readStoredLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (saved && LOCALES[saved]) return saved
  } catch {
    // storage unavailable — fall through to browser language
  }
  const browser = navigator.language?.slice(0, 2)
  return LOCALES[browser] ? browser : DEFAULT_LOCALE
}

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

// Resolves a dotted key ('register.company.name') in the active locale, falling
// back to the default locale, then to the key itself. `{{name}}` placeholders
// are replaced from `params`.
function translate(locale, key, params) {
  let message = lookup(LOCALES[locale].messages, key)
  if (typeof message !== 'string') message = lookup(LOCALES[DEFAULT_LOCALE].messages, key)
  if (typeof message !== 'string') return key
  if (!params) return message
  return message.replace(/\{\{(\w+)\}\}/g, (match, name) => (name in params ? params[name] : match))
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(readStoredLocale)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next) => {
    if (!LOCALES[next]) return
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_KEY, next)
    } catch {
      // ignore — the choice just won't persist
    }
  }, [])

  const t = useCallback((key, params) => translate(locale, key, params), [locale])

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
