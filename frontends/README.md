# VideoTube — Frontend

React + TypeScript client for **VideoTube**. It provides registration (with avatar and cover image upload), login, a protected dashboard, and automatic access-token refresh against the [VideoTube backend](../backends/Readme.md).

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** for dev server and builds
- **React Router 8** with lazy-loaded pages
- **Axios**, with interceptors for auth headers and token refresh
- **CSS Modules** for component styles
- **ESLint** (`typescript-eslint`, React Hooks, React Refresh)

## Project structure

```
frontends/
├── public/                     # Static assets (favicon, icons)
└── src/
    ├── main.tsx                # App entry
    ├── App.tsx                 # Providers and router
    ├── api/
    │   ├── axios.instance.ts   # Axios client: auth header and 401 → refresh → retry
    │   ├── api.endpoints.ts    # Endpoint paths
    │   ├── api.helper.ts       # HttpError and error message normalisation
    │   └── services/
    │       ├── auth.service.ts # login / register / logout calls
    │       └── auth.helper.ts  # Builds multipart FormData for registration
    ├── components/
    │   ├── AuthCard/  Navbar/
    │   └── ui/                 # Alert, Button, FileField, InputField,
    │                           # PageLoader, PasswordField, Spinner
    ├── config/env.config.ts    # Reads VITE_* env vars and timeouts
    ├── constants/              # Routes, HTTP status/messages, storage keys, app name
    ├── context/                # AuthContext and AuthProvider
    ├── hooks/useAuth.ts        # Access the auth context
    ├── layouts/                # AuthLayout (login/register), MainLayout (app)
    ├── pages/                  # Login, Register, Dashboard, NotFound
    ├── routes/                 # Router, ProtectedRoute, PublicRoute, lazy pages
    ├── styles/                 # Global and shared form styles
    ├── types/                  # API, auth and user types
    └── utils/                  # Storage, validation and formatting helpers
```

## Getting started

### Prerequisites

- Node.js 20+
- The [backend](../backends) running locally (default `http://localhost:8000`)

### Installation

```bash
cd frontends
npm install
```

### Environment variables

Create a `.env` file in `frontends/`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API, including `/api/v1` |

> The backend's `CORS_ORIGIN` must match the URL this app runs on (`http://localhost:5173` by default).

### Run

```bash
npm run dev
```

Open `http://localhost:5173`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check with `tsc -b`, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Routes

| Path | Page | Access |
| --- | --- | --- |
| `/login` | Login | Public only (logged-in users are redirected) |
| `/register` | Register | Public only |
| `/` | Dashboard | Protected (requires login) |
| `*` | Not Found | Anyone |

`PublicRoute` and `ProtectedRoute` guard these based on the auth state from `AuthProvider`. Pages are code-split with `React.lazy`.

## Authentication

- **Login** stores the user, access token and refresh token in `localStorage` (`vt_user`, `vt_access_token`, `vt_refresh_token`).
- **Requests.** An Axios request interceptor adds `Authorization: Bearer <accessToken>`. Requests also send cookies (`withCredentials: true`).
- **Token refresh.** On a `401`, the response interceptor calls `/users/refresh-token` once, shares that request across concurrent failures, saves the new tokens and retries the original request. Login, register and refresh requests are excluded.
- **Session expiry.** If the refresh fails, storage is cleared and an `auth:session-expired` event logs the user out.
- **Multi-tab sync.** `AuthProvider` listens to `storage` events, so logging in or out in one tab updates the others.
- **Registration** sends `multipart/form-data` with `avatar` (required) and `coverImage` (optional). It uses a longer 60s timeout because the backend uploads the images to Cloudinary.

## Error handling

All API errors are normalised into an `HttpError` (`status`, `message`, `errors`). The server's JSON `message` is shown when there is one. Otherwise a friendly message is picked by status code (see `constants/http.constant.ts`). Status `0` means the request never reached the server (offline, CORS or timeout).

## Author

Siddharth
