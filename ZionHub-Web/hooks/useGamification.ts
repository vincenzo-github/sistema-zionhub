import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Badge, UserBadge, GamificationStats } from '@/types/gamification'

interface UseGamificationReturn {
  stats: GamificationStats | null
  allBadges: Badge[]
  userBadges: UserBadge[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useGamification(): UseGamificationReturn {
  const [stats, setStats] = useState<GamificationStats | null>(null)
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user stats
      const statsResponse = await api.get('/gamification/me')
      setStats(statsResponse.data)

      // Fetch all badges
      const badgesResponse = await api.get('/gamification/badges')
      setAllBadges(badgesResponse.data)

      // Fetch user badges
      const userBadgesResponse = await api.get('/gamification/me/badges')
      setUserBadges(userBadgesResponse.data)
    } catch (err: any) {
      console.error('Error fetching gamification data:', err)
      setError(err.response?.data?.error || 'Erro ao carregar dados de gamificação')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    stats,
    allBadges,
    userBadges,
    loading,
    error,
    refetch: fetchData,
  }
}
