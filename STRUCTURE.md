# 📖 Hướng Dẫn Cấu Trúc Dự Án

## Mục Đích Của Từng Thư Mục

### 📁 `src/components/`
Chứa các React components có thể tái sử dụng trong toàn dự án.

**Quy tắc:**
- Mỗi component nên có file riêng
- Sử dụng barrel exports (index.ts) để export components
- Components phức tạp nên có folder riêng với file test và styles

**Ví dụ:**
```
components/
├── common/              # Components dùng chung
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── forms/               # Form components
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
└── index.ts             # Barrel export
```

---

### 📁 `src/pages/`
Chứa các page components, mỗi page tương ứng với một route.

**Quy tắc:**
- Mỗi page nên có folder riêng nếu có nhiều file liên quan
- Page components nên lean, logic nên đặt ở services/hooks
- Đặt tên file theo PascalCase

**Ví dụ:**
```
pages/
├── HomePage.tsx
├── DashboardPage.tsx
├── AuthPage/
│   ├── Login.tsx
│   ├── Register.tsx
│   └── ForgotPassword.tsx
└── ProfilePage/
    ├── index.tsx
    ├── ProfileInfo.tsx
    └── ProfileSettings.tsx
```

---

### 📁 `src/routes/`
Định nghĩa routing của ứng dụng.

**Quy tắc:**
- Sử dụng React Router
- Chia routes thành các file nhỏ nếu có nhiều routes
- Protected routes nên có middleware/guard

**Ví dụ:**
```typescript
// routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { HomePage } from '@/pages/HomePage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      // ... more routes
    ],
  },
]);
```

---

### 📁 `src/services/`
Chứa business logic và API calls.

**Quy tắc:**
- Mỗi service nên handle một domain cụ thể (auth, user, product, etc.)
- Sử dụng apiClient để gọi API
- Return typed responses

**Ví dụ:**
```typescript
// services/api/userService.ts
import apiClient from './apiClient';
import type { User } from '@/types';

export const userService = {
  getProfile: async (): Promise<User> => {
    return await apiClient.get('/user/profile');
  },
  
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return await apiClient.put('/user/profile', data);
  },
};
```

---

### 📁 `src/hooks/`
Chứa custom React hooks.

**Quy tắc:**
- Hook name phải bắt đầu với "use"
- Mỗi hook nên có một responsibility rõ ràng
- Document parameters và return values

**Ví dụ:**
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // ... logic
  
  return { user, loading, login, logout };
};
```

---

### 📁 `src/types/`
Chứa TypeScript type definitions và interfaces.

**Quy tắc:**
- Export types/interfaces từ index.ts
- Đặt tên interface với prefix "I" (optional)
- Sử dụng type cho unions, interface cho objects

**Ví dụ:**
```typescript
// types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

---

### 📁 `src/constants/`
Chứa các constants và enums.

**Quy tắc:**
- Sử dụng UPPER_CASE cho constants
- Group constants theo domain
- Avoid magic strings/numbers

**Ví dụ:**
```typescript
// constants/index.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
  },
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
};
```

---

### 📁 `src/utils/`
Chứa utility functions và helpers.

**Quy tắc:**
- Functions phải pure (no side effects)
- Mỗi function nên có JSDoc comment
- Unit test cho các utility functions

**Ví dụ:**
```typescript
// utils/helpers.ts
/**
 * Format date to DD/MM/YYYY
 * @param date - Date object or string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  // ... implementation
};
```

---

### 📁 `src/layouts/`
Chứa layout components (header, footer, sidebar).

**Quy tắc:**
- Layout components nên wrap content với Outlet (React Router)
- Separate concerns: header, footer, sidebar nên là components riêng

**Ví dụ:**
```typescript
// layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export const AppLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
```

---

### 📁 `src/config/`
Chứa các configuration files và providers.

**Quy tắc:**
- Environment variables
- Third-party library configurations
- Context providers

---

## Import Aliases

Dự án sử dụng `@/` alias để import:

```typescript
// ❌ Tránh relative imports
import { Button } from '../../components/common/Button';

// ✅ Sử dụng alias
import { Button } from '@/components/common';
```

## Naming Conventions

- **Components:** PascalCase - `UserProfile.tsx`
- **Hooks:** camelCase with 'use' prefix - `useAuth.ts`
- **Utils:** camelCase - `formatDate.ts`
- **Constants:** UPPER_CASE - `API_ENDPOINTS`
- **Types:** PascalCase - `User`, `ApiResponse`
- **Files:** Match the default export name

## Best Practices

1. **Keep components small and focused**
2. **Use TypeScript strictly** - avoid `any`
3. **Write reusable code** - DRY principle
4. **Comment complex logic**
5. **Use barrel exports** for cleaner imports
6. **Separate concerns** - UI, logic, data
7. **Write tests** for critical functions
8. **Follow consistent code style**

## Code Organization Example

```typescript
// ✅ Good organization
// pages/UserPage/index.tsx
import { useEffect } from 'react';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { userService } from '@/services/api/userService';

export const UserPage = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Fetch user data
    userService.getProfile();
  }, []);
  
  return <UserProfile user={user} />;
};
```

---

**Happy Coding! 🚀**
