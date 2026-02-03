import pino from 'pino';
import { LOG_LEVEL, NODE_ENV, isDevelopment } from '../config';

/**
 * Pino Logger Configuration
 *
 * Structured logging for the FLORCA flower import system.
 * Uses pretty printing in development, JSON in production.
 */

export const logger = pino({
  level: LOG_LEVEL,
  ...(isDevelopment() && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
        singleLine: false,
      },
    },
  }),
  ...(!isDevelopment() && {
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
  }),
  base: {
    env: NODE_ENV,
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: {
        ...req.headers,
        authorization: req.headers.authorization ? '[REDACTED]' : undefined,
      },
      remoteAddress: req.ip,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: pino.stdSerializers.err,
  },
});

/**
 * Request ID logger
 * Creates a child logger with request ID for request tracing
 */
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};
