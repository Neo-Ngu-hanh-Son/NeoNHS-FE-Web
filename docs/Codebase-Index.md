# Codebase Index

Last updated: 2026-02-27

## 1) Tech Stack

| Layer               | Technology                              | Version           |
| ------------------- | --------------------------------------- | ----------------- |
| UI framework        | React + ReactDOM                        | ^19.1.1           |
| Language            | TypeScript                              | ~5.9.3            |
| Bundler             | Vite (`@vitejs/plugin-react`)           | ^7.2.4            |
| Routing             | `react-router-dom`                      | ^7.11.0           |
| Styling             | Tailwind CSS + `tailwindcss-animate`    | ^3.4.17           |
| UI components       | Ant Design (`antd`)                     | ^6.2.2            |
| Headless primitives | Radix UI (`@radix-ui/*`)                | various           |
| Icons               | `lucide-react`, `@ant-design/icons`     | ^0.563.0 / ^6.1.0 |
| Forms               | React Hook Form + `@hookform/resolvers` | ^7.71.1 / ^5.2.2  |
| Validation          | Zod                                     | ^4.3.6            |
| Rich text editor    | Lexical (`lexical`, `@lexical/*`)       | ^0.40.0           |
| Maps                | Leaflet + React Leaflet                 | ^1.9.4 / ^5.0.0   |
| HTTP client         | Axios                                   | ^1.13.4           |
| Animations          | Framer Motion                           | ^12.33.0          |
| Auth                | `@react-oauth/google`                   | ^0.13.4           |
| Variant utility     | `class-variance-authority`              | ^0.7.1            |
| Class merging       | `clsx` + `tailwind-merge`               | ^2.1.1 / ^3.4.0   |
| Command palette     | `cmdk`                                  | ^1.1.1            |
| OTP input           | `input-otp`                             | ^1.4.2            |
| Excel export        | `xlsx`                                  | ^0.18.5           |
| Font                | `@fontsource/roboto`                    | ^5.2.9            |

## 2) Configuration

- **Vite** — `@vitejs/plugin-react`; alias `@` → `./src`; dev proxy `/api` → `http://localhost:8080`.
- **TypeScript** — ES2022 target, `react-jsx`, strict mode, bundler resolution, path alias `@/*` → `src/*`.
- **Tailwind** — dark mode (class), custom fonts (Plus Jakarta Sans, Roboto), primary green palette, sidebar/chart/card semantic tokens via HSL CSS vars, `tailwindcss-animate` plugin.
- **CSS vars** (in `globals.css`) — light theme primary `#1a8f3e` / `140 70% 33%`, chart colors, sidebar colors, border radius.

## 3) Runtime Entry Flow

- `src/main.tsx` — bootstraps app inside `<GoogleOAuthProvider>` + `<React.StrictMode>`, imports Roboto (400/500/700) and `globals.css`.
- `src/app/App.tsx` — renders `<RouterProvider router={router} />`.
- `src/routes/index.tsx` — defines the full route tree under `RootLayout`.

## 4) Route Map

### Auth/Simple (BlankLayout — no header/footer)

| Route              | Page                                 |
| ------------------ | ------------------------------------ |
| `/login`           | `src/pages/AuthPage/Login.tsx`       |
| `/forgot-password` | `src/pages/AuthPage/Forgot.tsx`      |
| `/register`        | `src/pages/AuthPage/Register.tsx`    |
| `/verify-otp`      | `src/pages/AuthPage/VerifyOTP.tsx`   |
| `/new-password`    | `src/pages/AuthPage/NewPassword.tsx` |
| `/simple-map`      | `src/pages/SimpleMapView.tsx`        |

### Public Site (AppLayout — Header + Footer)

| Route           | Page                                                    |
| --------------- | ------------------------------------------------------- |
| `/`             | `src/pages/HomePage.tsx`                                |
| `/about-us`     | `src/pages/AboutUs.tsx`                                 |
| `/blog/:id`     | `src/pages/blog/BlogDetailsPage.tsx`                    |
| `/account`      | `src/pages/ProfilePage/index.tsx` (role-based redirect) |
| `/account/user` | `src/pages/ProfilePage/UserProfilePage.tsx`             |
| `*`             | `src/pages/NotFoundPage.tsx`                            |

