import { Request, Response } from 'express'
import { CheckinService } from '../services/checkin.service'
import { CheckinStorage } from '../storage/checkin.storage'
import { logger } from '../config/logger'
import { API_ERRORS } from '../config/constants'

export class CheckinController {
  private checkinService: CheckinService
  private checkinStorage: CheckinStorage

  constructor() {
    this.checkinService = new CheckinService()
    this.checkinStorage = new CheckinStorage()
  }

  async generateQRCode(req: Request, res: Response) {
    try {
      const { id: eventId } = req.params

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

      const { qrcodeData, qrcodeUrl } = await this.checkinService.generateQRCode(
        eventId,
        frontendUrl
      )

      return res.json({
        success: true,
        data: {
          event_id: eventId,
          qrcode_data: qrcodeData,
          qrcode_url: qrcodeUrl,
          generated_at: new Date().toISOString(),
        },
      })
    } catch (error: any) {
      logger.error('CheckinController.generateQRCode error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Failed to generate QR code',
        },
      })
    }
  }

  async checkIn(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const { id: eventId } = req.params
      const { user_id: userId, qrcode_data: qrcodeData, notes } = req.body

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      // Validar QR Code se fornecido
      if (qrcodeData) {
        const { valid, eventId: qrEventId } = this.checkinService.validateQRCode(qrcodeData)
        if (!valid || qrEventId !== eventId) {
          return res.status(400).json({
            success: false,
            error: {
              code: API_ERRORS.VALIDATION_ERROR,
              message: 'Invalid or expired QR code',
            },
          })
        }
      }

      const checkinRecord = await this.checkinStorage.checkIn(
        churchId,
        eventId,
        userId || req.userId,
        notes
      )

      if (!checkinRecord) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Failed to record check-in',
          },
        })
      }

      return res.json({
        success: true,
        data: checkinRecord,
        message: 'Check-in recorded successfully',
      })
    } catch (error: any) {
      logger.error('CheckinController.checkIn error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async checkOut(req: Request, res: Response) {
    try {
      const churchId = req.churchId
      const { id: eventId } = req.params
      const { user_id: userId, notes } = req.body

      if (!churchId) {
        return res.status(401).json({
          success: false,
          error: {
            code: API_ERRORS.UNAUTHORIZED,
            message: 'Not authenticated',
          },
        })
      }

      const checkoutRecord = await this.checkinStorage.checkOut(
        churchId,
        eventId,
        userId || req.userId,
        notes
      )

      if (!checkoutRecord) {
        return res.status(400).json({
          success: false,
          error: {
            code: API_ERRORS.VALIDATION_ERROR,
            message: 'Failed to record check-out',
          },
        })
      }

      return res.json({
        success: true,
        data: checkoutRecord,
        message: 'Check-out recorded successfully',
      })
    } catch (error: any) {
      logger.error('CheckinController.checkOut error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async getAttendance(req: Request, res: Response) {
    try {
      const { id: eventId } = req.params

      const attendance = await this.checkinStorage.getEventAttendance(eventId)

      return res.json({
        success: true,
        data: attendance,
      })
    } catch (error: any) {
      logger.error('CheckinController.getAttendance error:', error)
      return res.status(500).json({
        success: false,
        error: {
          code: API_ERRORS.INTERNAL_ERROR,
          message: 'Internal server error',
        },
      })
    }
  }

  async getCheckinHistory(req: Request, res: Response) {
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

      const history = await this.checkinStorage.getUserCheckinHistory(churchId, userId)

      return res.json({
        success: true,
        data: history,
      })
    } catch (error: any) {
      logger.error('CheckinController.getCheckinHistory error:', error)
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
