'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSettings } from '@/hooks/useSettings'
import { ChurchSettings, UpdateChurchInput } from '@/types/settings'

export default function ConfiguracoesPage() {
  const { loading, error, getChurchSettings, updateChurchSettings } = useSettings()
  const [church, setChurch] = useState<ChurchSettings | null>(null)
  const [formData, setFormData] = useState<UpdateChurchInput>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getChurchSettings()
      if (data) {
        setChurch(data)
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          address: data.address,
        })
      }
    }

    fetchSettings()
  }, [getChurchSettings])

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
      const result = await updateChurchSettings(formData)
      if (result) {
        setChurch(result)
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        setSubmitError('Erro ao salvar configurações')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao salvar configurações')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Configurações da Igreja</h2>
        <p className="text-gray-600">
          Gerencie as informações da sua congregação
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Carregando configurações...</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao carregar configurações</h3>
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
              <p className="text-sm text-green-700">Configurações salvas com sucesso</p>
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
      {!loading && church && (
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Church Info */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações da Igreja</h2>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Nome da Igreja *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                    placeholder="Nome da sua igreja"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                      placeholder="contato@igreja.com"
                    />
                  </div>

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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Endereço
                  </label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                    placeholder="Rua, número, bairro, cidade..."
                  />
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Informações do Plano</h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Plano Atual</p>
                  <p className="text-lg font-semibold capitalize">{church.plan_id}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold capitalize">{church.status}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Configuração</p>
                  <p className="text-lg font-semibold">
                    {church.setup_completed ? 'Completa' : 'Pendente'}
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
      )}
    </div>
  )
}