### Vendor (VendorLayout — sidebar + breadcrumbs)

| Route                                 | Page                                                                |
| ------------------------------------- | ------------------------------------------------------------------- |
| `/vendor/dashboard`                   | `src/pages/vendor/dashboard/VendorDashboardPage.tsx`                |
| `/vendor/profile`                     | `src/pages/ProfilePage/VendorProfilePage.tsx`                       |
| `/vendor/workshop-templates`          | `src/pages/vendor/WorkshopTemplates/WorkshopTemplatesPage.tsx`      |
| `/vendor/workshop-templates/new`      | `src/pages/vendor/WorkshopTemplates/WorkshopTemplateCreatePage.tsx` |
| `/vendor/workshop-templates/:id`      | `src/pages/vendor/WorkshopTemplates/WorkshopTemplateDetailPage.tsx` |
| `/vendor/workshop-templates/:id/edit` | `src/pages/vendor/WorkshopTemplates/WorkshopTemplateEditPage.tsx`   |
| `/vendor/workshop-sessions`           | `src/pages/vendor/WorkshopSessions/WorkshopSessionsPage.tsx`        |
| `/vendor/workshop-calendar`           | `src/pages/vendor/WorkshopCalendar/CalendarPage.tsx`                |
| `/vendor/ticket-verification`         | `src/pages/vendor/Tickets/TicketVerificationPage.tsx`               |
| `/vendor/vouchers`                    | `src/pages/vendor/Vouchers/VouchersPage.tsx`                        |

### Admin (AdminLayout — collapsible sidebar + top navbar + breadcrumbs)

| Route                      | Page                                                          |
| -------------------------- | ------------------------------------------------------------- |
| `/admin/dashboard`         | `src/pages/admin/dashboard/AdminDashboardPage.tsx`            |
| `/admin/destinations`      | `src/pages/admin/destinations/AdminDestinationsPage.tsx`      |
| `/admin/users`             | `src/pages/admin/users/AdminUsersPage.tsx`                    |
| `/admin/vendors`           | `src/pages/admin/vendors/AdminVendorsPage.tsx`                |
| `/admin/vendors/templates` | `src/pages/admin/vendorTemplate/AdminVendorTemplatesPage.tsx` |
| `/admin/tickets`           | `src/pages/admin/tickets/AdminTicketsPage.tsx`                |
| `/admin/vouchers`          | `src/pages/admin/vouchers/AdminVouchersPage.tsx`              |
| `/admin/reports`           | `src/pages/admin/reports/AdminReportsPage.tsx`                |
| `/admin/events`            | `src/pages/admin/events/index.tsx`                            |
| `/admin/events/create`     | `src/pages/admin/events/create.tsx`                           |
| `/admin/events/:id`        | `src/pages/admin/events/detail.tsx`                           |
| `/admin/events/:id/edit`   | `src/pages/admin/events/edit.tsx`                             |
| `/admin/event-tags`        | `src/pages/admin/tags/EventTagPage.tsx`                       |
| `/admin/workshop-tags`     | `src/pages/admin/tags/WorkshopTagPage.tsx`                    |
| `/admin/blog-categories`   | `src/pages/admin/blog-categories/BlogCategoryPage.tsx`        |
| `/admin/blog`              | `src/pages/admin/blog/ManageBlogPage.tsx`                     |
| `/admin/blog/create`       | `src/pages/admin/blog/BlogCreationPage.tsx`                   |
| `/admin/blog/:id`          | `src/pages/admin/blog/AdminBlogDetailPage.tsx`                |
| `/admin/blog/:id/edit`     | `src/pages/admin/blog/BlogEditPage.tsx`                       |

## 5) Layouts

