'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'
import { AuthResponse } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔴 FORM SUBMIT CALLED - Login button clicked!', { formData, loading })
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🚀 Enviando login...', formData)
      const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', formData)

      console.log('✨ Resposta do login:', response.data)
      const { user, token } = response.data.data

      setUser(user)
      setToken(token)

      console.log('🎉 Redirecionando para dashboard...')
      router.push('/dashboard')
    } catch (err: any) {
      console.error('💥 Erro no login:', err)
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Erro ao fazer login'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">ZionHub</h1>
          <p className="text-gray-600">Gestão de Escalas e Eventos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
              placeholder="Sua senha"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Não tem uma conta?{' '}
          <Link href="/register" className="text-primary-800 font-semibold hover:underline">
            Criar agora
          </Link>
        </p>
      </div>
    </div>
  )
}