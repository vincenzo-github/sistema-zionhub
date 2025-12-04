'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Create Church, 2: Create Admin User
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [churchData, setChurchData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  const [userData, setUserData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [churchId, setChurchId] = useState('')

  const handleChurchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChurchData({
      ...churchData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateChurch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/churches', churchData)
      setChurchId(response.data.id)
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar Igreja')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (userData.password !== userData.confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    if (userData.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      await api.post('/auth/register', {
        church_id: churchId,
        full_name: userData.full_name,
        email: userData.email,
        password: userData.password,
        is_master: true,
      })

      router.push('/login')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar usuário')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">ZionHub</h1>
          <p className="text-gray-600">Setup Inicial</p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreateChurch} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Igreja</h2>

            {error && (
              <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Igreja
              </label>
              <input
                type="text"
                name="name"
                value={churchData.name}
                onChange={handleChurchChange}
                placeholder="Ex: Igreja Zion do Bom Fim"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email da Igreja
              </label>
              <input
                type="email"
                name="email"
                value={churchData.email}
                onChange={handleChurchChange}
                placeholder="contato@igreja.com.br"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (Opcional)
              </label>
              <input
                type="tel"
                name="phone"
                value={churchData.phone}
                onChange={handleChurchChange}
                placeholder="(11) 98765-4321"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço (Opcional)
              </label>
              <input
                type="text"
                name="address"
                value={churchData.address}
                onChange={handleChurchChange}
                placeholder="Rua das Flores, 123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Criando...' : 'Próximo'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Criar Conta Admin</h2>

            {error && (
              <div className="bg-error-100 text-error-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                name="full_name"
                value={userData.full_name}
                onChange={handleUserChange}
                placeholder="João Silva"
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
                value={userData.email}
                onChange={handleUserChange}
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
                value={userData.password}
                onChange={handleUserChange}
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
                value={userData.confirmPassword}
                onChange={handleUserChange}
                placeholder="Repita sua senha"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-primary-800 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Finalizando...' : 'Finalizar Setup'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}