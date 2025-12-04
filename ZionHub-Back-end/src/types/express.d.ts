import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      churchId?: string;
      userId?: string;
      userRole?: string;
      isMaster?: boolean;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  churchId: string;
  userId: string;
  userRole: string;
  isMaster: boolean;
}
