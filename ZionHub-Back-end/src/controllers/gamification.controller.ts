import express from 'express'
import { GamificationService } from '../services/gamification.service'
import { GamificationStorage } from '../storage/gamification.storage'
import { logger } from '../config/logger'

export class GamificationController {
  private service = new GamificationService()
  private storage = new GamificationStorage()

  /**
   * GET /gamification/me
   */
  async getUserStats(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const stats = await this.storage.getUserStats(userId)
      const badges = await this.storage.getUserBadges(userId)
      const gameReport = this.service.generateGameReport({
        totalPoints: stats.total_points,
        badges,
        eventsAttended: stats.events_attended,
      })

      res.json({
        stats,
        badges,
        gameReport,
      })
    } catch (err) {
      logger.error('GamificationController.getUserStats error:', err)
      res.status(500).json({ error: 'Failed to fetch user stats' })
    }
  }

  /**
   * GET /gamification/leaderboard
   */
  async getLeaderboard(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const limit = Math.min(Number(req.query.limit) || 50, 100)
      const offset = Number(req.query.offset) || 0

      const leaderboard = await this.storage.getLeaderboard(limit, offset)

      res.json({
        leaderboard,
        limit,
        offset,
      })
    } catch (err) {
      logger.error('GamificationController.getLeaderboard error:', err)
      res.status(500).json({ error: 'Failed to fetch leaderboard' })
    }
  }

  /**
   * GET /gamification/me/position
   */
  async getUserPosition(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const position = await this.storage.getUserLeaderboardPosition(userId)

      res.json({
        position: position || null,
      })
    } catch (err) {
      logger.error('GamificationController.getUserPosition error:', err)
      res.status(500).json({ error: 'Failed to fetch position' })
    }
  }

  /**
   * POST /gamification/award-points
   */
  async awardPoints(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const { user_id, event_id, points, reason } = req.body

      if (!user_id || !event_id || !points || !reason) {
        res.status(400).json({ error: 'Missing required fields' })
        return
      }

      const result = await this.storage.awardPoints(
        user_id,
        event_id,
        points,
        reason
      )

      const badges = await this.storage.getAllBadges()
      const newBadges = []

      for (const badge of badges) {
        if (
          this.service.checkBadgeEarned(
            result.total_points,
            badge.points_required
          )
        ) {
          const badgeResult = await this.storage.awardBadge(
            user_id,
            badge.id
          )
          if (badgeResult.newly_earned) {
            newBadges.push({
              badge_id: badge.id,
              badge_name: badge.name,
              newly_earned: true,
            })
          }
        }
      }

      res.json({
        points_awarded: result.points_awarded,
        total_points: result.total_points,
        new_badges: newBadges,
      })
    } catch (err) {
      logger.error('GamificationController.awardPoints error:', err)
      res.status(500).json({ error: 'Failed to award points' })
    }
  }

  /**
   * GET /gamification/points-history
   */
  async getPointsHistory(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const limit = Math.min(Number(req.query.limit) || 20, 50)
      const history = await this.storage.getPointsHistory(userId, limit)

      res.json({
        history,
        total: history.length,
      })
    } catch (err) {
      logger.error('GamificationController.getPointsHistory error:', err)
      res.status(500).json({ error: 'Failed to fetch points history' })
    }
  }

  /**
   * GET /gamification/badges
   */
  async getAllBadges(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const badges = await this.storage.getAllBadges()

      res.json({
        badges,
        total: badges.length,
      })
    } catch (err) {
      logger.error('GamificationController.getAllBadges error:', err)
      res.status(500).json({ error: 'Failed to fetch badges' })
    }
  }

  /**
   * GET /gamification/me/badges
   */
  async getUserBadges(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' })
        return
      }

      const badges = await this.storage.getUserBadges(userId)

      res.json({
        badges,
        total: badges.length,
      })
    } catch (err) {
      logger.error('GamificationController.getUserBadges error:', err)
      res.status(500).json({ error: 'Failed to fetch badges' })
    }
  }
}
