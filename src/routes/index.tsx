import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { BlankLayout } from '@/layouts/BlankLayout';
import { HomePage } from '@/pages/HomePage';
import Login from '@/pages/AuthPage/Login';
import Forgot from '@/pages/AuthPage/Forgot';
import Register from '@/pages/AuthPage/Register';
import VerifyOTP from '@/pages/AuthPage/VerifyOTP';
import NewPassword from '@/pages/AuthPage/NewPassword';
import SetPasswordPage from '@/pages/AuthPage/SetPasswordPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProfilePage } from '@/pages/ProfilePage';
import UserProfilePage from '@/pages/ProfilePage/UserProfilePage';
import VendorProfilePage from '@/pages/ProfilePage/VendorProfilePage';
import { AboutUs } from '@/pages/AboutUs';
import { ContactUs } from '@/pages/ContactUs';
import { AdminLayout } from '@/layouts/admin/AdminLayout';
import { VendorLayout } from '@/layouts/vendor/VendorLayout';
// Dashboard Pages
import VendorDashboardPage from '@/pages/vendor/dashboard/VendorDashboardPage';
import AdminDashboardPage from '@/pages/admin/dashboard/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/users/AdminUsersPage';
import AdminDestinationsPage from '@/pages/admin/destinations/AdminDestinationsPage';
import AdminVendorsPage from '@/pages/admin/vendors/AdminVendorsPage';
import AdminVendorTemplatesPage from '@/pages/admin/vendorTemplate/AdminVendorTemplatesPage';
import AdminTicketsPage from '@/pages/admin/tickets/AdminTicketsPage';
import AdminVouchersPage from '@/pages/admin/vouchers';
import PlatformVouchersPage from '@/pages/admin/vouchers/PlatformVouchers';
import VendorVouchersPage from '@/pages/admin/vouchers/VendorVouchers';
import VoucherCreatePage from '@/pages/admin/vouchers/create';
import VoucherDetailPage from '@/pages/admin/vouchers/detail';
import VoucherEditPage from '@/pages/admin/vouchers/edit';
import AdminDeletedVouchersPage from '@/pages/admin/vouchers/deleted';
import AdminReportsPage from '@/pages/admin/reports/AdminReportsPage';
import AdminReportDetailPage from '@/pages/admin/reports/AdminReportDetailPage';
import AdminEventsPage from '@/pages/admin/events';
import EventCreatePage from '@/pages/admin/events/create';
import EventDetailPage from '@/pages/admin/events/detail';
import EventEditPage from '@/pages/admin/events/edit';
import RevenuePage from '@/pages/admin/revenue/RevenuePage';

