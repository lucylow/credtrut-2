import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // For hackathon purposes, we check for a Bearer token
  // In production, verify JWT or signature
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Unauthorized access attempt to ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }
  
  next();
};
