import { Router } from 'express'
import { GamificationController } from '../controllers/gamification.controller'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const gamificationController = new GamificationController()

router.get('/me', authMiddleware, (req, res) =>
  gamificationController.getUserStats(req, res)
)

router.get('/me/position', authMiddleware, (req, res) =>
  gamificationController.getUserPosition(req, res)
)

router.get('/me/badges', authMiddleware, (req, res) =>
  gamificationController.getUserBadges(req, res)
)

router.get('/points-history', authMiddleware, (req, res) =>
  gamificationController.getPointsHistory(req, res)
)

router.get('/leaderboard', authMiddleware, (req, res) =>
  gamificationController.getLeaderboard(req, res)
)

router.get('/badges', (req, res) =>
  gamificationController.getAllBadges(req, res)
)

router.post('/award-points', authMiddleware, (req, res) =>
  gamificationController.awardPoints(req, res)
)

export default router
