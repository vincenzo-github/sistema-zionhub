import { Request, Response } from 'express';
import { DashboardStorage } from '../storage/dashboard.storage';
import { logger } from '../config/logger';
import { API_ERRORS } from '../config/constants';

export class DashboardController {
  private dashboardStorage: DashboardStorage;

  constructor() {
    this.dashboardStorage = new DashboardStorage();
  }

  async getChurchDashboard(req: Request, res: Response) {
    try {
      const stats = await this.dashboardStorage.getChurchDashboard(req.churchId!);

      return res.json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      logger.error('DashboardController.getChurchDashboard error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Failed to fetch dashboard data',
        },
      });
    }
  }

  async getUserDashboard(req: Request, res: Response) {
    try {
      const dashboard = await this.dashboardStorage.getUserDashboard(
        req.churchId!,
        req.userId!
      );

      return res.json({
        success: true,
        data: dashboard,
      });
    } catch (error: any) {
      logger.error('DashboardController.getUserDashboard error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Failed to fetch user dashboard',
        },
      });
    }
  }

  async getEventAnalytics(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const analytics = await this.dashboardStorage.getEventAnalytics(
        req.churchId!,
        eventId
      );

      return res.json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      logger.error('DashboardController.getEventAnalytics error:', error);

      if (error.message === 'Event not found') {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Event not found',
          },
        });
      }

      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Failed to fetch event analytics',
        },
      });
    }
  }
}
