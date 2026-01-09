# 🏥 NeoNHS - Frontend Web Application

> Modern system built with React, Vite, Ant Design, and Tailwind CSS

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant%20Design-6.1.4-0170FE?style=flat&logo=ant-design&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat&logo=typescript&logoColor=white)

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cài Đặt](#-cài-đặt)
- [Sử Dụng](#-sử-dụng)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Cấu Hình](#-cấu-hình)
- [Đóng Góp](#-đóng-góp)

---

## 🎯 Giới Thiệu

**NeoNHS** là một cổng thông tin du lịch dành cho khu du lịch sinh thái Ngũ Hành Sơn tại Đà Nẵng - Việt Nam. Dự án này là phần frontend của hệ thống NeoNHS, cung cấp giao diện người dùng thân thiện và hiệu suất cao.

## ✨ Tính Năng

- ⚡ **Fast Development** - Vite HMR cho trải nghiệm phát triển nhanh chóng
- 🎨 **Modern UI** - Ant Design components với Tailwind CSS
- 🔐 **Authentication** - Hệ thống đăng nhập/đăng ký bảo mật
- 📱 **Responsive Design** - Tối ưu cho mọi thiết bị
- 🛣️ **Routing** - React Router v7 cho navigation mượt mà
- 🔧 **TypeScript** - Type safety và developer experience tốt hơn

## 🛠️ Công Nghệ Sử Dụng

### Core
- **React 19.1.1** - UI library
- **TypeScript 5.9.3** - Type-safe JavaScript
- **Vite 7.2.4** - Build tool & dev server

### UI Framework
- **Ant Design 6.1.4** - Enterprise UI components
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Ant Design Icons** - Icon library

### Routing
- **React Router DOM 7.11.0** - Client-side routing

### Fonts
- **Roboto** - Google Fonts via @fontsource

---

## 📦 Cài Đặt

### Yêu Cầu Hệ Thống

- Node.js >= 18.x
- npm >= 9.x hoặc yarn >= 1.22.x

### Các Bước Cài Đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd NeoNHS_FE_Web
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   ```

4. Mở trình duyệt tại: `http://localhost:5173`

---

## 🚀 Sử Dụng

### Development Mode

```bash
npm run dev
```

Chạy ứng dụng ở chế độ development với hot-reload.

### Production Build

```bash
npm run build
```

Build ứng dụng cho production. Output sẽ được tạo trong thư mục `dist/`.

### Preview Production Build

```bash
npm run preview
```

Preview bản build production trước khi deploy.

---

## 📁 Cấu Trúc Thư Mục

```
NeoNHS_FE_Web/
├── public/                        # Static assets
│   └── img-src/                  # Images
│       └── auth/                 # Authentication images
│
├── src/                           # Source code
│   ├── app/                      # Application core
│   │   └── App.tsx               # Root component
│   │
│   ├── assets/                   # Static assets (images, fonts, etc.)
│   │   └── images/               # Image files
│   │
│   ├── components/               # Reusable components
│   │   ├── common/               # Common/shared components
│   │   │   ├── Button.tsx        # Button component
│   │   │   └── index.ts          # Barrel export
│   │   └── index.ts              # Barrel export
│   │
│   ├── config/                   # Configuration files
│   │   └── providers/            # Context providers
│   │       └── AntdProvider.tsx  # Ant Design config
│   │
│   ├── constants/                # Application constants
│   │   └── index.ts              # Global constants (routes, API endpoints, etc.)
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuth.ts            # Authentication hook
│   │
│   ├── layouts/                  # Layout components
│   │   ├── AppLayout.tsx         # Main app layout
│   │   └── BlankLayout.tsx       # Blank layout (auth, etc.)
│   │
│   ├── pages/                    # Page components
│   │   ├── HomePage.tsx          # Home page
│   │   ├── NotFoundPage.tsx      # 404 page
│   │   └── AuthPage/             # Authentication pages
│   │       ├── Login.tsx         # Login page
│   │       └── Login.css         # Login styles
│   │
│   ├── routes/                   # Route definitions
│   │   └── index.tsx             # Main router configuration
│   │
│   ├── services/                 # Business logic & API calls
│   │   └── api/                  # API services
│   │       ├── apiClient.ts      # API client configuration
│   │       └── authService.ts    # Authentication API
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # Global types & interfaces
│   │
│   ├── utils/                    # Utility functions
│   │   └── helpers.ts            # Helper functions
│   │
│   ├── styles/                   # Global styles
│   │   └── globals.css           # Tailwind + custom styles
│   │
│   └── main.tsx                  # Application entry point
│
├── index.html                    # HTML template
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
└── README.md                     # This file
```

### 📂 Giải Thích Cấu Trúc

- **`assets/`** - Chứa các tài nguyên tĩnh như images, fonts, icons
- **`components/`** - Các React components có thể tái sử dụng
  - **`common/`** - Components dùng chung trong toàn dự án
- **`config/`** - Cấu hình ứng dụng và providers
- **`constants/`** - Các hằng số, enums, API endpoints
- **`hooks/`** - Custom React hooks
- **`layouts/`** - Layout components (header, footer, sidebar)
- **`pages/`** - Page components (tương ứng với routes)
- **`routes/`** - Định nghĩa routes và navigation
- **`services/`** - Business logic, API calls, data fetching
- **`types/`** - TypeScript types và interfaces
- **`utils/`** - Các hàm tiện ích (formatters, validators, helpers)

---

## ⚙️ Cấu Hình

### Import Aliases

Dự án sử dụng alias `@/` để import từ thư mục `src/`:

```typescript
// Thay vì
import { Component } from '../../components/Component'

// Sử dụng
import { Component } from '@/components/Component'
```

### Ant Design Theme

Cấu hình theme tại [src/config/providers/AntdProvider.tsx](src/config/providers/AntdProvider.tsx)

### Tailwind CSS

Cấu hình Tailwind tại [tailwind.config.js](tailwind.config.js)

### CSS Reset

- Ant Design reset được import tại [src/main.tsx](src/main.tsx): `antd/dist/reset.css`
- Tailwind directives được import tại [src/styles/globals.css](src/styles/globals.css)

### Import Best Practices

```typescript
// ✅ Sử dụng barrel exports
import { Button } from '@/components/common';

// ✅ Sử dụng alias @/ 
import { authService } from '@/services/api/authService';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants';

// ✅ Import types
import type { User, ApiResponse } from '@/types';
```

---

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📄 License

Dự án này thuộc về Capstone Project - KI9 2026 SPRING

---

## 👥 Team

Capstone Project Team - KI9 2026 SPRING

---

<div align="center">
  <p>Made with ❤️ by NeoNHS Team</p>
  <p>© 2026 NeoNHS. All rights reserved.</p>
</div>
