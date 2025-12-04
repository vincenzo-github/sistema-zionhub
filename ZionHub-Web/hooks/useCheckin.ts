import { useState } from 'react'
import { CheckinInput, CheckoutInput } from '@/types/checkin'
import api from '@/lib/api'

interface UseCheckinReturn {
  checkIn: (data: CheckinInput) => Promise<void>
  checkOut: (data: CheckoutInput) => Promise<void>
  isLoading: boolean
  error: string | null
  success: boolean
}

export function useCheckin(): UseCheckinReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const checkIn = async (data: CheckinInput) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      await api.post(`/checkin/${data.event_id}/checkin`, {
        qrcode_data: data.qrcode_data,
      })

      setSuccess(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar check-in'
      setError(errorMessage)
      setSuccess(false)
      console.error('Check-in failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const checkOut = async (data: CheckoutInput) => {
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      await api.post(`/checkin/${data.event_id}/checkout`)

      setSuccess(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar check-out'
      setError(errorMessage)
      setSuccess(false)
      console.error('Check-out failed:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    checkIn,
    checkOut,
    isLoading,
    error,
    success,
  }
}
