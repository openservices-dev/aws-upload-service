import { Request, Response, NextFunction } from 'express';
import services from '../services';

export default async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<unknown> {
  if ('authorization' in req.headers === false) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = services.Token.verify(token);
  
    const data = payload instanceof Promise ? await payload : payload;

    req['user'] = services.Token.getUserData(data);
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  next();
}