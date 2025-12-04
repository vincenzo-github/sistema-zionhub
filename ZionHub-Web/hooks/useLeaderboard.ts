import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { LeaderboardEntry } from '@/types/gamification'

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useLeaderboard(autoRefresh: boolean = true): UseLeaderboardReturn {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get('/gamification/leaderboard')
      setEntries(response.data)
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err)
      setError(err.response?.data?.error || 'Erro ao carregar ranking')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeaderboard()

    // Auto-refresh every 30 seconds if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchLeaderboard()
      }, 30000)

      return () => clearInterval(interval)
    }
  }, [fetchLeaderboard, autoRefresh])

  return {
    entries,
    loading,
    error,
    refetch: fetchLeaderboard,
  }
}