| Layout            | File                                  | Purpose                                                                                                                                                                                                                                                      |
| ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `RootLayout`      | `src/layouts/RootLayout.tsx`          | Top-level wrapper; wraps entire app with `<AuthProvider>` + `<Outlet />`                                                                                                                                                                                     |
| `BlankLayout`     | `src/layouts/BlankLayout.tsx`         | Bare `<Outlet />` for auth/simple pages                                                                                                                                                                                                                      |
| `AppLayout`       | `src/layouts/AppLayout.tsx`           | Public pages: Header + content + Footer                                                                                                                                                                                                                      |
| `AdminLayout`     | `src/layouts/admin/AdminLayout.tsx`   | Admin shell: collapsible sidebar (Dashboard, Destinations, Users, Vendors → Management/Template Review, Tickets, Vouchers, Reports, Events, Event Tags, Workshop Tags, Blogs → Blog Categories/Blog), top navbar with search/notifications/user, breadcrumbs |
| `VendorLayout`    | `src/layouts/vendor/VendorLayout.tsx` | Vendor shell: collapsible sidebar (Dashboard, Profile, Workshop Templates/Sessions/Calendar, Ticket Verification, Vouchers), dynamic breadcrumbs, top navbar                                                                                                 |
| `DashboardLayout` | `src/layouts/DashboardLayout.tsx`     | `ModernSidebar` + content area (sub-layout wrapper)                                                                                                                                                                                                          |
| `ProfileLayout`   | `src/layouts/ProfileLayout.tsx`       | `RoleBasedSidebar` + content grid (sub-layout wrapper)                                                                                                                                                                                                       |

## 6) Contexts

