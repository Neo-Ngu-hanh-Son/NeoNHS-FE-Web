import { Outlet } from 'react-router-dom'
import { AuthLocaleProvider } from './i18n/AuthLocaleContext'

/** Wraps all `/login`, `/register`, … routes so auth forms share locale + persistence. */
export function AuthRoutesLayout() {
  return (
    <AuthLocaleProvider>
      <Outlet />
    </AuthLocaleProvider>
  )
}
