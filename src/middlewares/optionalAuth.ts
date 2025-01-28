import type { Request, Response, NextFunction } from 'express';
import services from '../services';

export default async function auth(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.method !== 'OPTIONS' && 'authorization' in req.headers) {
    const token = req.headers.authorization.replace('Bearer ', '');

    try {
      const payload = services.Token.verify(token);
  
      const data = payload instanceof Promise ? await payload : payload;
  
      req['user'] = services.Token.getUserData(data);
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized!' });
    }
  }

  next();
}
