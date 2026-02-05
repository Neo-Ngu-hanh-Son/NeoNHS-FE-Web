import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'

/**
 * RootLayout - Wraps all routes with global providers
 * This ensures AuthContext is available to all nested routes
 */
export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}
