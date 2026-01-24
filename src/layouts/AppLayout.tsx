import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
        <Link to="/" className="font-semibold text-foreground">
          CCTE FE
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/login" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-muted-foreground">
        CCTE FE © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
