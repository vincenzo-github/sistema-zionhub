import { logger } from '../config/logger'

export class GamificationService {
  /**
   * Ponto base por assistência em evento
   */
  private readonly BASE_POINTS = 50

  /**
   * Multiplicadores de pontos baseado em duração
   */
  private readonly POINT_MULTIPLIERS = {
    short: 1.0, // 0-1 hora
    medium: 1.5, // 1-3 horas
    long: 2.0, // 3+ horas
  }

  /**
   * Calcula pontos baseado na duração da participação
   */
  calculatePoints(durationMinutes: number): number {
    try {
      const hours = durationMinutes / 60
      let multiplier = this.POINT_MULTIPLIERS.short

      if (hours >= 3) {
        multiplier = this.POINT_MULTIPLIERS.long
      } else if (hours >= 1) {
        multiplier = this.POINT_MULTIPLIERS.medium
      }

      const points = Math.round(this.BASE_POINTS * multiplier)
      return points
    } catch (err) {
      logger.error('GamificationService.calculatePoints error:', err)
      return this.BASE_POINTS
    }
  }

  /**
   * Calcula rank baseado em pontos totais
   */
  calculateRank(totalPoints: number): number {
    try {
      // Ranks por faixa de pontos
      const ranks = [
        { minPoints: 10000, rank: 1 }, // Diamante
        { minPoints: 5000, rank: 2 }, // Platina
        { minPoints: 2000, rank: 3 }, // Ouro
        { minPoints: 500, rank: 4 }, // Prata
        { minPoints: 100, rank: 5 }, // Bronze
        { minPoints: 0, rank: 6 }, // Iniciante
      ]

      const rankData = ranks.find(r => totalPoints >= r.minPoints)
      return rankData ? rankData.rank : 6
    } catch (err) {
      logger.error('GamificationService.calculateRank error:', err)
      return 6
    }
  }

  /**
   * Retorna nome do rank
   */
  getRankName(rank: number): string {
    const rankNames: { [key: number]: string } = {
      1: 'Diamante',
      2: 'Platina',
      3: 'Ouro',
      4: 'Prata',
      5: 'Bronze',
      6: 'Iniciante',
    }
    return rankNames[rank] || 'Iniciante'
  }

  /**
   * Retorna intervalo de pontos para próximo rank
   */
  getNextRankThreshold(currentRank: number): number {
    const thresholds: { [key: number]: number } = {
      6: 100, // Iniciante -> Bronze
      5: 500, // Bronze -> Prata
      4: 2000, // Prata -> Ouro
      3: 5000, // Ouro -> Platina
      2: 10000, // Platina -> Diamante
      1: 10000, // Diamante (máximo)
    }
    return thresholds[currentRank] || 0
  }

  /**
   * Verifica se usuário desbloqueou novo badge
   */
  checkBadgeEarned(
    totalPoints: number,
    badgePointsRequired: number
  ): boolean {
    try {
      return totalPoints >= badgePointsRequired
    } catch (err) {
      logger.error('GamificationService.checkBadgeEarned error:', err)
      return false
    }
  }

  /**
   * Retorna emoji/ícone do rank
   */
  getRankEmoji(rank: number): string {
    const emojis: { [key: number]: string } = {
      1: '💎', // Diamante
      2: '🥈', // Platina (prata)
      3: '🥇', // Ouro
      4: '⭐', // Prata (estrela)
      5: '🔶', // Bronze
      6: '📍', // Iniciante
    }
    return emojis[rank] || '📍'
  }

  /**
   * Gera relatório de gamificação do usuário
   */
  generateGameReport(userData: {
    totalPoints: number
    badges: any[]
    eventsAttended: number
  }): {
    rankName: string
    rankEmoji: string
    percentToNextRank: number
  } {
    try {
      const rank = this.calculateRank(userData.totalPoints)
      const rankName = this.getRankName(rank)
      const rankEmoji = this.getRankEmoji(rank)

      // Calcula progresso para próximo rank
      const currentThreshold = this.getNextRankThreshold(rank)
      const previousThreshold = rank > 1 ? this.getNextRankThreshold(rank - 1) : 0
      const pointsInRange = currentThreshold - previousThreshold
      const pointsEarned = userData.totalPoints - previousThreshold
      const percentToNextRank = Math.min(
        Math.round((pointsEarned / pointsInRange) * 100),
        100
      )

      return {
        rankName,
        rankEmoji,
        percentToNextRank,
      }
    } catch (err) {
      logger.error('GamificationService.generateGameReport error:', err)
      return {
        rankName: 'Iniciante',
        rankEmoji: '📍',
        percentToNextRank: 0,
      }
    }
  }
}
