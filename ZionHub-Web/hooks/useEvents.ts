'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Event, EventFilters } from '@/types/event'

interface UseEventsOptions {
  filters?: EventFilters
  autoFetch?: boolean
}

export function useEvents(options: UseEventsOptions = {}) {
  const { filters, autoFetch = true } = options
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando eventos com filtros:', filters)

      const response = await api.get<{ success: boolean; data: Event[] }>(
        '/events',
        {
          params: {
            status: filters?.status && filters.status !== 'all' ? filters.status : undefined,
            ministry_id: filters?.ministry_id,
            startDate: filters?.start_date,
            endDate: filters?.end_date,
          },
        }
      )

      if (response.data.success) {
        setEvents(response.data.data || [])
        console.log('✅ Eventos carregados:', response.data.data?.length)
      } else {
        setError('Erro ao carregar eventos')
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar eventos:', err)
      setError(err.response?.data?.message || 'Erro ao carregar eventos')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createEvent = useCallback(async (data: any) => {
    try {
      setLoading(true)
      console.log('📝 Criando evento:', data)

      const response = await api.post<{ success: boolean; data: Event }>(
        '/events',
        data
      )

      if (response.data.success) {
        console.log('✅ Evento criado:', response.data.data)
        setEvents((prev) => [response.data.data, ...prev])
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getEvent = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('📥 Buscando evento:', id)

      const response = await api.get<{ success: boolean; data: Event }>(
        `/events/${id}`
      )

      if (response.data.success) {
        console.log('✅ Evento encontrado')
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateEvent = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true)
      console.log('📝 Atualizando evento:', id, data)

      const response = await api.put<{ success: boolean; data: Event }>(
        `/events/${id}`,
        data
      )

      if (response.data.success) {
        console.log('✅ Evento atualizado')
        setEvents((prev) =>
          prev.map((evt) => (evt.id === id ? response.data.data : evt))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteEvent = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('🗑️ Deletando evento:', id)

      await api.delete(`/events/${id}`)

      console.log('✅ Evento deletado')
      setEvents((prev) => prev.filter((evt) => evt.id !== id))
    } catch (err: any) {
      console.error('❌ Erro ao deletar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const publishEvent = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('📢 Publicando evento:', id)

      const response = await api.post<{ success: boolean; data: Event }>(
        `/events/${id}/publish`
      )

      if (response.data.success) {
        console.log('✅ Evento publicado')
        setEvents((prev) =>
          prev.map((evt) => (evt.id === id ? response.data.data : evt))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao publicar evento:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchEvents()
    }
  }, [filters, autoFetch, fetchEvents])

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
  }
}
