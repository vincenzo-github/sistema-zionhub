import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: API_ERRORS.UNAUTHORIZED,
          message: 'Token not provided',
        },
      });
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = verifyToken(token);

    // Inject user data into request
    req.churchId = decoded.churchId;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.isMaster = decoded.isMaster;

    next();
  } catch (error: any) {
    logger.warn('Invalid token:', error.message);
    return res.status(401).json({
      success: false,
      error: {
        code: API_ERRORS.UNAUTHORIZED,
        message: 'Invalid or expired token',
      },
    });
  }
}

export function requireMaster(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isMaster) {
    return res.status(403).json({
      success: false,
      error: {
        code: API_ERRORS.FORBIDDEN,
        message: 'Only MASTER can execute this action',
      },
    });
  }
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: API_ERRORS.FORBIDDEN,
          message: 'Insufficient permissions',
        },
      });
    }
    next();
  };
}
