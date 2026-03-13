import { Outlet, useLocation } from 'react-router-dom'
import Footer from '@/components/headfoot/footer'
import Header from '@/components/headfoot/header'

export function AppLayout() {
  useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Auto-redirect Admins to dashboard if they land on public pages */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
