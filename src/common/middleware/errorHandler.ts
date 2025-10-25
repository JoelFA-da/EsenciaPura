import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import { logger } from '../utils/logger';

export function errorHandler() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn({ err }, 'AppError');
      return res.status(err.statusCode).json({ error: err.message, details: err.details });
    }
    logger.error({ err }, 'Unhandled error');
    return res.status(500).json({ error: 'Internal Server Error' });
  };
}
