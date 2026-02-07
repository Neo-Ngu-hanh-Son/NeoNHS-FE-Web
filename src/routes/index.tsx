import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { BlankLayout } from '@/layouts/BlankLayout'
import { HomePage } from '@/pages/HomePage'
import Login from '@/pages/AuthPage/Login'
import Forgot from '@/pages/AuthPage/Forgot'
import Register from '@/pages/AuthPage/Register'
import VerifyOTP from '@/pages/AuthPage/VerifyOTP'
import NewPassword from '@/pages/AuthPage/NewPassword'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProfilePage } from '@/pages/ProfilePage'
import UserProfilePage from '@/pages/ProfilePage/UserProfilePage'
import VendorProfilePage from '@/pages/ProfilePage/VendorProfilePage'
import { AboutUs } from '@/pages/AboutUs'
import { AdminLayout } from '@/layouts/admin/AdminLayout'
// Dashboard Pages
import VendorDashboardPage from '@/pages/vendor/dashboard/VendorDashboardPage'
import AdminDashboardPage from '@/pages/admin/dashboard/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage'
import AdminDestinationsPage from '@/pages/admin/destinations/AdminDestinationsPage'
import AdminVendorsPage from '@/pages/admin/vendors/AdminVendorsPage'
import AdminTicketsPage from '@/pages/admin/tickets/AdminTicketsPage'
import AdminVouchersPage from '@/pages/admin/vouchers/AdminVouchersPage'
import AdminReportsPage from '@/pages/admin/reports/AdminReportsPage'
import AdminEventsPage from '@/pages/admin/events/AdminEventsPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <BlankLayout />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/forgot-password', element: <Forgot /> },
          { path: '/register', element: <Register /> },
          { path: '/verify-otp', element: <VerifyOTP /> },
          { path: '/new-password', element: <NewPassword /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/about-us", element: <AboutUs /> },

          // Profile Routes - Auto-redirect based on role
          { path: "/account", element: <ProfilePage /> },
          { path: "/account/user", element: <UserProfilePage /> },
          { path: "/account/vendor", element: <VendorProfilePage /> },

          // Vendor Dashboard
          { path: "/vendor/dashboard", element: <VendorDashboardPage /> },

          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboardPage /> },
          { path: "destinations", element: <AdminDestinationsPage /> },
          { path: "users", element: <AdminUsersPage /> },
          { path: "vendors", element: <AdminVendorsPage /> },
          { path: "tickets", element: <AdminTicketsPage /> },
          { path: "vouchers", element: <AdminVouchersPage /> },
          { path: "reports", element: <AdminReportsPage /> },
          { path: "events", element: <AdminEventsPage /> },
        ],
      },
    ],
  },
])
