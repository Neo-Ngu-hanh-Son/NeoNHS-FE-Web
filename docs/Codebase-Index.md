# Codebase Index

## Stack & Runtime
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Ant Design + Radix UI primitives
- **Routing**: `react-router-dom` (browser router)
- **Editor**: Lexical-based rich text editor for blog content
- **HTTP**: Axios via centralized API client

## App Entry Points
- `src/main.tsx` - App bootstrap, global styles/fonts, Google OAuth provider.
- `src/app/App.tsx` - Mounts router provider.
- `src/routes/index.tsx` - Full route tree and layout composition.

## Layout & App Shell
- `src/layouts/RootLayout.tsx` - Wraps all routes with `AuthProvider`.
- `src/layouts/BlankLayout.tsx` - Auth/simple pages.
- `src/layouts/AppLayout.tsx` - Public shell with header/footer.
- `src/layouts/admin/AdminLayout.tsx` - Admin sidebar + topbar shell.
- `src/layouts/vendor/VendorLayout.tsx` - Vendor shell.

## Routing Domains
### Public / Auth
- `/` → `src/pages/HomePage.tsx`
- `/about-us` → `src/pages/AboutUs.tsx`
- `/login`, `/register`, `/forgot-password`, `/verify-otp`, `/new-password`
- `/simple-map` → `src/pages/SimpleMapView.tsx`

### Profile
- `/account` → role-based profile entry page
- `/account/user` → user profile

### Admin
- `/admin/dashboard`, `/admin/users`, `/admin/vendors`, `/admin/destinations`
- `/admin/tickets`, `/admin/vouchers`, `/admin/reports`, `/admin/events`
- `/admin/blog-categories`, `/admin/blog`

### Vendor
- `/vendor/dashboard`, `/vendor/profile`
- `/vendor/workshop-templates`, `/vendor/workshop-sessions`, `/vendor/workshop-calendar`
- `/vendor/ticket-verification`, `/vendor/vouchers`

## Core State & Context
- `src/contexts/AuthContext.tsx`
  - token bootstrap (`checkAuth`), login/logout, Google login, user state.
- `src/hooks/useAuth.ts`
  - Re-export/backward-compatible auth hook wrapper.
- `src/hooks/useBlogCategories.ts`
  - Encapsulates blog category list fetch/search/sort/pagination/modal state.

## API Layer
- `src/services/api/apiClient.ts`
  - Axios instance, auth header injection, response/error normalization.
- `src/services/api/authService.ts`
  - Login/register/google-login/logout/profile/OTP/reset APIs.
- `src/services/api/blogCategoryService.ts`
  - Admin blog category CRUD + paginated query params.
- Additional domain services:
  - `attractionService.ts`, `pointService.ts`, `userService.ts`, `vendorService.ts`

## Blog Editor Module (Lexical)
- `src/components/blog/BlogEditor.tsx`
  - Lexical composer, node registration, rich text plugins, image plugin.
- `src/components/blog/editor/ImageNode.tsx`
  - Custom `DecoratorNode` for image rendering + JSON/DOM import/export.
- `src/components/blog/editor/ImagePlugin.tsx`
  - Image insertion/upload plugin.
- `src/components/blog/editor/ToolbarPlugin.tsx`
  - Editor formatting toolbar.
- `src/components/blog/editor/FloatingLinkEditor.tsx`
  - Inline link editing UI.
- `src/components/blog/editor/EditorTheme.ts`
  - Lexical theme mapping.
- `src/components/blog/editor/BlogEditor.css`
  - Editor-specific styles.

## Shared UI & Components
- `src/components/ui/*`
  - Reusable primitive UI components (button, dialog, select, table, etc.).
- `src/components/common/*`
  - App-level common components (layout blocks, wrappers, helpers).
- `src/components/blog-categories/*`
  - Feature UI for blog category management.
- `src/components/index.ts`
  - Barrel exports for shared components.

## Constants / Types / Utilities
- `src/constants/*` - Feature constants and options.
- `src/types/*` - API/domain typings.
- `src/utils/*` - General helpers and API error helpers.
- `src/lib/utils.ts` - Utility helpers for UI/className composition.

## Conventions Observed
- Alias `@/` resolves to `src/`.
- Feature-centric pages under `src/pages/{domain}`.
- API logic centralized in `src/services/api`.
- Route-protected app structure achieved via layout nesting + auth context.

## Notes
- `src/routes/index.tsx` currently defines `/admin` in two route groups (one short block and one full block). This may be intentional but is worth keeping in mind when changing admin routing behavior.