| Context                           | File                                    | Purpose                                                                                                                                                                                                            |
| --------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AuthContext` / `useAuth`         | `src/contexts/AuthContext.tsx`          | Session bootstrap via `checkAuth()`, login/logout/loginGoogle, current user state, `updateUser`                                                                                                                    |
| `BlogFormContext` / `useBlogForm` | `src/contexts/Blog/BlogFormContext.tsx` | Blog creation form state (`BlogFormState`: title, slug, summary, contentJSON/HTML, thumbnailUrl, bannerUrl, tags, isFeatured, categoryId, status), category loading, `validate()`, `triggerSave()`, `submitBlog()` |

## 7) Hooks

| Hook                | File                                   | Purpose                                                                                                               |
| ------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `useAuth`           | `src/hooks/auth/useAuth.ts`            | Re-exports `useAuth` from AuthContext (backward compat)                                                               |
| `useBlogs`          | `src/hooks/blog/useBlogs.ts`           | Admin blog list: pagination, search, status filter, sorting, delete dialog, `refetch`                                 |
| `useBlogDetail`     | `src/hooks/blog/useBlogDetail.ts`      | Single published blog by ID (public endpoint)                                                                         |
| `useBlogCategories` | `src/hooks/blog/useBlogCategories.ts`  | Blog category list with modal state (create/edit/view/delete)                                                         |
| `useEvents`         | `src/hooks/event/useEvents.ts`         | Paginated event list, `deleteEvent`, `restoreEvent`                                                                   |
| `useEvent`          | `src/hooks/event/useEvent.ts`          | Single event by ID                                                                                                    |
| `useCreateEvent`    | `src/hooks/event/useCreateEvent.ts`    | `createEvent(data)` + loading state                                                                                   |
| `useUpdateEvent`    | `src/hooks/event/useUpdateEvent.ts`    | `updateEvent(id, data)` + loading state                                                                               |
| `useTags`           | `src/hooks/event/useTags.ts`           | All active tags (public, for dropdowns)                                                                               |
| `useTicketCatalogs` | `src/hooks/event/useTicketCatalogs.ts` | CRUD for ticket catalogs scoped to an event                                                                           |
| `useAdminTags`      | `src/hooks/tag/useAdminTags.ts`        | Generic tag admin hook (`kind: 'event' \| 'workshop'`): pagination, sorting, modal state (create/edit/delete/restore) |

## 8) API Layer (`src/services/api/`)

| Service                   | File                         | Endpoints / Methods                                                                                                                                                              |
| ------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **API Client**            | `apiClient.ts`               | Axios instance; base URL from `VITE_API_BASE_URL` (fallback `http://localhost:8080/api`); Bearer token interceptor; response unwrapping                                          |
| **Auth**                  | `authService.ts`             | `login`, `logout`, `register`, `loginGoogle`, `refreshToken`, `getCurrentUser`, `forgotPassword`, `verifyOTP`, `resetPassword`, `verifyRegistrationOTP`, `resendRegistrationOTP` |
| **User**                  | `userService.ts`             | `getProfile`, `updateProfile`, `changePassword`                                                                                                                                  |
| **Vendor**                | `vendorService.ts`           | `getVendorProfile`, `updateVendorProfile`                                                                                                                                        |
| **Attraction**            | `attractionService.ts`       | `getAllAttractions`, `getAttractionsWithPagination`, `getAttractionById`, `createAttraction`, `updateAttraction`, `deleteAttraction`                                             |
| **Point**                 | `pointService.ts`            | `getPointsByAttraction`, `getPointsWithPagination`, `getPointById`, `createPoint`, `updatePoint`, `deletePoint`                                                                  |
| **Event**                 | `eventService.ts`            | `getAllEvents`, `getEventById`, `createEvent`, `updateEvent`, `deleteEvent`, `restoreEvent`, `permanentDeleteEvent`                                                              |
| **Tag**                   | `tagService.ts`              | `getAllTagsList` (public), `getAllTags` (admin, paged), `getTagById`, `createTag`, `updateTag`, `deleteTag`, `restoreTag`                                                        |
| **Workshop Tag**          | `workshopTagService.ts`      | `getAllWorkshopTags` (paged), `getAllWorkshopTagsList`, `getWorkshopTagById`, `createWorkshopTag`, `updateWorkshopTag`, `deleteWorkshopTag`                                      |
| **Workshop Tag (vendor)** | `wtagService.ts`             | `getAllTags`, `getTags`, `getTagById` (read-only, vendor use)                                                                                                                    |
| **Ticket Catalog**        | `ticketCatalogService.ts`    | `getByEventId`, `getById`, `create`, `update`, `delete`, `restore`, `permanentDelete` — scoped to `/admin/events/{eventId}/ticket-catalogs`                                      |
| **Blog (admin)**          | `blogService.ts`             | `getBlogs`, `createBlog`, `updateBlog`, `deleteBlog`, `getBlogById` — base `/admin/blogs`                                                                                        |
| **Blog (public)**         | `publicBlogService.ts`       | `getBlogById`, `getBlogs` — base `/blogs`                                                                                                                                        |
| **Blog Category**         | `blogCategoryService.ts`     | `getCategories`, `createCategory`, `updateCategory`, `deleteCategory`, `getCategoryById` — base `/admin/blog-categories`                                                         |
| **Workshop Template**     | `workshopTemplateService.ts` | `getMyTemplates`, `getTemplateById`, `createTemplate`, `updateTemplate`, `submitForApproval`, `deleteTemplate`, `filterTemplates` — base `/workshops/templates`                  |
| **Workshop Session**      | `workshopSessionService.ts`  | `getMySessions`, `getSessionById`, `createSession`, `updateSession`, `cancelSession`, `deleteSession`, `getAllSessions` — transforms flat API → nested frontend structure        |
| **Admin Workshop**        | `adminWorkshopService.ts`    | `getAllWorkshopTemplates`, `getVendorWorkshopTemplates`, `approveTemplate`, `rejectTemplate` — base `/admin/vendors/workshop-templates`                                          |
| **Workshop**              | `workshopService.ts`         | Empty placeholder                                                                                                                                                                |

## 9) Types (`src/types/`)

