import { Request, Response } from 'express'
import { NotificationStorage } from '../storage/notification.storage'
import { logger } from '../config/logger'
import { API_ERRORS } from '../config/constants'

export class NotificationController {
  private notificationStorage: NotificationStorage

  constructor() {
    this.notificationStorage = new NotificationStorage()
  }

  async listNotifications(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const userId = req.userId

      if (!churchId || !userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const notifications = await this.notificationStorage.listByUser(churchId, userId)

      return res.json({
        success: true,
        data: notifications,
      })
    } catch (error: any) {
      logger.error('NotificationController.listNotifications error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const userId = req.userId

      if (!churchId || !userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const count = await this.notificationStorage.getUnreadCount(churchId, userId)

      return res.json({
        success: true,
        data: { count },
      })
    } catch (error: any) {
      logger.error('NotificationController.getUnreadCount error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const { id } = req.params

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const notification = await this.notificationStorage.markAsRead(churchId, id)

      if (!notification) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Notification not found',
          },
        })
      }

      return res.json({
        success: true,
        data: notification,
        message: 'Marked as read',
      })
    } catch (error: any) {
      logger.error('NotificationController.markAsRead error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const userId = req.userId

      if (!churchId || !userId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const success = await this.notificationStorage.markAllAsRead(churchId, userId)

      if (!success) {
        return res.status(500).json({
          success: false,
          error: {
            code: API_ERRORS.INTERNAL_ERROR,
            message: 'Failed to mark all as read',
          },
        })
      }

      return res.json({
        success: true,
        message: 'All notifications marked as read',
      })
    } catch (error: any) {
      logger.error('NotificationController.markAllAsRead error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const { id } = req.params

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const success = await this.notificationStorage.deleteNotification(churchId, id)

      if (!success) {
        return res.status(404).json({
          success: false,
          error: {
            code: API_ERRORS.NOT_FOUND,
            message: 'Notification not found',
          },
        })
      }

      return res.json({
        success: true,
        message: 'Notification deleted',
      })
    } catch (error: any) {
      logger.error('NotificationController.deleteNotification error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }
}
