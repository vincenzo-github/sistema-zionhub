'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Volunteer, VolunteerFilters } from '@/types/volunteer'

interface UseVolunteersOptions {
  filters?: VolunteerFilters
  autoFetch?: boolean
}

export function useVolunteers(options: UseVolunteersOptions = {}) {
  const { filters, autoFetch = true } = options
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVolunteers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando voluntários com filtros:', filters)

      const response = await api.get<{ success: boolean; data: Volunteer[] }>(
        '/volunteers',
        {
          params: {
            search: filters?.search,
          },
        }
      )

      if (response.data.success) {
        setVolunteers(response.data.data || [])
        console.log('✅ Voluntários carregados:', response.data.data?.length)
      } else {
        setError('Erro ao carregar voluntários')
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar voluntários:', err)
      setError(err.response?.data?.message || 'Erro ao carregar voluntários')
      setVolunteers([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createVolunteer = useCallback(async (data: any) => {
    try {
      setLoading(true)
      console.log('📝 Criando voluntário:', data)

      const response = await api.post<{ success: boolean; data: Volunteer }>(
        '/volunteers',
        data
      )

      if (response.data.success) {
        console.log('✅ Voluntário criado:', response.data.data)
        setVolunteers((prev) => [response.data.data, ...prev])
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar voluntário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getVolunteer = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('📥 Buscando voluntário:', id)

      const response = await api.get<{ success: boolean; data: Volunteer }>(
        `/volunteers/${id}`
      )

      if (response.data.success) {
        console.log('✅ Voluntário encontrado')
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar voluntário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateVolunteer = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true)
      console.log('📝 Atualizando voluntário:', id, data)

      const response = await api.put<{ success: boolean; data: Volunteer }>(
        `/volunteers/${id}`,
        data
      )

      if (response.data.success) {
        console.log('✅ Voluntário atualizado')
        setVolunteers((prev) =>
          prev.map((vol) => (vol.id === id ? response.data.data : vol))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar voluntário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const activateVolunteer = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('✅ Ativando voluntário:', id)

      const response = await api.post<{ success: boolean; data: Volunteer }>(
        `/volunteers/${id}/activate`
      )

      if (response.data.success) {
        console.log('✅ Voluntário ativado')
        setVolunteers((prev) =>
          prev.map((vol) => (vol.id === id ? response.data.data : vol))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao ativar voluntário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deactivateVolunteer = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('❌ Desativando voluntário:', id)

      const response = await api.post<{ success: boolean; data: Volunteer }>(
        `/volunteers/${id}/deactivate`
      )

      if (response.data.success) {
        console.log('✅ Voluntário desativado')
        setVolunteers((prev) =>
          prev.map((vol) => (vol.id === id ? response.data.data : vol))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao desativar voluntário:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchVolunteers()
    }
  }, [filters, autoFetch, fetchVolunteers])

  return {
    volunteers,
    loading,
    error,
    refetch: fetchVolunteers,
    createVolunteer,
    getVolunteer,
    updateVolunteer,
    activateVolunteer,
    deactivateVolunteer,
  }
}
