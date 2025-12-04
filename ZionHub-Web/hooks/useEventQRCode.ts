import { useState, useEffect } from 'react'
import { EventQRCode } from '@/types/checkin'
import api from '@/lib/api'

interface UseEventQRCodeReturn {
  qrCode: EventQRCode | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEventQRCode(eventId: string): UseEventQRCodeReturn {
  const [qrCode, setQrCode] = useState<EventQRCode | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQRCode = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await api.get(`/checkin/${eventId}/qrcode`)
      setQrCode(response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar QR Code'
      setError(errorMessage)
      console.error('Failed to fetch QR code:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) {
      fetchQRCode()
    }
  }, [eventId])

  return {
    qrCode,
    isLoading,
    error,
    refetch: fetchQRCode,
  }
}
