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
import { VendorLayout } from '@/layouts/vendor/VendorLayout'
// Dashboard Pages
import VendorDashboardPage from '@/pages/vendor/dashboard/VendorDashboardPage'
import AdminDashboardPage from '@/pages/admin/dashboard/AdminDashboardPage'
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage'
import AdminDestinationsPage from '@/pages/admin/destinations/AdminDestinationsPage'
import AdminVendorsPage from '@/pages/admin/vendors/AdminVendorsPage'
import AdminTicketsPage from '@/pages/admin/tickets/AdminTicketsPage'
import AdminVouchersPage from '@/pages/admin/vouchers/AdminVouchersPage'
import AdminReportsPage from '@/pages/admin/reports/AdminReportsPage'
import AdminEventsPage from '@/pages/admin/events'
import EventCreatePage from '@/pages/admin/events/create'
import EventDetailPage from '@/pages/admin/events/detail'
import EventEditPage from '@/pages/admin/events/edit'

// Vendor specific pages
import WorkshopTemplatesPage from '@/pages/vendor/WorkshopTemplates/WorkshopTemplatesPage'
import WorkshopSessionsPage from '@/pages/vendor/WorkshopSessions/WorkshopSessionsPage'
import WorkshopCalendarPage from '@/pages/vendor/WorkshopCalendar/CalendarPage.tsx'
import TicketVerificationPage from '@/pages/vendor/Tickets/TicketVerificationPage'
import VouchersPage from '@/pages/vendor/Vouchers/VouchersPage'
import BlogCategoryPage from '@/pages/admin/blog-categories/BlogCategoryPage'
import SimpleMapView from '@/pages/SimpleMapView'
import BlogPage from '@/pages/admin/blog/BlogPage'
import BlogCreationPage from "@/pages/admin/blog/BlogCreationPage";

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
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <BlogCategoryPage /> },
          { path: 'blog-categories', element: <BlogCategoryPage /> },
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

          { path: "*", element: <NotFoundPage /> },
        ],
      },
      {
        path: "/vendor",
        element: <VendorLayout />,
        children: [
          { path: "dashboard", element: <VendorDashboardPage /> },
          { path: "profile", element: <VendorProfilePage /> },
          { path: "workshop-templates", element: <WorkshopTemplatesPage /> },
          { path: "workshop-sessions", element: <WorkshopSessionsPage /> },
          { path: "workshop-calendar", element: <WorkshopCalendarPage /> },
          { path: "ticket-verification", element: <TicketVerificationPage /> },
          { path: "vouchers", element: <VouchersPage /> },
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
          { path: "events/create", element: <EventCreatePage /> },
          { path: "events/:id", element: <EventDetailPage /> },
          { path: "events/:id/edit", element: <EventEditPage /> },
          { path: 'blog-categories', element: <BlogCategoryPage /> },
          { path: 'blog/create', element: <BlogCreationPage /> },
          { path: 'blog', element: <BlogPage /> },
        ],
      },
    ],
  },
])
