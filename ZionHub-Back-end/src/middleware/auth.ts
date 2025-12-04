import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { RequestWithAuth } from '../types';
import { logger } from '../utils/logger';

export function authMiddleware(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  // @ts-ignore
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      error: 'Missing authorization token',
    });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }

  req.userId = payload.userId;
  req.churchId = payload.churchId;
  req.userRole = payload.role;
  req.isMaster = payload.isMaster;

  next();
}

export function requireMaster(
  req: RequestWithAuth,
  res: Response,
  next: NextFunction
) {
  if (!req.isMaster) {
    return res.status(403).json({
      error: 'Only master users can access this resource',
    });
  }

  next();
}

export function requireRole(roles: string[]) {
  return (req: RequestWithAuth, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
      });
    }

    next();
  };
}
