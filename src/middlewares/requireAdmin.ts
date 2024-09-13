import type { Request, Response, NextFunction } from 'express';
import tokenService from '../services/token';

export default async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  if ('authorization' in req.headers === false) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const jwt = tokenService.JWT;
    const data = jwt.verify(token);

    if ('role' in data === false || 'service' in data === false) {
      throw new Error('Token does not contain mandatory fields!');
    }
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  next();
}
