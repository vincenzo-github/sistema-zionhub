import { Request, Response } from 'express';
import { MinistryStorage } from '../storage/ministry.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class MinistryController {
  private ministryStorage: MinistryStorage;

  constructor() {
    this.ministryStorage = new MinistryStorage();
  }

  async listMinistries(req: Request, res: Response) {
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

      const ministries = await this.ministryStorage.listByChurch(churchId);

      return res.json({
        success: true,
        data: ministries,
      });
    } catch (error: any) {
      logger.error('MinistryController.listMinistries error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async getMinistry(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const ministry = await this.ministryStorage.getMinistryById(churchId, id);

      if (!ministry) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Ministry not found',
          },
        });
      }

      return res.json({
        success: true,
        data: ministry,
      });
    } catch (error: any) {
      logger.error('MinistryController.getMinistry error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async createMinistry(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { name, description, color, icon, leader_id } = req.body;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      if (!name) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Ministry name is required',
          },
        });
      }

      const ministry = await this.ministryStorage.createMinistry(churchId, {
        name,
        description,
        color,
        icon,
        leader_id,
        is_default: false,
      });

      return res.status(201).json({
        success: true,
        data: ministry,
        message: 'Ministry created successfully',
      });
    } catch (error: any) {
      logger.error('MinistryController.createMinistry error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async updateMinistry(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;
      const { name, description, color, icon, leader_id } = req.body;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const ministry = await this.ministryStorage.updateMinistry(churchId, id, {
        name,
        description,
        color,
        icon,
        leader_id,
      });

      if (!ministry) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Ministry not found',
          },
        });
      }

      return res.json({
        success: true,
        data: ministry,
        message: 'Ministry updated successfully',
      });
    } catch (error: any) {
      logger.error('MinistryController.updateMinistry error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      });
    }
  }

  async deleteMinistry(req: Request, res: Response) {
    try {
      const churchId = req.churchId;
      const { id } = req.params;

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        });
      }

      const success = await this.ministryStorage.deleteMinistry(churchId, id);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Ministry not found',
          },
        });
      }

      return res.json({
        success: true,
        message: 'Ministry deleted successfully',
      });
    } catch (error: any) {
      logger.error('MinistryController.deleteMinistry error:', error);
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
