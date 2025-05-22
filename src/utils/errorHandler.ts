import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

interface DomainError {
  code: number;
  message: string;
  details?: string;
  httpStatus: number;
}

const ERROR_DOMAINS = {
  AUTHENTICATION: 1000,
  AUTHORIZATION: 2000,
  COURSES: 3000,
  NOTIFICATIONS: 4000,
  ANALYTICS: 5000,
  SYSTEM: 9000
} as const;

const ERROR_CODES = {
  // Authentication (1xxx)
  INVALID_CREDENTIALS: {
    code: ERROR_DOMAINS.AUTHENTICATION + 1,
    message: 'Invalid credentials',
    httpStatus: 401
  },
  ACCOUNT_LOCKED: {
    code: ERROR_DOMAINS.AUTHENTICATION + 2,
    message: 'Account temporarily locked',
    httpStatus: 403
  },

  // Authorization (2xxx)
  MISSING_PERMISSION: {
    code: ERROR_DOMAINS.AUTHORIZATION + 1,
    message: 'Missing required permission',
    httpStatus: 403
  },

  // Notifications (4xxx)
  INVALID_NOTIFICATION_TYPE: {
    code: ERROR_DOMAINS.NOTIFICATIONS + 1,
    message: 'Invalid notification type',
    httpStatus: 400
  },
  NOTIFICATION_DELIVERY_FAILED: {
    code: ERROR_DOMAINS.NOTIFICATIONS + 2,
    message: 'Failed to deliver notification',
    httpStatus: 500
  }
} as const;

class AppError extends Error {
  constructor(
    public readonly error: DomainError,
    public readonly context?: Record<string, any>
  ) {
    super(error.message);
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let errorResponse: any = {
    error: {
      code: ERROR_DOMAINS.SYSTEM + 1,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    }
  };

  if (err instanceof AppError) {
    statusCode = err.error.httpStatus;
    errorResponse = {
      error: {
        code: err.error.code,
        message: err.error.message,
        details: err.error.details,
        timestamp: new Date().toISOString()
      }
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.error.stack = err.stack;
      errorResponse.error.context = err.context;
    }
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ...(err instanceof AppError ? { code: err.error.code } : {})
  });

  res.status(statusCode).json(errorResponse);
}

export function createError(
  key: keyof typeof ERROR_CODES,
  details?: string,
  context?: Record<string, any>
): AppError {
  const error = { ...ERROR_CODES[key] };
  if (details) error.details = details;
  return new AppError(error, context);
}

export { ERROR_CODES, AppError };
