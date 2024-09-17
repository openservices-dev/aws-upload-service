import type { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export function validateBody(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req.body); 
    const isValid = error == null; 
    
    if (isValid) { 
      next(); 
    } else { 
      const { details } = error; 
   
      res.status(400).json({ error: details });
    }
  };
}

export function validateQuery(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req.query); 
    const isValid = error == null; 
    
    if (isValid) { 
      next(); 
    } else { 
      const { details } = error; 
   
      res.status(400).json({ error: details });
    }
  };
}

export function validateCookies(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req.cookies); 
    const isValid = error == null; 
    
    if (isValid) { 
      next(); 
    } else { 
      const { details } = error; 
   
      res.status(400).json({ error: details });
    }
  };
}

export function validateParams(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req.params); 
    const isValid = error == null; 
    
    if (isValid) { 
      next(); 
    } else { 
      const { details } = error; 
   
      res.status(400).json({ error: details });
    }
  };
}

export function validateRequest(schema: ObjectSchema) {
  return function (req: Request, res: Response, next: NextFunction): void {
    const { error } = schema.validate(req); 
    const isValid = error == null; 
    
    if (isValid) { 
      next(); 
    } else { 
      const { details } = error; 
   
      res.status(400).json({ error: details });
    }
  };
}
