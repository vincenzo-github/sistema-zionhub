import { Router } from 'express'
import { NotificationController } from '../controllers/notification.controller'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const notificationController = new NotificationController()

// List all notifications for current user
router.get('/', authMiddleware, (req, res) =>
  notificationController.listNotifications(req, res)
)

// Get unread count
router.get('/unread-count', authMiddleware, (req, res) =>
  notificationController.getUnreadCount(req, res)
)

// Mark specific notification as read
router.put('/:id/read', authMiddleware, (req, res) =>
  notificationController.markAsRead(req, res)
)

// Mark all notifications as read
router.put('/read-all', authMiddleware, (req, res) =>
  notificationController.markAllAsRead(req, res)
)

// Delete notification
router.delete('/:id', authMiddleware, (req, res) =>
  notificationController.deleteNotification(req, res)
)

export default router
