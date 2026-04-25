import { Outlet } from 'react-router-dom'
import { AuthLocaleProvider, useAuthLocale } from './i18n/AuthLocaleContext'
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function AuthRoutesContent() {
  const { locale } = useAuthLocale();

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale={locale} key={locale}>
      <Outlet />
    </GoogleOAuthProvider>
  )
}

/** Wraps all `/login`, `/register`, … routes so auth forms share locale + persistence. */
export function AuthRoutesLayout() {
  return (
    <AuthLocaleProvider>
      <AuthRoutesContent />
    </AuthLocaleProvider>
  )
}
