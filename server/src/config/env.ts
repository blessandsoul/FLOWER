import { z } from 'zod';
import dotenv from 'dotenv';

// Load .env file
dotenv.config();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string().url(),

  // Redis
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(32).optional(),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS
  CORS_ORIGIN: z.string().default('*'),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Rate Limiting
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_TIME_WINDOW: z.string().default('1 minute'),

  // Pricing
  EUR_TO_GEL_RATE: z.coerce.number().positive().default(3.50),
  DEFAULT_MARKUP_PERCENTAGE: z.coerce.number().min(0).max(100).default(40),
  RESELLER_MARKUP_PERCENTAGE: z.coerce.number().min(0).max(100).default(20),
  VIP_DISCOUNT_PERCENTAGE: z.coerce.number().min(0).max(100).default(5),

  // Visibility
  DEFAULT_VISIBILITY_PERCENTAGE: z.coerce.number().min(0).max(100).default(40),

  // Delivery
  DELIVERY_BASE_COST: z.coerce.number().min(0).default(15),

  // Company Details (for invoices)
  COMPANY_NAME: z.string().default('შპს ფლორკა'),
  COMPANY_TAX_ID: z.string().default('000000000'),
  COMPANY_ADDRESS: z.string().default('თბილისი, საქართველო'),
  COMPANY_PHONE: z.string().default('+995-555-00-00-00'),
  COMPANY_BANK_NAME: z.string().default('თიბისი ბანკი'),
  COMPANY_IBAN: z.string().default('GE00TB0000000000000000'),
  COMPANY_EMAIL: z.string().default('info@florca.ge'),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables at startup
const parseEnv = (): Env => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
};

export const env = parseEnv();

// Export individual values for convenience
export const {
  NODE_ENV,
  PORT,
  HOST,
  DATABASE_URL,
  REDIS_URL,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
  CORS_ORIGIN,
  LOG_LEVEL,
  RATE_LIMIT_MAX,
  RATE_LIMIT_TIME_WINDOW,
  EUR_TO_GEL_RATE,
  DEFAULT_MARKUP_PERCENTAGE,
  RESELLER_MARKUP_PERCENTAGE,
  VIP_DISCOUNT_PERCENTAGE,
  DEFAULT_VISIBILITY_PERCENTAGE,
  DELIVERY_BASE_COST,
  COMPANY_NAME,
  COMPANY_TAX_ID,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_BANK_NAME,
  COMPANY_IBAN,
  COMPANY_EMAIL,
} = env;

// Helper functions
export const isDevelopment = () => NODE_ENV === 'development';
export const isProduction = () => NODE_ENV === 'production';
export const isTest = () => NODE_ENV === 'test';
