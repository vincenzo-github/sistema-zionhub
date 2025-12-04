'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { AuthResponse } from '@/types'

interface Church {
  id: string
  name: string
  email?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [churches, setChurches] = useState<Church[]>([])
  const [loadingChurches, setLoadingChurches] = useState(true)

  const [formData, setFormData] = useState({
    church_id: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    fetchChurches()
  }, [])

  const fetchChurches = async () => {
    try {
      const response = await api.get('/churches')
      const churchesData = response.data?.data || response.data || []
      setChurches(Array.isArray(churchesData) ? churchesData : [])
    } catch (err) {
      console.error('Erro ao carregar Igrejas:', err)
      setChurches([])
    } finally {
      setLoadingChurches(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔴 FORM SUBMIT CALLED - Button clicked!', { e, formData, loading, loadingChurches })
    e.preventDefault()
    setError('')

    console.log('🟡 Validações iniciadas')

    if (!formData.church_id) {
      console.log('❌ Validação falhou: sem church_id')
      setError('Selecione uma Igreja')
      return
    }
    if (!formData.full_name) {
      console.log('❌ Validação falhou: sem full_name')
      setError('Nome completo é obrigatório')
      return
    }
    if (!formData.email) {
      console.log('❌ Validação falhou: sem email')
      setError('Email é obrigatório')
      return
    }
    if (!formData.password) {
      console.log('❌ Validação falhou: sem password')
      setError('Senha é obrigatória')
      return
    }
    if (formData.password.length < 6) {
      console.log('❌ Validação falhou: password muito curta')
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      console.log('❌ Validação falhou: senhas não conferem')
      setError('As senhas não conferem')
      return
    }

    console.log('✅ Todas as validações passaram')
    setLoading(true)

    try {
      console.log('🚀 Enviando registro...', formData)
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', {
        church_id: formData.church_id,
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
      })

      console.log('✨ Resposta do registro:', response.data)

      const { user, token } = response.data.data

      setUser(user)
      setToken(token)

      console.log('🎉 Redirecionando para dashboard...')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('💥 Erro no registro:', err)
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Erro ao registrar'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">ZionHub</h1>
          <p className="text-gray-600">Criar Nova Conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecione sua Igreja
            </label>
            {loadingChurches ? (
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                Carregando Igrejas...
              </div>
            ) : churches.length === 0 ? (
              <div className="w-full px-4 py-2 border border-error-300 rounded-lg bg-error-50 text-error-600">
                Nenhuma Igreja disponível. 
                <Link href="/setup" className="underline font-semibold ml-1">
                  Criar uma
                </Link>
              </div>
            ) : (
              <select
                name="church_id"
                value={formData.church_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">-- Selecione uma Igreja --</option>
                {churches.map((church) => (
                  <option key={church.id} value={church.id}>
                    {church.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repita sua senha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || loadingChurches || churches.length === 0}
            className="w-full py-2 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-primary-800 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}