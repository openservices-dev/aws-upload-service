import type { Request, Response, NextFunction } from 'express';
import logger from '../logger';

export default function logRequest(req: Request, res: Response, next: NextFunction): void {
  if (req.method !== 'OPTIONS') {
    logger.debug(`${req.method} ${req.path}`, { body: req.body, query: req.query });
  }

  next();
}
