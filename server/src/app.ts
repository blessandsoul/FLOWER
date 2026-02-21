import Fastify, { FastifyError, FastifyRequest, FastifyReply } from "fastify";
import fastifyStatic from "@fastify/static";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fastifyCors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import fastifyCsrf from "@fastify/csrf-protection";
import path from "path";
import { fileURLToPath } from "url";
import { logger } from "./libs/logger.js";
import { AppError, RateLimitError } from "./libs/errors.js";
import { errorResponse } from "./libs/response.js";
import { env } from "./config/env.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { userRoutes } from "./modules/users/user.routes.js";
import { productRoutes } from "./modules/products/products.routes.js";
import { walletRoutes } from "./modules/wallet/wallet.routes.js";
import { paymentRoutes } from "./modules/payment/payment.routes.js";
import { orderRoutes } from "./modules/orders/order.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildApp() {
  const app = Fastify({
    loggerInstance: logger,
  });

  // CORS support
  // In production: use CORS_ORIGINS env var (comma-separated list)
  // In development: allow common dev ports
  // Cookie secure flag: explicit env var overrides, otherwise based on NODE_ENV
  const cookieSecure = env.COOKIE_SECURE ?? (env.NODE_ENV === "production");

  const allowedOrigins = env.NODE_ENV === "production" && env.CORS_ORIGINS
    ? env.CORS_ORIGINS
    : [
        "http://localhost:3000",  // Next.js default
        "http://localhost:3001",  // Alternative port
        "http://localhost:5173",  // Vite default
        "http://localhost:8000",  // Server port (for same-origin testing)
      ];

  app.register(fastifyCors, {
    origin: (origin, callback) => {
      // Handle requests with no origin header
      if (!origin) {
        // Allow requests without origin header in all environments
        // This includes: direct browser navigation, curl, Postman, health checks
        // Safe because we protect state-changing operations with CSRF tokens
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // In development, log rejected origins for debugging
      if (env.NODE_ENV !== "production") {
        logger.warn({ origin }, "CORS: Origin not allowed");
      }

      return callback(new Error("CORS: Origin not allowed"), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-CSRF-Token'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  // Cookie support (required for CSRF protection)
  app.register(fastifyCookie, {
    secret: env.ACCESS_TOKEN_SECRET, // Use access token secret for cookie signing
    parseOptions: {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: "lax",
    },
  });

  // CSRF protection for state-changing requests
  // Client must send X-CSRF-Token header with value from /api/v1/auth/csrf-token endpoint
  app.register(fastifyCsrf, {
    sessionPlugin: "@fastify/cookie",
    cookieOpts: {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: "lax",
      path: "/",
    },
    getToken: (request: FastifyRequest) => {
      // Accept CSRF token from X-CSRF-Token header
      return request.headers["x-csrf-token"] as string;
    },
  });

  // Security headers with Helmet
  app.register(helmet, {
    // Minimal CSP for API server
    // Even though APIs primarily return JSON, CSP provides defense-in-depth
    // against XSS if any endpoint accidentally returns HTML
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],          // Block everything by default
        frameAncestors: ["'none'"],      // Prevent clickjacking (X-Frame-Options replacement)
        baseUri: ["'none'"],             // Prevent base tag injection
        formAction: ["'none'"],          // Prevent form submissions (API doesn't serve forms)
      },
    },
    crossOriginEmbedderPolicy: false, // API doesn't need this
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource loading
  });

  // Rate limiting plugin (configure per-route limits in route files)
  app.register(rateLimit, {
    global: false, // We apply limits per-route
    max: 100, // Default fallback
    timeWindow: "1 minute",
    onExceeded: function (_request, _key) {
      throw new RateLimitError(
        "Too many requests. Please try again later."
      );
    },
  });

  // Global error handler
  app.setErrorHandler((error: FastifyError | AppError, request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      logger.warn({ err: error, requestId: request.id }, error.message);
      return reply.status(error.statusCode).send(errorResponse(error.code, error.message));
    }

    // Handle Fastify built-in errors with user-friendly messages
    if ('code' in error && typeof error.code === 'string') {
      const fastifyErrorMap: Record<string, { statusCode: number; message: string }> = {
        FST_ERR_VALIDATION: {
          statusCode: 400,
          message: 'Invalid request data'
        },
      };

      const mappedError = fastifyErrorMap[error.code];
      if (mappedError) {
        logger.warn({ err: error, requestId: request.id }, mappedError.message);
        return reply.status(mappedError.statusCode).send(errorResponse(error.code, mappedError.message));
      }
    }

    // Unexpected errors - log full details, return generic message
    logger.error({ err: error, requestId: request.id }, "Unhandled error");
    return reply.status(500).send(errorResponse("INTERNAL_ERROR", "An unexpected error occurred"));
  });

  // Serve static files from uploads directory
  app.register(fastifyStatic, {
    root: path.join(__dirname, "..", "uploads"),
    prefix: "/uploads/",
    decorateReply: false,
  });

  // Register REST API routes
  app.register(healthRoutes, { prefix: "/api/v1" });
  app.register(authRoutes, { prefix: "/api/v1" });
  app.register(userRoutes, { prefix: "/api/v1" });
  app.register(productRoutes, { prefix: "/api/v1" });
  app.register(walletRoutes, { prefix: "/api/v1" });
  app.register(paymentRoutes, { prefix: "/api/v1" });
  app.register(orderRoutes, { prefix: "/api/v1" });

  return app;
}

export default buildApp;