// Vendor specific pages
import WorkshopTemplatesPage from '@/pages/vendor/WorkshopTemplates/WorkshopTemplatesPage';
import WorkshopTemplateDetailPage from '@/pages/vendor/WorkshopTemplates/WorkshopTemplateDetailPage';
import WorkshopTemplateCreatePage from '@/pages/vendor/WorkshopTemplates/WorkshopTemplateCreatePage';
import WorkshopTemplateEditPage from '@/pages/vendor/WorkshopTemplates/WorkshopTemplateEditPage';
import WorkshopSessionsPage from '@/pages/vendor/WorkshopSessions/WorkshopSessionsPage';
import WorkshopCalendarPage from '@/pages/vendor/WorkshopCalendar/CalendarPage.tsx';
import TicketVerificationPage from '@/pages/vendor/Tickets/TicketVerificationPage';
import VouchersPage from '@/pages/vendor/Vouchers/VouchersPage';
import VendorDeletedVouchersPage from '@/pages/vendor/Vouchers/DeletedVouchersPage';
import BlogCategoryPage from '@/pages/admin/blog-categories/BlogCategoryPage';
import SimpleMapView from '@/pages/SimpleMapView';
import ManageBlogPage from '@/pages/admin/blog/ManageBlogPage';
import BlogCreationPage from '@/pages/admin/blog/BlogCreationPage';
import AdminBlogDetailPage from '@/pages/admin/blog/AdminBlogDetailPage';
import BlogEditPage from '@/pages/admin/blog/BlogEditPage';
import BlogDetailsPage from '@/pages/Blog/BlogDetailsPage';
import EventTagPage from '@/pages/admin/tags/EventTagPage';
import WorkshopTagPage from '@/pages/admin/tags/WorkshopTagPage';
import PanoramaScreen from '@/pages/Panorama/screens/PanoramaScreen';
import AdminPanoramaEditorPage from '@/pages/admin/panorama/AdminPanoramaEditorPage';
import PanoramaScreenMobile from '@/pages/Panorama/screens/PanoramaScreenMobile';
import ManageHistoryAudioPage from '@/pages/admin/historyAudio/screens/ManageHistoryAudioPage.tsx';
import AdminCheckinPointsPage from '@/pages/admin/checkin-points/AdminCheckinPointsPage';
import ChatPage from '@/pages/Chat/ChatPage';
import { RequireRole } from '@/routes/RequireRole';
import { UserRole } from '@/types';
import EventTimelineCreatePage from '@/pages/admin/events/timeline/EventTimelineCreatePage';

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
          { path: '/set-password', element: <SetPasswordPage /> },
          { path: '/simple-map', element: <SimpleMapView /> },
          { path: '/places/:placeId/panorama', element: <PanoramaScreen /> },
          {
            path: '/places/:pointId/checkin-points/:checkinPointId/panorama',
            element: <PanoramaScreen />,
          },
          { path: '/places/panorama/mobile', element: <PanoramaScreenMobile /> },
          {
            path: '/places/checkin-points/panorama/mobile',
            element: <PanoramaScreenMobile />,
          },
        ],
      },
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/about-us', element: <AboutUs /> },
          { path: '/contact-us', element: <ContactUs /> },
          { path: '/blog/:id', element: <BlogDetailsPage /> },

          // Profile Routes - Auto-redirect based on role
          { path: '/account', element: <ProfilePage /> },
          { path: '/account/user', element: <UserProfilePage /> },

          { path: '*', element: <NotFoundPage /> },
        ],
      },
      {
        path: '/vendor',
        element: (
          <RequireRole allowedRoles={[UserRole.VENDOR]}>
            <VendorLayout />
          </RequireRole>
        ),
        children: [
          { path: 'dashboard', element: <VendorDashboardPage /> },
          { path: 'profile', element: <VendorProfilePage /> },
          { path: 'workshop-templates', element: <WorkshopTemplatesPage /> },
          { path: 'workshop-templates/new', element: <WorkshopTemplateCreatePage /> },
          { path: 'workshop-templates/:id', element: <WorkshopTemplateDetailPage /> },
          { path: 'workshop-templates/:id/edit', element: <WorkshopTemplateEditPage /> },
          { path: 'workshop-sessions', element: <WorkshopSessionsPage /> },
          { path: 'workshop-calendar', element: <WorkshopCalendarPage /> },
          { path: 'messages', element: <ChatPage /> },
          { path: 'ticket-verification', element: <TicketVerificationPage /> },
          { path: 'vouchers', element: <VouchersPage /> },
          { path: 'vouchers/deleted', element: <VendorDeletedVouchersPage /> },
        ],
      },
      {
        path: '/admin',
        element: (
          <RequireRole allowedRoles={[UserRole.ADMIN]}>
            <AdminLayout />
          </RequireRole>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'destinations', element: <AdminDestinationsPage /> },
          { path: 'checkin-points', element: <AdminCheckinPointsPage /> },
          { path: 'destinations/:id/audioHistory', element: <ManageHistoryAudioPage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'vendors', element: <AdminVendorsPage /> },
          { path: 'vendors/templates', element: <AdminVendorTemplatesPage /> },
          { path: 'tickets', element: <AdminTicketsPage /> },
          { path: 'vouchers', element: <AdminVouchersPage /> },
          { path: 'vouchers/platform', element: <PlatformVouchersPage /> },
          { path: 'vouchers/vendor', element: <VendorVouchersPage /> },
          { path: 'vouchers/create', element: <VoucherCreatePage /> },
          { path: 'vouchers/deleted', element: <AdminDeletedVouchersPage /> },
          { path: 'vouchers/:id', element: <VoucherDetailPage /> },
          { path: 'vouchers/:id/edit', element: <VoucherEditPage /> },
          { path: 'reports', element: <AdminReportsPage /> },
          { path: 'reports/:id', element: <AdminReportDetailPage /> },
          { path: 'revenue', element: <RevenuePage /> },
          { path: 'events', element: <AdminEventsPage /> },
          { path: 'event-tags', element: <EventTagPage /> },
          { path: 'workshop-tags', element: <WorkshopTagPage /> },
          { path: 'events/create', element: <EventCreatePage /> },
          { path: 'events/:id', element: <EventDetailPage /> },
          { path: 'events/:id/edit', element: <EventEditPage /> },
          { path: 'events/:id/timeline/create', element: <EventTimelineCreatePage /> },
          { path: 'blog-categories', element: <BlogCategoryPage /> },
          { path: 'blog', element: <ManageBlogPage /> },
          { path: 'blog/create', element: <BlogCreationPage /> },
          { path: 'blog/:id', element: <AdminBlogDetailPage /> },
          { path: 'blog/:id/edit', element: <BlogEditPage /> },
          { path: 'places/:pointId/panorama/edit', element: <AdminPanoramaEditorPage /> },
          {
            path: 'places/:pointId/checkin-points/:checkinPointId/panorama/edit',
            element: <AdminPanoramaEditorPage />,
          },
          { path: 'messages', element: <ChatPage /> },
        ],
      },
    ],
  },
]);
