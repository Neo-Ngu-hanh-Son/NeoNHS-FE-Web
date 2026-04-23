import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AuthLocale } from './messages'
import { pickAuthString } from './messages'

const STORAGE_KEY = 'neonhs-auth-locale'

function readStoredLocale(): AuthLocale {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'vi' || v === 'en') return v
  } catch {
    /* ignore */
  }
  return 'vi'
}

type AuthLocaleContextValue = {
  locale: AuthLocale
  setLocale: (l: AuthLocale) => void
  toggleLocale: () => void
  t: (key: string) => string
}

const AuthLocaleContext = createContext<AuthLocaleContextValue | null>(null)

export function AuthLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AuthLocale>(() => readStoredLocale())

  const setLocale = useCallback((l: AuthLocale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'vi' ? 'en' : 'vi')
  }, [locale, setLocale])

  const t = useCallback((key: string) => pickAuthString(locale, key), [locale])

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  )

  return <AuthLocaleContext.Provider value={value}>{children}</AuthLocaleContext.Provider>
}

export function useAuthLocale(): AuthLocaleContextValue {
  const ctx = useContext(AuthLocaleContext)
  if (!ctx) {
    throw new Error('useAuthLocale must be used within AuthLocaleProvider')
  }
  return ctx
}
