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
import ProfilePage from '@/pages/ProfilePage'
import { AboutUs } from '@/pages/AboutUs'
import { SimpleMapView } from '@/pages/SimpleMapView'

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
          { path: '/simple-map', element: <SimpleMapView /> },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/about-us", element: <AboutUs /> },
          { path: "/account", element: <ProfilePage /> },
          { path: "*", element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