| File               | Exports                                                                                                                                                                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`         | `UserRole` (`TOURIST \| ADMIN \| VENDOR`), `User`, `VendorProfile`, `VendorStats`, `ApiResponse<T>`, `PaginationParams`, `PaginatedResponse<T>` — re-exports `tag`, `ticketCatalog`, `event`                                                              |
| `tag.ts`           | `TagResponse`, `WorkshopTagResponse` (= TagResponse), `CreateTagRequest`, `UpdateTagRequest`, `PagedTagResponse<T>`                                                                                                                                       |
| `event.ts`         | `EventStatus` (UPCOMING/ONGOING/COMPLETED/CANCELLED), `EventImageResponse`, `EventResponse`, `CreateEventRequest`, `UpdateEventRequest`, `EventFilterRequest`, `PagedEventResponse`                                                                       |
| `ticketCatalog.ts` | `TicketCatalogStatus` (ACTIVE/INACTIVE/SOLD_OUT), `TicketCatalogResponse`, `CreateTicketCatalogRequest`, `UpdateTicketCatalogRequest`, `PagedTicketCatalogResponse`                                                                                       |
| `blog.ts`          | `BlogCategoryStatus` (ACTIVE/ARCHIVED), `BlogCategoryResponse`, `BlogCategoryPageResponse`, `BlogCategoryListParams`, `BlogCategoryRequest`, `BlogStatus` (DRAFT/PUBLISHED/ARCHIVED), `BlogResponse`, `BlogRequest`, `BlogListParams`, `BlogPageResponse` |
| `attraction.ts`    | `AttractionStatus` (OPEN/CLOSED/MAINTENANCE/TEMPORARILY_CLOSED), `AttractionResponse`, `AttractionRequest`                                                                                                                                                |
| `point.ts`         | `PointType` (PAGODA/CAVE/VIEWPOINT/GENERAL/CHECKIN/STATUE/GATE/SHOP/ELEVATOR/EVENT/WORKSHOP/ATTRACTION/DEFAULT), `PointRequest`, `PointResponse`                                                                                                          |

## 10) Constants (`src/constants/`)

| File              | Exports                                                                                                                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`        | `APP_NAME` = `'NeoNHS'`, `API_ENDPOINTS` (AUTH), `ROUTES` (HOME/LOGIN/REGISTER/DASHBOARD/NOT_FOUND), `LOCAL_STORAGE_KEYS` (TOKEN/USER/THEME), `STATUS` (ACTIVE/INACTIVE/PENDING/DELETED) |
| `blog.ts`         | `BLOG_PAGE_SIZE` = 10, `BLOG_STATUS_OPTIONS`, `BLOG_SORT_OPTIONS`                                                                                                                        |
| `blogCategory.ts` | `BLOG_CATEGORY_PAGE_SIZE` = 10, `BLOG_CATEGORY_STATUS_OPTIONS`, `BLOG_CATEGORY_SORT_OPTIONS`                                                                                             |
| `tag.ts`          | `TAG_PAGE_SIZE` = 10, `TAG_SORT_OPTIONS`                                                                                                                                                 |

## 11) Utils & Helpers

| File                              | Exports                                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/lib/utils.ts`                | `cn(...inputs)` — `twMerge(clsx(...))` class name utility                                                                    |
| `src/utils/cloudinary.ts`         | `CLOUDINARY_CONFIG`, `uploadImageToCloudinary(file)`, `uploadVideoToCloudinary(file)`, `validateImageFile(file, maxSizeMB)`  |
| `src/utils/getApiErrorMessage.ts` | `getApiErrorMessage(error, fallback)` — extracts message from Error objects                                                  |
| `src/utils/helpers.ts`            | `formatDate`, `truncateText`, `debounce`, `formatCurrency` (VND), `isEmpty`, `getInitials`, `formatShortDate`, `exportToCsv` |

## 12) Feature Components (`src/components/`)

### `ui/` — shadcn/ui Radix Primitives (~26 files)

`alert-dialog`, `alert`, `badge`, `breadcrumb`, `button`, `card`, `command`, `dialog`, `dropdown-menu`, `field`, `form`, `input-otp`, `input`, `label`, `pagination`, `popover`, `progress`, `select`, `separator`, `skeleton`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`

### `common/` — Shared App Components

| Component                | Purpose                           |
| ------------------------ | --------------------------------- |
| `AdminPageContentLayout` | Standard admin page wrapper       |
| `Button`                 | Custom button extending ui/button |
| `MapPicker`              | Leaflet map picker                |
| `TablePagination`        | Reusable pagination controls      |
| `TooltipWrapper`         | Tooltip wrapper utility           |

### `adminLayout/`

| Component             | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| `NavlinkWithChildren` | Collapsible nav link with child items (used in Admin/Vendor sidebars) |

### `headfoot/`

| Component | Purpose           |
| --------- | ----------------- |
| `header`  | App header/navbar |
| `footer`  | App footer        |

### `dashboard/`

| Component       | Purpose                             |
| --------------- | ----------------------------------- |
| `DashboardCard` | Dashboard card container            |
| `EmptyState`    | Empty state placeholder             |
| `ModernSidebar` | Modern sidebar for dashboard layout |
| `StatsCard`     | Statistics display card             |

### `profile/`

