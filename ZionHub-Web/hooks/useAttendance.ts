import { useState, useEffect } from 'react'
import { AttendanceRecord } from '@/types/checkin'
import api from '@/lib/api'

interface UseAttendanceReturn {
  attendees: AttendanceRecord[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAttendance(
  eventId: string,
  autoRefreshInterval = 10000
): UseAttendanceReturn {
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAttendance = async () => {
    try {
      setError(null)

      const response = await api.get(`/checkin/${eventId}/attendance`)
      setAttendees(response.data.attendees || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar presença'
      setError(errorMessage)
      console.error('Failed to fetch attendance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!eventId) return

    // Initial fetch
    fetchAttendance()

    // Set up auto-refresh interval
    const intervalId = setInterval(fetchAttendance, autoRefreshInterval)

    return () => clearInterval(intervalId)
  }, [eventId, autoRefreshInterval])

  return {
    attendees,
    isLoading,
    error,
    refetch: fetchAttendance,
  }
}
