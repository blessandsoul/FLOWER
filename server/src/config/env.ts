import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(8000),

  // Prisma Database URL
  DATABASE_URL: z.string().min(1),

  // Individual DB variables (for backwards compatibility)
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().int().positive().default(3308),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().optional(),

  // JWT configuration
  ACCESS_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  // Email configuration (Resend)
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("FLOWER <noreply@flower.com>"),

  // Frontend URL for email links (used for verification, password reset, etc.)
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),

  // CORS configuration (comma-separated list of allowed origins for production)
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform((val) => val ? val.split(",").map((origin) => origin.trim()) : undefined),

  // Stock display ratio (scraped data safety margin, e.g. 0.6 = show 60%)
  STOCK_DISPLAY_RATIO: z.coerce.number().min(0).max(1).default(0.6),

  // Redis
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.coerce.number().int().positive().default(6381),
  REDIS_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.format();
  throw new Error(`Invalid environment variables: ${JSON.stringify(formatted)}`);
}

export const env = parsed.data;
