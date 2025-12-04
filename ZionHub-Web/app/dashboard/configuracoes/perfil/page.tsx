'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/hooks/useSettings'
import { UserProfile, UpdateProfileInput } from '@/types/settings'

export default function PerfilPage() {
  const { loading, error, getUserProfile, updateUserProfile } = useSettings()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState<UpdateProfileInput>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile()
      if (data) {
        setUser(data)
        setFormData({
          full_name: data.full_name,
          phone: data.phone,
          whatsapp: data.whatsapp,
          position: data.position,
        })
      }
    }

    fetchProfile()
  }, [getUserProfile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)
    setIsSubmitting(true)

    try {
      const result = await updateUserProfile(formData)
      if (result) {
        setUser(result)
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError('Erro ao salvar perfil')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao salvar perfil')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      master: 'Administrador',
      leader_ministry: 'Líder de Ministério',
      leader_dept: 'Líder de Departamento',
      member: 'Membro',
    }
    return labels[role] || role
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Meu Perfil</h2>
        <p className="text-gray-600">
          Atualize suas informações pessoais
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar perfil</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <Card className="border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
            <div>
              <h3 className="font-semibold text-green-900">Sucesso!</h3>
              <p className="text-sm text-green-700">Perfil atualizado com sucesso</p>
            </div>
          </div>
        </Card>
      )}

      {/* Submit Error */}
      {submitError && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao salvar</h3>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Form */}
      {!loading && user && (
        <>
          {/* User Info Card */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="space-y-2">
              <p className="text-sm text-primary-600">Seu E-mail</p>
              <p className="text-lg font-semibold">{user.email}</p>
              <div className="flex gap-2 mt-4">
                <Badge className="bg-primary-600 text-white">
                  {getRoleLabel(user.role)}
                </Badge>
                {user.is_master && (
                  <Badge className="bg-red-600 text-white">Administrador</Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Edit Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name || ''}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Posição/Cargo
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                      placeholder="ex: Pastor, Guitarrista"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        WhatsApp
                      </label>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp || ''}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4">Informações da Conta</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold capitalize">{user.status}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Último Acesso</p>
                    <p className="text-lg font-semibold">
                      {user.last_login
                        ? new Date(user.last_login).toLocaleDateString('pt-BR')
                        : 'Nunca'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 border-t pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  )
}
