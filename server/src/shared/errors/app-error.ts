/**
 * Base Application Error Class
 *
 * All custom errors in the FLORCA system extend this class.
 * Provides a structured error format with machine-readable codes.
 */

export class AppError extends Error {
  /**
   * @param code - Machine-readable error code (e.g., 'PRODUCT_NOT_FOUND')
   * @param message - Human-readable error message
   * @param statusCode - HTTP status code (default: 500)
   */
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON format
   */
  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
      },
    };
  }
}
