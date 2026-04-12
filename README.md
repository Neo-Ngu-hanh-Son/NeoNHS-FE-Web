# NeoNHS Frontend Web

Frontend web application for the NeoNHS tourism platform.

Built with React, TypeScript, Vite, Ant Design, Tailwind CSS, and a modular feature-based structure.

## Overview

This project provides the user-facing and admin-facing web interfaces for the NeoNHS system, including:

- Public pages (landing, blog, contact, map, panorama)
- Authentication and profile management
- Admin dashboards and content management
- Vendor-related management screens
- Rich UI features such as editors, maps, charts, and media tooling

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- React Router 7
- Ant Design 6
- Tailwind CSS 3
- Axios
- React Hook Form + Zod
- Lexical editor

## System Requirements

### Minimum

- Operating system: Windows 10+, macOS 12+, or Linux (modern distro)
- Node.js: 20.19+ (or 22.12+)
- npm: 10+
- Git: 2.30+
- RAM: 8 GB
- Free disk space: 2 GB

### Recommended

- Node.js LTS (22.x)
- RAM: 16 GB for smooth local development
- Latest Chrome or Edge for testing

## Prerequisites

Before running this app, ensure:

- Backend API is available and reachable from this frontend
- You have a valid Google OAuth Client ID if login uses Google
- You have required API keys for optional features (Maps / ElevenLabs)

## Installation

1. Clone the repository:

```bash
git clone <your-repository-url>
cd NeoNHS-FE-Web
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

4. Update `.env` with your local values (see Environment Variables below).

5. Start development server:

```bash
npm run dev
```

6. Open the app in your browser:

http://localhost:5173

## Environment Variables

The project currently uses these runtime variables:

| Variable                 | Required                             | Description                                                   |
| ------------------------ | ------------------------------------ | ------------------------------------------------------------- |
| VITE_API_BASE_URL        | Yes                                  | Base URL for backend API (example: http://localhost:8080/api) |
| VITE_GOOGLE_CLIENT_ID    | Yes (if Google auth enabled)         | Google OAuth client ID                                        |
| VITE_ELEVENLABS_API_KEY  | Optional                             | ElevenLabs API key for audio-related features                 |
| VITE_GOOGLE_MAPS_API_KEY | Optional (required for map features) | Google Maps JavaScript API key                                |

## Available Scripts

- `npm run dev`: Start Vite dev server
- `npm run host`: Start dev server exposed to local network
- `npm run build`: Type-check and build production bundle
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint
- `npm run types`: Run TypeScript type check only

## Project Structure

High-level layout:

```text
.
|- public/
|- docs/
|- src/
|  |- app/
|  |- assets/
|  |- components/
|  |- constants/
|  |- contexts/
|  |- hooks/
|  |- layouts/
|  |- pages/
|  |- routes/
|  |- services/
|  |- styles/
|  |- types/
|  |- utils/
|  |- main.tsx
|- .env.example
|- package.json
|- vite.config.ts
|- tsconfig.json
```

## Build for Production

```bash
npm run build
```

Build output is generated in `dist/`.

To preview production build locally:

```bash
npm run preview
```

## Common Troubleshooting

- Port 5173 already in use:
  - Stop the process using that port, or run with a custom Vite port.
- API requests failing in local development:
  - Verify `VITE_API_BASE_URL` in `.env`.
  - Ensure backend server is running and CORS is configured correctly.
- Google login or map features not working:
  - Verify `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_MAPS_API_KEY`.
  - Confirm allowed origins in Google Cloud Console.
- Type errors during build:
  - Run `npm run types` and fix reported issues before `npm run build`.

## Documentation

Additional project docs are located in `docs/`.

## License

Capstone Project - KI9 2026 Spring.
