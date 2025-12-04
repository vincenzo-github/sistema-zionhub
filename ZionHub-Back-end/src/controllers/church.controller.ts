import { Request, Response } from 'express';
import { ChurchStorage } from '../storage/church.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class ChurchController {
  private churchStorage: ChurchStorage;

  constructor() {
    this.churchStorage = new ChurchStorage();
  }

  async getChurch(req: Request, res: Response) {
    try {
      const churchId = req.churchId;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const church = await this.churchStorage.getChurchById(churchId);

      if (!church) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Church not found',
          },
        });
      }

      return res.json({
        success: true,
        data: church,
      });
    } catch (error: any) {
      logger.error('Get church error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async updateChurch(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { name, email, phone, whatsapp } = req.body;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      if (!req.isMaster) {
        return res.status(403).json({
          success: false,
          error: {
            code: API_ERRORS.FORBIDDEN,
            message: 'Only master users can update church info',
          },
        });
      }

      const church = await this.churchStorage.updateChurch(churchId, {
        name,
        email,
        phone,
        whatsapp,
      });

      if (!church) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Church not found',
          },
        });
      }

      return res.json({
        success: true,
        data: church,
        message: 'Church updated successfully',
      });
    } catch (error: any) {
      logger.error('Update church error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async createChurch(req: Request, res: Response) {
    try {
      const { name, email, phone, address } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Name and email are required',
          },
        });
      }

      const church = await this.churchStorage.createChurch({
        name,
        email,
        phone: phone || null,
        address: address || null,
        status: 'active',
      });

      return res.status(201).json({
        success: true,
        data: church,
        message: 'Church created successfully',
      });
    } catch (error: any) {
      logger.error('Create church error:', error);
      if (error.message?.includes('unique')) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'CONFLICT',
            message: 'Church with this email already exists',
          },
        });
      }
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async getAllChurches(req: Request, res: Response) {
    try {
      const churches = await this.churchStorage.getAllChurches();

      return res.json({
        success: true,
        data: churches,
      });
    } catch (error: any) {
      logger.error('Get all churches error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }
}