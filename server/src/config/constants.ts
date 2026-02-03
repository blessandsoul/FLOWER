/**
 * Application Constants
 * Цветочный импорт (Голландия/Эквадор → Грузия)
 *
 * NOTE: Enum values MUST match Prisma schema enums exactly.
 */

// User Roles
export const USER_ROLES = {
  USER: 'USER',           // Regular retail customer
  RESELLER: 'RESELLER',   // B2B wholesale client
  OPERATOR: 'OPERATOR',   // Processes orders, places on supplier site
  LOGISTICS: 'LOGISTICS', // Manages warehouse and stock
  ACCOUNTANT: 'ACCOUNTANT', // Financial accounting
  ADMIN: 'ADMIN',         // Full system access
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

// Order Status (matches Prisma OrderStatus enum)
export const ORDER_STATUS = {
  PENDING: 'PENDING',       // Customer paid, waiting for operator
  APPROVED: 'APPROVED',     // Operator placed order with supplier
  SHIPPED: 'SHIPPED',       // Supplier shipped to warehouse/customer
  DELIVERED: 'DELIVERED',   // Customer received order
  CANCELLED: 'CANCELLED',   // Order cancelled (no stock, etc.)
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// Transaction Types (matches Prisma TransactionType enum)
export const TRANSACTION_TYPES = {
  DEPOSIT: 'DEPOSIT',   // Credits awarded (when stock unavailable)
  SPEND: 'SPEND',       // Credits used (during order payment)
  REFUND: 'REFUND',     // Credits returned (order cancellation)
  FEE: 'FEE',           // Admin manual adjustment
} as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];

// Flower Origin (matches Prisma FlowerOrigin enum)
export const FLOWER_ORIGIN = {
  HOLLAND: 'HOLLAND',
  ECUADOR: 'ECUADOR',
} as const;

export type FlowerOrigin = (typeof FLOWER_ORIGIN)[keyof typeof FLOWER_ORIGIN];

// Product Status (matches Prisma ProductStatus enum)
export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISCONTINUED: 'DISCONTINUED',
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

// Batch Status (matches Prisma BatchStatus enum)
export const BATCH_STATUS = {
  ORDERED: 'ORDERED',       // Batch ordered from supplier
  IN_TRANSIT: 'IN_TRANSIT', // Batch in transit
  RECEIVED: 'RECEIVED',     // Batch received at warehouse
  CANCELLED: 'CANCELLED',   // Batch cancelled
} as const;

export type BatchStatus = (typeof BATCH_STATUS)[keyof typeof BATCH_STATUS];

// Payment Status (matches Prisma PaymentStatus enum)
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

// Payment Methods (matches Prisma PaymentMethod enum)
export const PAYMENT_METHODS = {
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  CREDITS: 'CREDITS',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

// Stock Movement Types
export const STOCK_MOVEMENT_TYPES = {
  ARRIVAL: 'ARRIVAL',         // New stock arrived (import)
  SALE: 'SALE',               // Stock sold (order)
  DAMAGE: 'DAMAGE',           // Damaged goods
  RETURN: 'RETURN',           // Customer return
  ADJUSTMENT: 'ADJUSTMENT',   // Manual adjustment
  STOCK_UPDATE: 'STOCK_UPDATE', // Weekly JSON import update
} as const;

export type StockMovementType = (typeof STOCK_MOVEMENT_TYPES)[keyof typeof STOCK_MOVEMENT_TYPES];

// Delivery Methods
export const DELIVERY_METHODS = {
  DELIVERY: 'DELIVERY', // Delivery to customer (extra cost)
  PICKUP: 'PICKUP',     // Customer pickup (free)
} as const;

export type DeliveryMethod = (typeof DELIVERY_METHODS)[keyof typeof DELIVERY_METHODS];

// Invoice Status (matches Prisma InvoiceStatus enum)
export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  CANCELLED: 'CANCELLED',
} as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[keyof typeof INVOICE_STATUS];

// VAT Rate (Georgian standard)
export const VAT_RATE = 18;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// Stock Visibility
export const STOCK_VISIBILITY = {
  DEFAULT_PERCENTAGE: 40,  // Show 40% of stock by default
  MIN_PERCENTAGE: 10,      // Minimum 10% visible
  MAX_PERCENTAGE: 100,     // Maximum 100% visible
} as const;

// Volume Discount Tiers (stems)
export const VOLUME_DISCOUNTS = [
  { minQty: 1000, discountPercentage: 15 },
  { minQty: 500, discountPercentage: 10 },
  { minQty: 100, discountPercentage: 5 },
] as const;

// Currency
export const CURRENCY = {
  EUR: 'EUR', // Base supplier price
  GEL: 'GEL', // Customer price (Georgian Lari)
} as const;

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];

// API Version
export const API_VERSION = 'v1';
export const API_PREFIX = `/api/${API_VERSION}`;

// Cache TTL (Time To Live in seconds)
export const CACHE_TTL = {
  SETTINGS: 3600,        // 1 hour
  PRODUCTS: 300,         // 5 minutes
  EXCHANGE_RATE: 86400,  // 24 hours
  USER_BALANCE: 60,      // 1 minute
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Codes
export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
  AUTH_TOKEN_INVALID: 'AUTH_TOKEN_INVALID',
  AUTH_UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  AUTH_FORBIDDEN: 'AUTH_FORBIDDEN',

  // User
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
  USER_INSUFFICIENT_BALANCE: 'USER_INSUFFICIENT_BALANCE',

  // Product
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  PRODUCT_INSUFFICIENT_STOCK: 'PRODUCT_INSUFFICIENT_STOCK',
  PRODUCT_MIN_BOX_SIZE: 'PRODUCT_MIN_BOX_SIZE',
  PRODUCT_INACTIVE: 'PRODUCT_INACTIVE',

  // Batch
  BATCH_NOT_FOUND: 'BATCH_NOT_FOUND',
  BATCH_CLOSED: 'BATCH_CLOSED',
  BATCH_ARCHIVED: 'BATCH_ARCHIVED',

  // Order
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_ALREADY_CANCELLED: 'ORDER_ALREADY_CANCELLED',
  ORDER_INVALID_STATUS: 'ORDER_INVALID_STATUS',
  ORDER_EMPTY: 'ORDER_EMPTY',

  // Stock
  STOCK_IMPORT_FAILED: 'STOCK_IMPORT_FAILED',
  STOCK_MOVEMENT_FAILED: 'STOCK_MOVEMENT_FAILED',

  // Settings
  SETTINGS_NOT_FOUND: 'SETTINGS_NOT_FOUND',
  SETTINGS_INVALID_VALUE: 'SETTINGS_INVALID_VALUE',

  // Credits
  CREDITS_INSUFFICIENT: 'CREDITS_INSUFFICIENT',
  CREDITS_NEGATIVE_AMOUNT: 'CREDITS_NEGATIVE_AMOUNT',

  // Invoice
  INVOICE_NOT_FOUND: 'INVOICE_NOT_FOUND',
  INVOICE_ALREADY_EXISTS: 'INVOICE_ALREADY_EXISTS',
  INVOICE_GENERATION_FAILED: 'INVOICE_GENERATION_FAILED',

  // General
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
