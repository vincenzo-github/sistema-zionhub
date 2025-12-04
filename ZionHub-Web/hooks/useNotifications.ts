'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Notification, NotificationFilters } from '@/types/notification'

interface UseNotificationsOptions {
  filters?: NotificationFilters
  autoFetch?: boolean
  refetchInterval?: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { filters, autoFetch = true, refetchInterval = 30000 } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando notificações')

      const params: any = {}
      if (filters?.is_read !== undefined) params.is_read = filters.is_read
      if (filters?.type) params.type = filters.type

      const response = await api.get<{ success: boolean; data: Notification[] }>(
        '/notifications',
        { params }
      )

      if (response.data.success) {
        setNotifications(response.data.data || [])
        console.log('✅ Notificações carregadas:', response.data.data?.length)
      } else {
        setError('Erro ao carregar notificações')
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar notificações:', err)
      setError(err.response?.data?.message || 'Erro ao carregar notificações')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const getUnreadCount = useCallback(async () => {
    try {
      const response = await api.get<{ success: boolean; data: { count: number } }>(
        '/notifications/unread-count'
      )

      if (response.data.success) {
        return response.data.data.count
      }
      return 0
    } catch (err: any) {
      console.error('❌ Erro ao contar não lidas:', err)
      return 0
    }
  }, [])

  const markAsRead = useCallback(async (id: string) => {
    try {
      console.log('📝 Marcando como lida:', id)

      await api.put(`/notifications/${id}/read`)

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
        )
      )

      console.log('✅ Marcada como lida')
    } catch (err: any) {
      console.error('❌ Erro ao marcar como lida:', err)
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      console.log('📝 Marcando todas como lidas')

      await api.put('/notifications/read-all')

      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          is_read: true,
          read_at: new Date().toISOString(),
        }))
      )

      console.log('✅ Todas marcadas como lidas')
    } catch (err: any) {
      console.error('❌ Erro ao marcar todas como lidas:', err)
    }
  }, [])

  const deleteNotification = useCallback(async (id: string) => {
    try {
      console.log('🗑️ Deletando notificação:', id)

      await api.delete(`/notifications/${id}`)

      setNotifications((prev) => prev.filter((n) => n.id !== id))

      console.log('✅ Notificação deletada')
    } catch (err: any) {
      console.error('❌ Erro ao deletar notificação:', err)
    }
  }, [])

  // Auto-fetch com intervalo
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications()

      const interval = setInterval(() => {
        fetchNotifications()
      }, refetchInterval)

      return () => clearInterval(interval)
    }
  }, [autoFetch, refetchInterval, fetchNotifications])

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
