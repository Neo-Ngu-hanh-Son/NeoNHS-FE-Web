# Codebase Index

Last updated: 2026-04-08

## 1) Purpose

This file is a current map of the frontend architecture so contributors can quickly locate:

- runtime entry points,
- route ownership by layout,
- domain folders in `pages`,
- reusable hooks/services/types,
- and shared UI building blocks.

## 2) Runtime Entry Flow

1. `src/main.tsx`
   - Creates React root.
   - Wraps app with `GoogleOAuthProvider`.
   - Loads global font and style assets.
2. `src/app/App.tsx`
   - Mounts `<RouterProvider router={router} />`.
3. `src/routes/index.tsx`
   - Defines all route trees under `RootLayout`.
4. `src/layouts/RootLayout.tsx`
   - Provides global `AuthProvider` context.

## 3) High-Level Directory Map

### Root

- `docs/`: architecture and integration guides.
- `public/`: static assets served as-is.
- `src/`: application source code.

### `src/`

- `app/`: app shell and router mount.
- `assets/`: bundled images/static resources.
- `components/`: reusable UI and feature components.
- `constants/`: constants by domain.
- `contexts/`: shared React contexts.
- `hooks/`: reusable data/state hooks.
- `layouts/`: route shell layouts.
- `lib/`: helper libs (for example `utils.ts`).
- `pages/`: route-level pages and page-local modules.
- `routes/`: route declarations.
- `services/api/`: API client and domain services.
- `styles/`: global styles.
- `types/`: TypeScript domain contracts.
- `utils/`: cross-domain helper utilities.

## 4) Route Index

Source of truth: `src/routes/index.tsx`

### BlankLayout routes

- `/login`
- `/forgot-password`
- `/register`
- `/verify-otp`
- `/new-password`
- `/set-password`
- `/simple-map`
- `/places/:placeId/panorama`
- `/places/:pointId/checkin-points/:checkinPointId/panorama`
- `/places/panorama/mobile`
- `/places/checkin-points/panorama/mobile`

### AppLayout routes (public shell)

- `/`
- `/about-us`
- `/blog/:id`
- `/account`
- `/account/user`
- `*` (not found)

### VendorLayout routes

- `/vendor/dashboard`
- `/vendor/profile`
- `/vendor/workshop-templates`
- `/vendor/workshop-templates/new`
- `/vendor/workshop-templates/:id`
- `/vendor/workshop-templates/:id/edit`
- `/vendor/workshop-sessions`
- `/vendor/workshop-calendar`
- `/vendor/messages`
- `/vendor/ticket-verification`
- `/vendor/vouchers`
- `/vendor/vouchers/deleted`

### AdminLayout routes

- `/admin/dashboard`
- `/admin/destinations`
- `/admin/checkin-points`
- `/admin/destinations/:id/audioHistory`
- `/admin/users`
- `/admin/vendors`
- `/admin/vendors/templates`
- `/admin/tickets`
- `/admin/vouchers`
- `/admin/vouchers/platform`
- `/admin/vouchers/vendor`
- `/admin/vouchers/create`
- `/admin/vouchers/deleted`
- `/admin/vouchers/:id`
- `/admin/vouchers/:id/edit`
- `/admin/reports`
- `/admin/reports/:id`
- `/admin/revenue`
- `/admin/events`
- `/admin/events/create`
- `/admin/events/:id`
- `/admin/events/:id/edit`
- `/admin/event-tags`
- `/admin/workshop-tags`
- `/admin/blog-categories`
- `/admin/blog`
- `/admin/blog/create`
- `/admin/blog/:id`
- `/admin/blog/:id/edit`
- `/admin/places/:pointId/panorama/edit`
- `/admin/places/:pointId/checkin-points/:checkinPointId/panorama/edit`
- `/admin/messages`

## 5) Layout Index

- `src/layouts/RootLayout.tsx`: top-level provider wrapper (`AuthProvider`).
- `src/layouts/BlankLayout.tsx`: auth and utility pages without app chrome.
- `src/layouts/AppLayout.tsx`: public site shell.
- `src/layouts/admin/AdminLayout.tsx`: admin shell.
- `src/layouts/vendor/VendorLayout.tsx`: vendor shell.
- `src/layouts/DashboardLayout.tsx`: dashboard-oriented shell helper.
- `src/layouts/ProfileLayout.tsx`: profile-oriented shell helper.

## 6) Feature Domains Under `src/pages/`

### Top-level pages

- `AboutUs.tsx`, `HomePage.tsx`, `LandingPage.tsx`, `NotFoundPage.tsx`, `SimpleMapView.tsx`, `figma.tsx`.

### Major page domains

- `AuthPage/`: login/register/password + OTP/set-password.
- `ProfilePage/`: profile redirects and role-specific profile pages.
- `Blog/`: public blog detail rendering.
- `Chat/`: chat page + sidebar/messages/composer components.
- `Panorama/`: public panorama viewer and mobile viewer.
- `admin/`: admin platform domains.
- `vendor/`: vendor operations domains.

### Admin domains

