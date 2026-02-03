# Setup Client Development Environment

Create a production-ready React/Next.js client following our established standards.

## Framework Selection

Before starting, ask the user:
- **React SPA** (Vite + React Router) - For traditional single-page applications
- **Next.js** (App Router) - For server-side rendering and full-stack capabilities

## Project Requirements

### Technology Stack
- **Framework**: React 18+ (with Vite) OR Next.js 14+ (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x + shadcn/ui
- **State Management**: Redux Toolkit (global) + React Query (server state)
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

---

## React SPA Setup (Vite)

### Directory Structure

```
client/
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── App.tsx            # Root component
│   │   ├── router.tsx         # React Router config with lazy loading
│   │   └── providers.tsx      # Provider wrapper (Redux, React Query, etc.)
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── common/            # Shared components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LoadingPage.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MainLayout.tsx
│   ├── features/
│   │   └── auth/              # Example feature module
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── store/
│   │       ├── types/
│   │       ├── schemas/
│   │       └── index.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useClickOutside.ts
│   │   ├── useDocumentTitle.ts
│   │   └── useCopyToClipboard.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axios.config.ts    # Axios instance with interceptors
│   │   │   ├── query-client.ts    # React Query client
│   │   │   └── api.types.ts       # API response types
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   └── api-endpoints.ts
│   │   ├── utils/
│   │   │   ├── cn.ts              # clsx + tailwind-merge
│   │   │   ├── format.utils.ts
│   │   │   ├── error.utils.ts
│   │   │   └── validation.utils.ts
│   │   └── env.ts                 # Type-safe env variables
│   ├── store/
│   │   ├── index.ts               # Redux store configuration
│   │   └── hooks.ts               # Typed useDispatch, useSelector
│   ├── types/
│   │   └── global.d.ts
│   ├── styles/
│   │   └── globals.css            # Tailwind + CSS variables
│   ├── main.tsx                   # Entry point
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── components.json                # shadcn/ui config
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Next.js Setup (App Router)

### Directory Structure

```
client/
├── app/
│   ├── (auth)/                    # Route group for auth pages
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (main)/                    # Route group for main layout
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home page
│   │   └── dashboard/
│   │       └── page.tsx
│   ├── api/                       # API routes (if needed)
│   ├── layout.tsx                 # Root layout
│   ├── loading.tsx                # Root loading
│   ├── error.tsx                  # Root error
│   ├── not-found.tsx              # 404 page
│   └── globals.css
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui
│   │   ├── common/
│   │   └── layout/
│   ├── features/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   └── types/
├── public/
├── .env.example
├── .gitignore
├── components.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Configuration Files (Both)

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### tailwind.config.js (with CSS Variables)
```javascript
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## Core Implementation Requirements

### 1. API Client (lib/api/axios.config.ts)
- Axios instance with baseURL from env
- Request interceptor for auth token
- Response interceptor for token refresh
- Handle 401 with refresh token queue

### 2. React Query Setup (lib/api/query-client.ts)
- Default staleTime: 5 minutes
- Default gcTime: 10 minutes
- refetchOnWindowFocus: false
- retry: 1

### 3. API Types (lib/api/api.types.ts)
```typescript
interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  success: true;
  message: string;
  data: {
    items: T[];
    pagination: PaginationMeta;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
```

### 4. Error Utilities (lib/utils/error.utils.ts)
- `getErrorMessage(error: unknown): string`
- `getErrorCode(error: unknown): string | undefined`
- `isNetworkError(error: unknown): boolean`
- `getFieldErrors(error: unknown): Record<string, string> | null`

### 5. Redux Store Setup (store/index.ts)
- Auth slice with user, tokens, isAuthenticated
- Typed hooks (useAppDispatch, useAppSelector)
- Persist auth state to localStorage

### 6. Provider Setup (app/providers.tsx)
- Redux Provider
- QueryClientProvider
- Toaster (sonner)
- Error Boundary
- Suspense fallback

### 7. Protected Route (components/common/ProtectedRoute.tsx)
- Check authentication
- Check email verification
- Check role permissions
- Redirect to login with return URL

### 8. CSS Variables (styles/globals.css)
- Light theme colors
- Dark theme colors
- All semantic colors (primary, secondary, destructive, etc.)
- NEVER use hardcoded colors (no bg-blue-500)

### 9. Common Hooks
- useDebounce
- useLocalStorage
- useMediaQuery
- useClickOutside
- useDocumentTitle
- useCopyToClipboard

### 10. Common Components
- LoadingSpinner
- LoadingPage
- ErrorBoundary
- ErrorMessage
- EmptyState
- Pagination
- ConfirmDialog

---

## Dependencies to Install

### React SPA (Vite)
```bash
# Core
npm install react react-dom react-router-dom

# State & Data
npm install @reduxjs/toolkit react-redux @tanstack/react-query axios

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# UI
npm install tailwindcss postcss autoprefixer tailwindcss-animate
npm install clsx tailwind-merge lucide-react sonner

# Dev
npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react
```

### Next.js
```bash
npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir

# Additional
npm install @reduxjs/toolkit react-redux @tanstack/react-query axios
npm install react-hook-form @hookform/resolvers zod
npm install clsx tailwind-merge lucide-react sonner tailwindcss-animate
```

### shadcn/ui Setup
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label alert dialog
```

---

## After Setup

1. Create `.env` file from `.env.example`
2. Run `npm install`
3. Initialize shadcn/ui components
4. Run `npm run dev`
5. Verify the app loads at `http://localhost:5173` (Vite) or `http://localhost:3000` (Next.js)

---

## Standards to Follow

### Component Rules
- Named exports (not default, except pages)
- Max 250 lines per component
- Max 5 props (group if more needed)
- Max 3 levels JSX nesting
- useCallback for handlers passed to children
- useMemo for expensive computations

### File Naming
- Components: PascalCase (TourCard.tsx)
- Hooks: camelCase with use prefix (useTours.ts)
- Services: camelCase + .service (tour.service.ts)
- Types: camelCase + .types (tour.types.ts)
- Schemas: camelCase + .schemas (tour.schemas.ts)

### Import Order
1. React/Framework imports
2. Third-party libraries (alphabetical)
3. UI components (shadcn/ui)
4. Common components
5. Feature components (relative)
6. Hooks
7. Services
8. Types (with `type` keyword)
9. Utils & Constants

### Color Rules
- ALWAYS use semantic colors (bg-primary, text-foreground)
- NEVER use Tailwind palette (bg-blue-500)
- NEVER hardcode hex values
- All colors defined in CSS variables

### TypeScript Rules
- No `any` type
- Explicit return types on public functions
- Use `interface` for props and entities
- Use `type` for unions and utilities
- Type guards for runtime checks
