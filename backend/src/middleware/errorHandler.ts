import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';

import { AppError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json({
      success: false,
      error: 'Validation failed',
      details: err.errors,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
  });

  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
  });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    error: 'Route not found',
  });
}
