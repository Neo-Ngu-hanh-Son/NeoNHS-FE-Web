# Codebase Index

Last updated: 2026-02-22

## 1) Tech Stack

- React 19 + TypeScript + Vite
- Routing: `react-router-dom` (browser router)
- Styling/UI: Tailwind CSS, Ant Design, Radix UI primitives
- Forms/validation: React Hook Form + Zod
- Rich text: Lexical editor stack
- Maps: Leaflet + React Leaflet
- HTTP client: Axios

## 2) Runtime Entry Flow

- `src/main.tsx`
  - App bootstrap, global styles/fonts, Google OAuth provider.
- `src/app/App.tsx`
  - Mounts `RouterProvider`.
- `src/routes/index.tsx`
  - Defines route tree and layout nesting.

## 3) Route Map

### Public/Auth (BlankLayout)

- `/login` → `src/pages/AuthPage/Login.tsx`
- `/forgot-password` → `src/pages/AuthPage/Forgot.tsx`
- `/register` → `src/pages/AuthPage/Register.tsx`
- `/verify-otp` → `src/pages/AuthPage/VerifyOTP.tsx`
- `/new-password` → `src/pages/AuthPage/NewPassword.tsx`
- `/simple-map` → `src/pages/SimpleMapView.tsx`

### Public Site (AppLayout)

- `/` → `src/pages/HomePage.tsx`
- `/about-us` → `src/pages/AboutUs.tsx`
- `/blog/:id` → `src/pages/blog/BlogDetailsPage.tsx`
- `/account` → `src/pages/ProfilePage/index.tsx`
- `/account/user` → `src/pages/ProfilePage/UserProfilePage.tsx`
- `*` → `src/pages/NotFoundPage.tsx`

### Vendor (VendorLayout)

- `/vendor/dashboard` → `src/pages/vendor/dashboard/VendorDashboardPage.tsx`
- `/vendor/profile` → `src/pages/ProfilePage/VendorProfilePage.tsx`
- `/vendor/workshop-templates` → `src/pages/vendor/WorkshopTemplates/WorkshopTemplatesPage.tsx`
- `/vendor/workshop-sessions` → `src/pages/vendor/WorkshopSessions/WorkshopSessionsPage.tsx`
- `/vendor/workshop-calendar` → `src/pages/vendor/WorkshopCalendar/CalendarPage.tsx`
- `/vendor/ticket-verification` → `src/pages/vendor/Tickets/TicketVerificationPage.tsx`
- `/vendor/vouchers` → `src/pages/vendor/Vouchers/VouchersPage.tsx`

### Admin (AdminLayout)

- `/admin/dashboard` → `src/pages/admin/dashboard/AdminDashboardPage.tsx`
- `/admin/destinations` → `src/pages/admin/destinations/AdminDestinationsPage.tsx`
- `/admin/users` → `src/pages/admin/users/AdminUsersPage.tsx`
- `/admin/vendors` → `src/pages/admin/vendors/AdminVendorsPage.tsx`
- `/admin/tickets` → `src/pages/admin/tickets/AdminTicketsPage.tsx`
- `/admin/vouchers` → `src/pages/admin/vouchers/AdminVouchersPage.tsx`
- `/admin/reports` → `src/pages/admin/reports/AdminReportsPage.tsx`
- `/admin/events` → `src/pages/admin/events/index.tsx`
- `/admin/events/create` → `src/pages/admin/events/create.tsx`
- `/admin/events/:id` → `src/pages/admin/events/detail.tsx`
- `/admin/events/:id/edit` → `src/pages/admin/events/edit.tsx`
- `/admin/blog-categories` → `src/pages/admin/blog-categories/BlogCategoryPage.tsx`
- `/admin/blog` → `src/pages/admin/blog/ManageBlogPage.tsx`
- `/admin/blog/create` → `src/pages/admin/blog/BlogCreationPage.tsx`
- `/admin/blog/:id` → `src/pages/admin/blog/AdminBlogDetailPage.tsx`
- `/admin/blog/:id/edit` → `src/pages/admin/blog/BlogEditPage.tsx`

## 4) Layout & Shell

- `src/layouts/RootLayout.tsx` - top-level app wrapper (auth context boundary).
- `src/layouts/BlankLayout.tsx` - auth/simple pages.
- `src/layouts/AppLayout.tsx` - public shell.
- `src/layouts/admin/AdminLayout.tsx` - admin shell.
- `src/layouts/vendor/VendorLayout.tsx` - vendor shell.
- `src/layouts/ProfileLayout.tsx`, `src/layouts/DashboardLayout.tsx` - role/profile-specific sub-layout support.

## 5) State, Context, Hooks

- `src/contexts/AuthContext.tsx`
  - Session bootstrap (`checkAuth`), login/logout, Google login, current user state.
- `src/contexts/Blog/BlogFormContext.tsx`
  - Blog create form state, validation, category loading, submission pipeline.
- `src/hooks/auth/useAuth.ts`
  - Auth hook wrapper/entry.
- `src/hooks/blog/*`
  - Blog list/detail/category hooks (`useBlogs`, `useBlogDetail`, `useBlogCategories`).
- `src/hooks/event/*`
  - Event CRUD/support hooks (`useEvents`, `useEvent`, `useCreateEvent`, `useUpdateEvent`, `useTags`, `useTicketCatalogs`).

## 6) API Layer (`src/services/api`)

- `apiClient.ts` - Axios instance + interceptors.
- `authService.ts` - auth/login/profile/reset APIs.
- `blogService.ts`, `publicBlogService.ts` - admin/public blog APIs.
- `blogCategoryService.ts` - blog category CRUD/list APIs.
- `eventService.ts` - event APIs.
- `tagService.ts` - tag APIs.
- `ticketCatalogService.ts` - ticket catalog APIs.
- `attractionService.ts`, `pointService.ts` - destination/point APIs.
- `userService.ts`, `vendorService.ts` - user/vendor admin APIs.

## 7) Feature Component Areas

- `src/components/ui/*`
  - Radix-based reusable primitives (dialog, table, select, input, tabs, etc.).
- `src/components/common/*`
  - Shared app components (pagination, map picker, wrappers).
- `src/components/blog/*`
  - Blog admin UI: table, toolbar, delete dialog, creation sections.
- `src/components/blog/editor/*`
  - Lexical editor plugins/toolbars/image/table tooling.
- `src/components/blog-categories/*`
  - Blog category management modal/form/toolbar/table.
- `src/components/profile/*`
  - Profile forms/cards/password/avatar/sidebar.
- `src/components/dashboard/*`
  - Dashboard cards/sidebar/empty state.

## 8) Data Contracts & Helpers

- `src/types/*` - domain types (`event`, `blog`, `attraction`, `point`, `tag`, `ticketCatalog`).
- `src/constants/*` - blog/blog-category constants.
- `src/utils/*` - cloudinary, generic helpers, API error message extraction.
- `src/lib/utils.ts` - shared UI helper utilities.

## 9) Notable Conventions

- Import alias: `@/` → `src/`.
- Feature-first structure in `src/pages/{domain}` + `src/components/{domain}`.
- Service-first API access via `src/services/api`.
- Route access boundaries are enforced mainly through layout composition + auth context.

## 10) Current Notes

- `src/routes/index.tsx` currently contains two `/admin` route blocks: one empty block and one full admin block. Consolidating these may reduce routing ambiguity.
