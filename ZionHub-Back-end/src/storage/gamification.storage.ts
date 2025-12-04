import { supabase } from '../config/supabase'
import { logger } from '../config/logger'

export class GamificationStorage {
  /**
   * Obtém stats de gamificação do usuário
   */
  async getUserStats(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || {
        user_id: userId,
        total_points: 0,
        current_rank: 6,
        badges_earned: 0,
        events_attended: 0,
        updated_at: new Date().toISOString(),
      }
    } catch (err) {
      logger.error('GamificationStorage.getUserStats error:', err)
      throw err
    }
  }

  /**
   * Cria ou atualiza stats do usuário
   */
  async upsertUserStats(userId: string, data: any) {
    try {
      const { data: result, error } = await supabase
        .from('user_gamification')
        .upsert(
          {
            user_id: userId,
            ...data,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single()

      if (error) throw error
      return result
    } catch (err) {
      logger.error('GamificationStorage.upsertUserStats error:', err)
      throw err
    }
  }

  /**
   * Obtém leaderboard com ranking
   */
  async getLeaderboard(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select(`*`)
        .order('total_points', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return (data || []).map((item: any, index: number) => ({
        rank: offset + index + 1,
        user_id: item.user_id,
        total_points: item.total_points,
        current_rank: item.current_rank,
        badges_earned: item.badges_earned,
        events_attended: item.events_attended,
      }))
    } catch (err) {
      logger.error('GamificationStorage.getLeaderboard error:', err)
      throw err
    }
  }

  /**
   * Obtém posição do usuário no leaderboard
   */
  async getUserLeaderboardPosition(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('total_points')
        .order('total_points', { ascending: false })

      if (error) throw error

      const position = (data || []).findIndex((u: any) => u.user_id === userId)
      return position >= 0 ? position + 1 : null
    } catch (err) {
      logger.error('GamificationStorage.getUserLeaderboardPosition error:', err)
      throw err
    }
  }

  /**
   * Adiciona pontos ao usuário
   */
  async awardPoints(
    userId: string,
    eventId: string,
    points: number,
    reason: string
  ) {
    try {
      const { error: historyError } = await supabase
        .from('points_history')
        .insert({
          user_id: userId,
          event_id: eventId,
          points_awarded: points,
          reason,
          created_at: new Date().toISOString(),
        })

      if (historyError) throw historyError

      const currentStats = await this.getUserStats(userId)
      const newTotalPoints = currentStats.total_points + points

      await this.upsertUserStats(userId, {
        total_points: newTotalPoints,
      })

      logger.info(
        `Points awarded to user ${userId}: +${points} (reason: ${reason})`
      )

      return { points_awarded: points, total_points: newTotalPoints }
    } catch (err) {
      logger.error('GamificationStorage.awardPoints error:', err)
      throw err
    }
  }

  /**
   * Obtém histórico de pontos do usuário
   */
  async getPointsHistory(userId: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('points_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        event_id: item.event_id,
        points_awarded: item.points_awarded,
        reason: item.reason,
        created_at: item.created_at,
      }))
    } catch (err) {
      logger.error('GamificationStorage.getPointsHistory error:', err)
      throw err
    }
  }

  /**
   * Obtém badges do usuário
   */
  async getUserBadges(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false })

      if (error) throw error

      return (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        badge_id: item.badge_id,
        earned_at: item.earned_at,
      }))
    } catch (err) {
      logger.error('GamificationStorage.getUserBadges error:', err)
      throw err
    }
  }

  /**
   * Atribui badge ao usuário
   */
  async awardBadge(userId: string, badgeId: string) {
    try {
      const { data: existing } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', userId)
        .eq('badge_id', badgeId)
        .single()

      if (existing) return { newly_earned: false }

      const { error: insertError } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          earned_at: new Date().toISOString(),
        })

      if (insertError) throw insertError

      const stats = await this.getUserStats(userId)
      await this.upsertUserStats(userId, {
        badges_earned: stats.badges_earned + 1,
      })

      logger.info(`Badge awarded to user ${userId}: ${badgeId}`)
      return { newly_earned: true }
    } catch (err) {
      logger.error('GamificationStorage.awardBadge error:', err)
      throw err
    }
  }

  /**
   * Obtém todos os badges disponíveis
   */
  async getAllBadges() {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('points_required', { ascending: true })

      if (error) throw error
      return data || []
    } catch (err) {
      logger.error('GamificationStorage.getAllBadges error:', err)
      throw err
    }
  }

  /**
   * Incrementa eventos assistidos
   */
  async incrementEventsAttended(userId: string) {
    try {
      const stats = await this.getUserStats(userId)
      await this.upsertUserStats(userId, {
        events_attended: stats.events_attended + 1,
      })

      return { events_attended: stats.events_attended + 1 }
    } catch (err) {
      logger.error('GamificationStorage.incrementEventsAttended error:', err)
      throw err
    }
  }
}
