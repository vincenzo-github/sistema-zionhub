'use client'

import { useState, useCallback } from 'react'
import api from '@/lib/api'
import { ChurchSettings, UserProfile, UpdateChurchInput, UpdateProfileInput } from '@/types/settings'

export function useSettings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Church Settings
  const getChurchSettings = useCallback(async (): Promise<ChurchSettings | null> => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando configurações da igreja')

      const response = await api.get<{ success: boolean; data: ChurchSettings }>(
        '/churches'
      )

      if (response.data.success) {
        console.log('✅ Configurações carregadas')
        return response.data.data
      } else {
        setError('Erro ao carregar configurações')
        return null
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar configurações:', err)
      setError(err.response?.data?.message || 'Erro ao carregar configurações')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateChurchSettings = useCallback(async (data: UpdateChurchInput): Promise<ChurchSettings | null> => {
    try {
      setLoading(true)
      setError(null)
      console.log('📝 Atualizando configurações da igreja:', data)

      const response = await api.put<{ success: boolean; data: ChurchSettings }>(
        '/churches',
        data
      )

      if (response.data.success) {
        console.log('✅ Configurações atualizadas')
        return response.data.data
      } else {
        setError('Erro ao atualizar configurações')
        return null
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar configurações:', err)
      setError(err.response?.data?.message || 'Erro ao atualizar configurações')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // User Profile
  const getUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    try {
      setLoading(true)
      setError(null)
      console.log('📥 Buscando perfil do usuário')

      const response = await api.get<{ success: boolean; data: UserProfile }>(
        '/users/profile'
      )

      if (response.data.success) {
        console.log('✅ Perfil carregado')
        return response.data.data
      } else {
        setError('Erro ao carregar perfil')
        return null
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar perfil:', err)
      setError(err.response?.data?.message || 'Erro ao carregar perfil')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserProfile = useCallback(async (data: UpdateProfileInput): Promise<UserProfile | null> => {
    try {
      setLoading(true)
      setError(null)
      console.log('📝 Atualizando perfil:', data)

      const response = await api.put<{ success: boolean; data: UserProfile }>(
        '/users/profile',
        data
      )

      if (response.data.success) {
        console.log('✅ Perfil atualizado')
        return response.data.data
      } else {
        setError('Erro ao atualizar perfil')
        return null
      }
    } catch (err: any) {
      console.error('❌ Erro ao atualizar perfil:', err)
      setError(err.response?.data?.message || 'Erro ao atualizar perfil')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getChurchSettings,
    updateChurchSettings,
    getUserProfile,
    updateUserProfile,
  }
}
