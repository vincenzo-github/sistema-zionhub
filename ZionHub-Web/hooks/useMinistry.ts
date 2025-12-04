'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/lib/api'
import { Ministry, MinistryFilters, CreateMinistryInput } from '@/types/ministry'

interface UseMinistryOptions {
  filters?: MinistryFilters
  autoFetch?: boolean
}

export function useMinistry(options: UseMinistryOptions = {}) {
  const { filters, autoFetch = true } = options
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMinistries = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando ministérios com filtros:', filters)

      const response = await api.get<{ success: boolean; data: Ministry[] }>(
        '/ministries',
        {
          params: {
            search: filters?.search,
          },
        }
      )

      if (response.data.success) {
        setMinistries(response.data.data || [])
        console.log('✅ Ministérios carregados:', response.data.data?.length)
      } else {
        setError('Erro ao carregar ministérios')
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar ministérios:', err)
      setError(err.response?.data?.message || 'Erro ao carregar ministérios')
      setMinistries([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createMinistry = useCallback(async (data: CreateMinistryInput) => {
    try {
      setLoading(true)
      console.log('📝 Criando ministério:', data)

      const response = await api.post<{ success: boolean; data: Ministry }>(
        '/ministries',
        data
      )

      if (response.data.success) {
        console.log('✅ Ministério criado:', response.data.data)
        setMinistries((prev) => [response.data.data, ...prev])
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao criar ministério:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getMinistry = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('📥 Buscando ministério:', id)

      const response = await api.get<{ success: boolean; data: Ministry }>(
        `/ministries/${id}`
      )

      if (response.data.success) {
        console.log('✅ Ministério encontrado')
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar ministério:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateMinistry = useCallback(async (id: string, data: Partial<CreateMinistryInput>) => {
    try {
      setLoading(true)
      console.log('📝 Atualizando ministério:', id, data)

      const response = await api.put<{ success: boolean; data: Ministry }>(
        `/ministries/${id}`,
        data
      )

      if (response.data.success) {
        console.log('✅ Ministério atualizado')
        setMinistries((prev) =>
          prev.map((m) => (m.id === id ? response.data.data : m))
        )
        return response.data.data
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar ministério:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteMinistry = useCallback(async (id: string) => {
    try {
      setLoading(true)
      console.log('🗑️ Deletando ministério:', id)

      await api.delete(`/ministries/${id}`)

      console.log('✅ Ministério deletado')
      setMinistries((prev) => prev.filter((m) => m.id !== id))
    } catch (err: any) {
      console.error('❌ Erro ao deletar ministério:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) {
      fetchMinistries()
    }
  }, [filters, autoFetch, fetchMinistries])

  return {
    ministries,
    loading,
    error,
    refetch: fetchMinistries,
    createMinistry,
    getMinistry,
    updateMinistry,
    deleteMinistry,
  }
}
