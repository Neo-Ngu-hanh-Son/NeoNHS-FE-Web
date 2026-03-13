# Codebase Index

Last updated: 2026-03-12

## 1) Purpose

This file is a fast map of the current frontend architecture so contributors can quickly find:

- where features live,
- how routing is organized,
- which hooks/services own data access,
- and where shared UI primitives are defined.

## 2) Runtime Entry Flow

1. `src/main.tsx`
   - Bootstraps React app.
   - Wraps app in `GoogleOAuthProvider`.
   - Imports global styles.
2. `src/app/App.tsx`
   - Mounts router via `RouterProvider`.
3. `src/routes/index.tsx`
   - Declares all route trees and layout boundaries.

## 3) High-Level Directory Map

### Root

- `docs/`: architecture and implementation guides.
- `public/`: static assets.
- `src/`: application code.

### `src/`

- `app/`: app shell (`App.tsx`).
- `assets/`: local image and static media assets.
- `components/`: reusable feature and shared components.
- `constants/`: global and feature constants.
- `contexts/`: React context providers (`Auth`, `BlogForm`).
- `hooks/`: reusable data/state hooks by domain.
- `layouts/`: route layout shells.
- `pages/`: route-level screens and page-local feature modules.
- `routes/`: route definitions.
- `services/api/`: API client and domain services.
- `styles/`: global CSS.
- `types/`: domain and shared TypeScript contracts.
- `utils/`: cross-domain utility helpers.

## 4) Route Index

Source of truth: `src/routes/index.tsx`

### BlankLayout routes

- `/login`
- `/forgot-password`
- `/register`
- `/verify-otp`
- `/new-password`
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
- `/vendor/ticket-verification`
- `/vendor/vouchers`

### AdminLayout routes

- `/admin/dashboard`
- `/admin/destinations`
- `/admin/destinations/:id/audioHistory`
- `/admin/users`
- `/admin/vendors`
- `/admin/vendors/templates`
- `/admin/tickets`
- `/admin/vouchers`
- `/admin/vouchers/create`
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

## 5) Layout Index

- `src/layouts/RootLayout.tsx`: top-level provider boundary (`AuthProvider`).
- `src/layouts/BlankLayout.tsx`: no header/footer shell.
- `src/layouts/AppLayout.tsx`: public site shell.
- `src/layouts/admin/AdminLayout.tsx`: admin app shell.
- `src/layouts/vendor/VendorLayout.tsx`: vendor app shell.
- `src/layouts/DashboardLayout.tsx`: dashboard-oriented shell wrapper.
- `src/layouts/ProfileLayout.tsx`: profile-oriented shell wrapper.

## 6) Feature Domains Under `src/pages/`

- `AuthPage/`: login/register/password reset and OTP flows.
- `ProfilePage/`: account/profile views for user/vendor.
- `admin/dashboard/`: analytics cards/charts.
- `admin/destinations/`: destination + point management.
- `admin/historyAudio/`: destination audio history management.
- `admin/events/`: event CRUD + ticket catalog management.
- `admin/tags/`: event/workshop tags management.
- `admin/blog/`: blog management and editor pages.
- `admin/blog-categories/`: blog category management.
- `admin/panorama/`: panorama editor and hotspot management.
- `admin/reports/`: report listing and detail pages.
- `admin/revenue/`: revenue dashboard page.
- `admin/vouchers/`: voucher listing, create, detail, and edit pages.
- `admin/vendors/`: vendor management.
- `admin/vendorTemplate/`: vendor workshop template review.
- `vendor/WorkshopTemplates/`: vendor template lifecycle.
- `vendor/WorkshopSessions/`: session list/calendar CRUD.
- `vendor/WorkshopCalendar/`: calendar view.
- `vendor/Tickets/`: ticket verification.
- `vendor/Vouchers/`: vendor voucher page.
- `Panorama/`: public/mobile panorama viewers.
- `Blog/`: public blog detail page.

## 7) Shared Components Index (`src/components/`)

- `ui/`: shadcn-style UI primitives.
- `common/`: cross-feature shared widgets (`MapPicker`, pagination, wrappers).
- `adminLayout/`: navigation components used in dashboard shells.
- `dashboard/`: dashboard cards/sidebar widgets.
- `profile/`: profile forms/cards and role-based sidebars.
- `blog/`: Lexical editor, toolbar, table, visitor renderers.
- `blog-categories/`: category CRUD modal/table components.
- `tags/`: tag CRUD modal/table components.
- `headfoot/`: public header/footer.

## 8) Hooks Index (`src/hooks/`)

- `auth/useAuth.ts`
- `blog/useBlogs.ts`
- `blog/useBlogDetail.ts`
- `blog/useBlogCategories.ts`
- `event/useEvents.ts`
- `event/useEvent.ts`
- `event/useCreateEvent.ts`
- `event/useUpdateEvent.ts`
- `event/useTags.ts`
- `event/useTicketCatalogs.ts`
- `historyAudio/useHistoryAudios.ts`
- `tag/useAdminTags.ts`
- `voucher/useVouchers.ts`
- `voucher/useVoucher.ts`
- `voucher/useCreateVoucher.ts`
- `voucher/useUpdateVoucher.ts`
- `voucher/useVendorVouchers.ts`

## 9) API Service Index (`src/services/api/`)

- Core: `apiClient.ts`
- Auth/user/vendor: `authService.ts`, `userService.ts`, `vendorService.ts`, `adminUserService.ts`
- Destination/point/panorama/audio:
  - `attractionService.ts`
  - `pointService.ts`
  - `panoramaService.ts`
  - `historyAudioService.ts`
  - `historyAudioGuideService.ts`
- Events/tags/tickets:
  - `eventService.ts`
  - `tagService.ts`
  - `workshopTagService.ts`
  - `wtagService.ts`
  - `ticketCatalogService.ts`
- Blog:
  - `blogService.ts`
  - `publicBlogService.ts`
  - `blogCategoryService.ts`
- Workshop:
  - `workshopTemplateService.ts`
  - `workshopSessionService.ts`
  - `adminWorkshopService.ts`
  - `workshopService.ts`
- Admin stats/reporting:
  - `adminDashboardService.ts`
  - `adminReportService.ts`
- Voucher:
  - `voucherService.ts`

## 10) Type Domains (`src/types/`)

- Core shared contracts in `index.ts`.
- Feature contracts in:
  - `adminDashboard.ts`
  - `adminReport.ts`
  - `attraction.ts`
  - `blog.ts`
  - `event.ts`
  - `historyAudio.ts`
  - `panorama.ts`
  - `point.ts`
  - `tag.ts`
  - `ticketCatalog.ts`
  - `voucher.ts`

## 11) Architecture Conventions

- Use `@/` alias imports (`@` maps to `src`).
- Keep screens thin; move data logic to hooks/services.
- Keep API access inside service layer (`src/services/api/*`).
- Prefer feature-local modules for complex domains (`components`, `hooks`, `types`, `utils` co-located under each page domain).
- Reuse shared primitives from `src/components/ui/` and `src/components/common/`.

## 12) Quick Navigation Shortcuts

- Route source of truth: `src/routes/index.tsx`
- App providers: `src/layouts/RootLayout.tsx`, `src/contexts/AuthContext.tsx`
- API client: `src/services/api/apiClient.ts`
- Shared component barrels: `src/components/index.ts`, `src/hooks/event/index.ts`, `src/hooks/voucher/index.ts`