| Component            | Purpose                    |
| -------------------- | -------------------------- |
| `ChangePasswordForm` | Password change form       |
| `ProfileAvatar`      | Avatar display/upload      |
| `RoleBasedSidebar`   | Sidebar based on user role |
| `UserEditForm`       | User profile edit form     |
| `UserInfoCard`       | User info display card     |
| `VendorEditForm`     | Vendor profile edit form   |

### `blog/` — Blog Feature

| Area                             | Components                                                                                                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root                             | `BlogEditor` (main Lexical wrapper), `BlogToolbar` (search/filter/sort), `BlogDeleteDialog`, `type.ts` (BlogEditorRef, EditorSaveResult, formSchema)                                                       |
| `creationForm/`                  | `BlogFormHeaderSection`, `BlogDetailsSection`, `BlogEditorSection`, `BlogPublishingSection`, `BlogCategorySection`, `BlogTagsSection`, `BlogMediaSection`                                                  |
| `editor/`                        | `ToolbarPlugin`, `SelectionFormatToolbarPlugin`, `ContextMenuToolbarPlugin`, `FloatingLinkEditor`, `ImagePlugin`, `CharacterCountPlugin`, `ClickableLinkPlugin`, `DomExportDebugPlugin`, `EditorRefPlugin` |
| `editor/ImageComponents/`        | `ImageComponent`, `ImageHelpers`, `ImageNode`                                                                                                                                                              |
| `editor/TableActionMenuPlugin/`  | Table action menu                                                                                                                                                                                          |
| `editor/TableCellResizerPlugin/` | Table cell resize                                                                                                                                                                                          |
| `editor/ToolbarElements/`        | `ToolbarBlockTypeDropdown`, `ToolbarButton`, `ToolbarDivider`, `ToolbarLinkInlineButton`, `ToolbarModal`                                                                                                   |
| `editor/styles/`                 | `BlogEditor.css`, `EditorTheme.ts`                                                                                                                                                                         |
| `Table/`                         | `BlogTable`, `BlogTableSkeleton`                                                                                                                                                                           |
| `visitor/`                       | `BlogContent` (public renderer), `BlogHeader`                                                                                                                                                              |

### `blog-categories/` — Blog Category Management

| Component                         | Purpose                                 |
| --------------------------------- | --------------------------------------- |
| `BlogCategoryForm`                | Create/edit form                        |
| `BlogCategoryModal`               | Unified modal (create/edit/view/delete) |
| `BlogCategoryToolbar`             | List toolbar                            |
| `BlogCategoryViewContent`         | Read-only category view                 |
| `BlogCategoryDeleteContent`       | Delete confirmation                     |
| `Table/BlogCategoryTable`         | Data table                              |
| `Table/BlogCategoryTableSkeleton` | Loading skeleton                        |

### `tags/` — Tag Management (Event & Workshop)

| Component                              | Purpose                               |
| -------------------------------------- | ------------------------------------- |
| `TagModal`                             | Tag create/edit/delete/restore modal  |
| `TagTable`                             | Tag data table                        |
| `TagToolbar`                           | Tag toolbar (sort, create)            |
| `tagModal/TagFormContent`              | Form (name, description, color, icon) |
| `tagModal/TagConfirmationContent`      | Delete/restore confirmation           |
| `tagModal/iconOptions`                 | Icon picker options                   |
| `tagModal/constants`, `types`, `utils` | Supporting logic                      |
| `tagTable/TagTableRowItem`             | Individual row                        |
| `tagTable/TagTableStates`              | Loading/error/empty states            |

## 13) Pages Detail

### Auth Pages (`src/pages/AuthPage/`)

`Login.tsx` (role-based redirect), `Register.tsx`, `Forgot.tsx`, `VerifyOTP.tsx`, `NewPassword.tsx`, plus `components/` with sub-form components (`login-form`, `register-form`, `forgot-form`, `check-otp-form`, `new-password-form`).

### Profile Pages (`src/pages/ProfilePage/`)

`index.tsx` (auto-redirect by role), `UserProfilePage.tsx` (tabs: profile/security/preferences/history), `UserAccountForm.tsx`, `VendorProfilePage.tsx` (loads vendor data).

### Admin Pages (`src/pages/admin/`)

