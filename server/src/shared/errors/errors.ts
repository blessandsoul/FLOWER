/**
 * Typed Error Classes
 * All custom errors extend AppError with specific HTTP status codes
 */

import { AppError } from './app-error';

/**
 * 400 Bad Request - Client sent invalid data
 */
export class BadRequestError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
    this.name = 'BadRequestError';
  }
}

/**
 * 400 Validation Error - Input validation failed
 */
export class ValidationError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * 401 Unauthorized - Authentication required or failed
 */
export class UnauthorizedError extends AppError {
  constructor(
    code: string = 'AUTH_UNAUTHORIZED',
    message: string = 'Authentication required'
  ) {
    super(code, message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden - User lacks permissions
 */
export class ForbiddenError extends AppError {
  constructor(
    code: string = 'AUTH_FORBIDDEN',
    message: string = 'Access denied'
  ) {
    super(code, message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found - Resource does not exist
 */
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict - Resource already exists or state conflict
 */
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * 500 Internal Server Error - Unexpected server error
 */
export class InternalError extends AppError {
  constructor(
    code: string = 'INTERNAL_ERROR',
    message: string = 'An unexpected error occurred'
  ) {
    super(code, message, 500);
    this.name = 'InternalError';
  }
}
