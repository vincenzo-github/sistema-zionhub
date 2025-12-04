import QRCode from 'qrcode'
import { logger } from '../config/logger'

export class CheckinService {
  /**
   * Gera QR Code para um evento
   * O QR Code contém: ZIONHUB:EVENT:{eventId}:{timestamp}
   */
  async generateQRCode(
    eventId: string,
    frontendUrl: string
  ): Promise<{ qrcodeData: string; qrcodeUrl: string }> {
    try {
      const timestamp = Date.now()
      const qrcodeData = `ZIONHUB:EVENT:${eventId}:${timestamp}`

      // Gerar URL com dados do check-in
      const checkinUrl = `${frontendUrl}/eventos/${eventId}/checkin?qr=${encodeURIComponent(
        qrcodeData
      )}`

      // Gerar imagem QR Code como data URL
      const qrcodeUrl = await QRCode.toDataURL(checkinUrl, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.95,
        margin: 1,
        width: 300,
        color: {
          dark: '#1E5F74', // ZionHub primary color
          light: '#ffffff',
        },
      })

      logger.info(`QR Code generated for event: ${eventId}`)

      return {
        qrcodeData,
        qrcodeUrl,
      }
    } catch (err) {
      logger.error('CheckinService.generateQRCode error:', err)
      throw err
    }
  }

  /**
   * Valida dados do QR Code
   */
  validateQRCode(qrcodeData: string): { valid: boolean; eventId?: string } {
    try {
      const parts = qrcodeData.split(':')

      if (parts.length !== 4 || parts[0] !== 'ZIONHUB' || parts[1] !== 'EVENT') {
        return { valid: false }
      }

      const eventId = parts[2]
      const timestamp = parseInt(parts[3], 10)

      // QR Code válido por 24 horas
      const qrcodeAge = Date.now() - timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 horas

      if (qrcodeAge > maxAge) {
        logger.warn(`QR Code expired for event: ${eventId}`)
        return { valid: false }
      }

      return { valid: true, eventId }
    } catch (err) {
      logger.error('CheckinService.validateQRCode error:', err)
      return { valid: false }
    }
  }

  /**
   * Calcula duração do evento em minutos
   */
  calculateDuration(checkInTime: string, checkOutTime: string): number {
    try {
      const checkIn = new Date(checkInTime).getTime()
      const checkOut = new Date(checkOutTime).getTime()
      return Math.round((checkOut - checkIn) / (1000 * 60)) // em minutos
    } catch (err) {
      logger.error('CheckinService.calculateDuration error:', err)
      return 0
    }
  }

  /**
   * Determina se check-in foi antecipado (chegou 15+ minutos antes)
   */
  isEarlyArrival(eventStartTime: string, checkInTime: string): boolean {
    try {
      const eventStart = new Date(eventStartTime).getTime()
      const checkIn = new Date(checkInTime).getTime()
      const minutesDifference = (eventStart - checkIn) / (1000 * 60)
      return minutesDifference >= 15 // Pelo menos 15 minutos antes
    } catch (err) {
      logger.error('CheckinService.isEarlyArrival error:', err)
      return false
    }
  }

  /**
   * Gera relatório de presença do evento
   */
  generateAttendanceReport(records: any[]): {
    totalExpected: number
    totalCheckedIn: number
    totalCheckedOut: number
    attendanceRate: number
  } {
    try {
      const totalExpected = records.length
      const totalCheckedIn = records.filter((r) => r.check_in_time).length
      const totalCheckedOut = records.filter((r) => r.check_out_time).length
      const attendanceRate = totalExpected > 0 ? (totalCheckedIn / totalExpected) * 100 : 0

      return {
        totalExpected,
        totalCheckedIn,
        totalCheckedOut,
        attendanceRate: Math.round(attendanceRate),
      }
    } catch (err) {
      logger.error('CheckinService.generateAttendanceReport error:', err)
      return {
        totalExpected: 0,
        totalCheckedIn: 0,
        totalCheckedOut: 0,
        attendanceRate: 0,
      }
    }
  }
}
