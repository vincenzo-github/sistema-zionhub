import { Router } from 'express'
import { CheckinController } from '../controllers/checkin.controller'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const checkinController = new CheckinController()

// Generate QR Code for event
router.get('/:id/qrcode', authMiddleware, (req, res) =>
  checkinController.generateQRCode(req, res)
)

// Record check-in
router.post('/:id/checkin', authMiddleware, (req, res) =>
  checkinController.checkIn(req, res)
)

// Record check-out
router.post('/:id/checkout', authMiddleware, (req, res) =>
  checkinController.checkOut(req, res)
)

// Get event attendance
router.get('/:id/attendance', authMiddleware, (req, res) =>
  checkinController.getAttendance(req, res)
)

// Get user check-in history
router.get('/history/me', authMiddleware, (req, res) =>
  checkinController.getCheckinHistory(req, res)
)

export default router