- `admin/dashboard/`: admin analytics UI.
- `admin/destinations/`: destination and point management.
- `admin/checkin-points/`: checkin point CRUD.
- `admin/historyAudio/`: history audio management.
- `admin/events/`: event CRUD + ticket catalogs + event timelines.
- `admin/tags/`: event and workshop tags.
- `admin/blog/`: admin blog CRUD/editor pages.
- `admin/blog-categories/`: category management.
- `admin/panorama/`: panorama/hotspot editor.
- `admin/reports/`: report list/detail.
- `admin/revenue/`: revenue analytics.
- `admin/vouchers/`: platform/vendor voucher admin flows.
- `admin/vendors/`: vendor CRUD/review actions.
- `admin/vendorTemplate/`: workshop template moderation.
- `admin/users/`: user listing and moderation actions.
- `admin/tickets/`: ticket admin page.

### Vendor domains

- `vendor/dashboard/`: vendor dashboard metrics.
- `vendor/WorkshopTemplates/`: template CRUD/review submission.
- `vendor/WorkshopSessions/`: session management and calendar views.
- `vendor/WorkshopCalendar/`: calendar-centric view.
- `vendor/Tickets/`: ticket verification.
- `vendor/Vouchers/`: voucher list + deleted vouchers.

## 7) Shared Components Index (`src/components/`)

- `ui/`: primitive controls (dialog, select, tabs, etc.).
- `common/`: cross-feature widgets (`MapPicker`, pagination, uploader, wrappers).
- `adminLayout/`: admin navigation/menu components.
- `dashboard/`: dashboard cards/sidebar widgets.
- `profile/`: profile forms/avatar/sidebar blocks.
- `blog/`: editor, toolbar, table, visitor renderer modules.
- `blog-categories/`: category CRUD UI set.
- `tags/`: tag CRUD UI set.
- `headfoot/`: public header/footer.
- `index.ts`: component barrel exports.

## 8) Hooks Index (`src/hooks/`)

### Auth

- `auth/useAuth.ts`

### Blog

- `blog/useBlogs.ts`
- `blog/useBlogDetail.ts`
- `blog/useBlogCategories.ts`

### Event

- `event/useEvents.ts`
- `event/useEvent.ts`
- `event/useCreateEvent.ts`
- `event/useUpdateEvent.ts`
- `event/useTags.ts`
- `event/useTicketCatalogs.ts`
- `event/useEventTimelines.ts`
- `event/index.ts`

### Checkin points

- `checkinPoint/useAdminCheckinPoints.ts`
- `checkinPoint/index.ts`

### Vendor dashboard

- `vendor/useVendorDashboard.ts`

### History audio

- `historyAudio/useHistoryAudios.ts`

### Tags

- `tag/useAdminTags.ts`

### Vouchers

- `voucher/useVouchers.ts`
- `voucher/useVoucher.ts`
- `voucher/useCreateVoucher.ts`
- `voucher/useUpdateVoucher.ts`
- `voucher/useVendorVouchers.ts`
- `voucher/index.ts`

### Routing helper

- `webRoute/useIsActive.tsx`

## 9) API Service Index (`src/services/api/`)

### Core

- `apiClient.ts`

### Identity and users

- `authService.ts`
- `userService.ts`
- `vendorService.ts`
- `adminUserService.ts`
- `adminVendorService.ts`
- `vendorDashboardService.ts`

### Destination, point, panorama, checkin, audio

- `attractionService.ts`
- `pointService.ts`
- `checkinPointService.ts`
- `panoramaService.ts`
- `historyAudioService.ts`
- `historyAudioGuideService.ts`

### Event, timeline, tags, tickets

- `eventService.ts`
- `eventTimelineService.ts`
- `tagService.ts`
- `workshopTagService.ts`
- `wtagService.ts`
- `ticketCatalogService.ts`

### Blog

- `blogService.ts`
- `publicBlogService.ts`
- `blogCategoryService.ts`

### Workshop

- `workshopTemplateService.ts`
- `workshopSessionService.ts`
- `workshopService.ts`
- `adminWorkshopService.ts`

### Voucher

- `voucherService.ts`

### Reporting and dashboard

- `adminDashboardService.ts`
- `adminReportService.ts`

### Messaging

- `chatService.ts`

## 10) Type Domains (`src/types/`)

- `index.ts` (shared exports)
- `adminDashboard.ts`
- `adminReport.ts`
- `attraction.ts`
- `blog.ts`
- `checkinPoint.ts`
- `event.ts`
- `eventTimeline.ts`
- `historyAudio.ts`
- `panorama.ts`
- `point.ts`
- `tag.ts`
- `ticketCatalog.ts`
- `voucher.ts`

## 11) Architecture Conventions

- Use `@/` alias imports (`@` resolves to `src`).
- Keep page components thin; move side effects/data access to hooks and services.
- Centralize HTTP calls in `src/services/api/*`.
- Co-locate complex feature modules under each domain folder in `pages`.
- Reuse shared primitives from `src/components/ui` and `src/components/common`.

## 12) Quick Navigation Shortcuts

- Route source of truth: `src/routes/index.tsx`
- Global providers: `src/layouts/RootLayout.tsx`, `src/contexts/AuthContext.tsx`
- API client entry: `src/services/api/apiClient.ts`
- Shared component barrel: `src/components/index.ts`
- Event hooks barrel: `src/hooks/event/index.ts`
- Voucher hooks barrel: `src/hooks/voucher/index.ts`
