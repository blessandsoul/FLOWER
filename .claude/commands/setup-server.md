# Setup Server Development Environment

Create a production-ready Fastify server following our established standards.

## Project Requirements

Set up a new server project with the following specifications:

### Technology Stack
- **Runtime**: Node.js 20+ LTS
- **Framework**: Fastify 4.x
- **Language**: TypeScript 5.x (strict mode)
- **Database**: MySQL 8.0+ with Prisma 6.x ORM
- **Cache**: Redis 7.x
- **Validation**: Zod 3.x
- **Testing**: Vitest 1.x
- **Process Manager**: PM2 5.x

### Directory Structure

Create this exact folder structure:

```
server/
├── src/
│   ├── app.ts                 # Fastify instance & plugin registration
│   ├── server.ts              # Server bootstrap (listen only)
│   ├── config/
│   │   ├── env.ts             # Environment variable loader with Zod validation
│   │   ├── constants.ts       # App constants
│   │   └── index.ts           # Config exports
│   ├── libs/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── redis.ts           # Redis client singleton
│   │   ├── logger.ts          # Pino logger instance
│   │   └── auth.ts            # Auth utilities (JWT verify, etc.)
│   ├── shared/
│   │   ├── errors/
│   │   │   ├── app-error.ts   # Base AppError class
│   │   │   └── errors.ts      # Typed error classes (BadRequestError, NotFoundError, etc.)
│   │   ├── helpers/
│   │   │   ├── response.ts    # successResponse, paginatedResponse helpers
│   │   │   └── pagination.ts  # Pagination utilities
│   │   └── schemas/
│   │       └── common.ts      # Shared Zod schemas (PaginationSchema, etc.)
│   ├── modules/
│   │   └── health/
│   │       ├── health.routes.ts
│   │       └── health.controller.ts
│   └── plugins/
│       ├── auth.ts            # Auth plugin (preHandler hook)
│       ├── rate-limit.ts      # Rate limiting plugin
│       └── cors.ts            # CORS configuration
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── logs/                      # PM2 logs directory
├── .env.example               # Environment template
├── .gitignore
├── ecosystem.config.js        # PM2 configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### Configuration Files

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### package.json scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "dev:debug": "tsx watch --inspect src/server.ts",
    "build": "tsc",
    "build:clean": "rm -rf dist && tsc",
    "start": "node dist/server.js",
    "start:pm2": "pm2 start ecosystem.config.js --env production",
    "stop:pm2": "pm2 stop tourism-api",
    "restart:pm2": "pm2 restart tourism-api",
    "reload:pm2": "pm2 reload tourism-api",
    "logs:pm2": "pm2 logs tourism-api",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:migrate:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts",
    "prisma:reset": "prisma migrate reset --force && tsx prisma/seed.ts",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### Core Implementation Requirements

#### 1. Response Helpers (src/shared/helpers/response.ts)
- `successResponse<T>(message: string, data: T)` - Returns `{ success: true, message, data }`
- `paginatedResponse<T>(message, items, page, limit, totalItems)` - Returns paginated structure

#### 2. Error Classes (src/shared/errors/)
- `AppError` base class with `code`, `message`, `statusCode`
- `BadRequestError` (400)
- `ValidationError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `InternalError` (500)

#### 3. Global Error Handler (src/app.ts)
- Handle `AppError` instances
- Handle Zod validation errors
- Handle Fastify validation errors
- Log unexpected errors
- Never expose stack traces

#### 4. Prisma Setup
- Singleton pattern in libs/prisma.ts
- Basic schema with User model
- Soft delete support (deletedAt)
- Timestamps (createdAt, updatedAt)

#### 5. Environment Validation (src/config/env.ts)
- Use Zod to validate all env variables
- Required: DATABASE_URL, PORT, NODE_ENV
- Optional: REDIS_URL, JWT_SECRET

#### 6. PM2 Configuration (ecosystem.config.js)
- Cluster mode for production
- Graceful shutdown handling
- Log file configuration
- Memory restart limit

#### 7. Health Check Endpoint
- GET /health - Basic health check
- GET /health/ready - Database and Redis connectivity check

### Dependencies to Install

```bash
# Core
npm install fastify @fastify/cors @fastify/rate-limit @fastify/jwt

# Database
npm install @prisma/client
npm install -D prisma

# Validation
npm install zod

# Utilities
npm install pino pino-pretty ioredis dotenv

# Dev Dependencies
npm install -D typescript tsx @types/node vitest eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### After Setup

1. Create `.env` file from `.env.example`
2. Run `npm run prisma:generate`
3. Run `npm run prisma:migrate` to create initial migration
4. Run `npm run dev` to start development server
5. Verify health endpoint at `http://localhost:3000/health`

### Standards to Follow

- All responses use response helpers
- All errors extend AppError
- Controllers call services only (no business logic)
- Services throw typed errors
- Repositories handle database queries only
- Use Zod for all input validation
- TypeScript strict mode enforced
