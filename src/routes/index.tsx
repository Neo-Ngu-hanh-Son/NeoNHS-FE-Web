import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { BlankLayout } from '@/layouts/BlankLayout'
import { HomePage } from '@/pages/HomePage'
import Login from '@/pages/AuthPage/Login'
import Forgot from '@/pages/AuthPage/Forgot'
import Register from '@/pages/AuthPage/Register'
import { NotFoundPage } from '@/pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    element: <BlankLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/forgot-password', element: <Forgot /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <AppLayout />,

    children: [
      { path: "/", element: <HomePage /> },

      // { path: "/account", element: <ProfilePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
