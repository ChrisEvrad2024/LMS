import { Request, Response, NextFunction } from 'express';
import { ErrorDictionary, ErrorCode, getErrorMessage } from '../utils/errorDictionary';
import { logger } from '../utils/logger';

export class APIError extends Error {
  constructor(
    public code: ErrorCode,
    public details?: string,
    public metadata?: Record<string, unknown>
  ) {
    super(getErrorMessage(code));
  }
}

export const errorMiddleware = (
  err: Error | APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof APIError) {
    const errorDef = ErrorDictionary[err.code];
    const message = getErrorMessage(err.code, req.language as any);
    
    logger.log({
      level: errorDef.logLevel,
      message: err.message,
      code: err.code,
      path: req.path,
      metadata: err.metadata,
      language: req.language
    });

    return res.status(errorDef.httpStatus).json({
      error: {
        code: err.code,
        message,
        details: err.details,
        timestamp: new Date().toISOString(),
        language: req.language
      }
    });
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path
  });

  const fallbackMessage = getErrorMessage(9001, req.language as any);
  
  res.status(500).json({
    error: {
      code: 9001,
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
      language: req.language
    }
  });
};