| Domain           | Key Files                                                                                                                                                       | Notes                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Dashboard        | `dashboard/AdminDashboardPage.tsx`                                                                                                                              | Stats overview                                              |
| Destinations     | `destinations/AdminDestinationsPage.tsx`, `destinations/hooks/useAdminDestinations.ts`, `destinations/components/*` (7 components)                              | Attraction/point CRUD with map                              |
| Users            | `users/AdminUsersPage.tsx`                                                                                                                                      | User management (mock data)                                 |
| Vendors          | `vendors/AdminVendorsPage.tsx`, `vendors/components/*` (4 components)                                                                                           | Ban/unban, detail dialogs (mock data)                       |
| Vendor Templates | `vendorTemplate/AdminVendorTemplatesPage.tsx`, `vendorTemplate/components/*` (7+ components)                                                                    | Template review approve/reject (real API)                   |
| Events           | `events/index.tsx`, `events/create.tsx`, `events/detail.tsx`, `events/edit.tsx`, `events/components/*` (8 components), `events/constants.ts`, `events/utils.ts` | Full CRUD with image gallery, tag combobox, ticket catalogs |
| Tags             | `tags/EventTagPage.tsx`, `tags/WorkshopTagPage.tsx`                                                                                                             | Event & Workshop tag CRUD                                   |
| Blog Categories  | `blog-categories/BlogCategoryPage.tsx`                                                                                                                          | Category CRUD with modal                                    |
| Blog             | `blog/ManageBlogPage.tsx`, `blog/BlogCreationPage.tsx`, `blog/AdminBlogDetailPage.tsx`, `blog/BlogEditPage.tsx`                                                 | Full blog lifecycle with Lexical editor                     |
| Tickets          | `tickets/AdminTicketsPage.tsx`                                                                                                                                  | Placeholder                                                 |
| Vouchers         | `vouchers/AdminVouchersPage.tsx`                                                                                                                                | Placeholder                                                 |
| Reports          | `reports/AdminReportsPage.tsx`                                                                                                                                  | Placeholder                                                 |

### Vendor Pages (`src/pages/vendor/`)

| Domain              | Key Files                                                                                                                                                                                               | Notes                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Dashboard           | `dashboard/VendorDashboardPage.tsx`                                                                                                                                                                     | Stats cards, vendor profile loading         |
| Workshop Templates  | `WorkshopTemplates/WorkshopTemplatesPage.tsx`, `WorkshopTemplateCreatePage.tsx`, `WorkshopTemplateDetailPage.tsx`, `WorkshopTemplateEditPage.tsx`, `components/*` (7 components), `utils/formatters.ts` | Full CRUD with approval workflow (real API) |
| Workshop Sessions   | `WorkshopSessions/WorkshopSessionsPage.tsx`, `components/*` (9 components), `components/calendar/*` (4 views), `utils/formatters.ts`                                                                    | List/calendar toggle, session CRUD dialogs  |
| Workshop Calendar   | `WorkshopCalendar/CalendarPage.tsx`                                                                                                                                                                     | Placeholder "Coming Soon"                   |
| Ticket Verification | `Tickets/TicketVerificationPage.tsx`                                                                                                                                                                    | Manual code entry + QR scan UI              |
| Vouchers            | `Vouchers/VouchersPage.tsx`                                                                                                                                                                             | Table with mock data                        |

## 14) Barrel Exports

- `src/components/index.ts` — re-exports from `common`, `ui`, and specific blog/blog-category components.

## 15) Notable Conventions

- **Import alias:** `@/` → `src/`.
- **Feature-first structure:** pages in `src/pages/{domain}/`, components in `src/components/{domain}/`, co-located page-level components in `src/pages/{domain}/components/`.
- **Service-first API access:** all HTTP via `src/services/api/`.
- **Route boundaries:** enforced through layout composition + `AuthContext`.
- **UI primitives:** shadcn/ui pattern (Radix + Tailwind + CVA) in `src/components/ui/`.
- **Domain hooks:** in `src/hooks/{domain}/` for reusable data-fetching and state logic.
- **Local types/hooks/components:** feature-heavy pages (events, destinations, workshops) co-locate their own `types.ts`, `hooks/`, `components/`, `utils/` next to the page file.
