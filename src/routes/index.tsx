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
// Dashboard Pages
import UserDashboardPage from '@/pages/Dashboard/UserDashboardPage'
import VendorDashboardPage from '@/pages/Dashboard/VendorDashboardPage'
import AdminDashboardPage from '@/pages/Dashboard/AdminDashboardPage'
import AdminUsersPage from '@/pages/Dashboard/AdminUsersPage'

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

          // User/Tourist Dashboard
          { path: "/user/dashboard", element: <UserDashboardPage /> },

          // Vendor Dashboard
          { path: "/vendor/dashboard", element: <VendorDashboardPage /> },

          // Admin Dashboard
          { path: "/admin/dashboard", element: <AdminDashboardPage /> },
          { path: "/admin/users", element: <AdminUsersPage /> },

          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
