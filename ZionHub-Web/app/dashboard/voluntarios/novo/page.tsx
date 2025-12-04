'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useVolunteers } from '@/hooks/useVolunteers'
import { CreateVolunteerInput } from '@/types/volunteer'

export default function NovoVoluntarioPage() {
  const router = useRouter()
  const { createVolunteer, loading, error } = useVolunteers({
    autoFetch: false,
  })

  const [formData, setFormData] = useState<CreateVolunteerInput>({
    full_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    bio: '',
    position: '',
    skills: [],
    ministries: [],
    preferred_roles: [],
  })

  const [submitError, setSubmitError] = useState<string | null>(null)

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

    try {
      await createVolunteer(formData)
      router.push('/dashboard/voluntarios')
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao criar voluntário')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dashboard/voluntarios" className="text-primary-600 hover:text-primary-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Novo Voluntário</h1>
          <p className="text-gray-600">
            Preencha as informações abaixo para registrar um novo voluntário
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {(submitError || error) && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao criar voluntário</h3>
              <p className="text-sm text-red-700">{submitError || error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="joao@email.com"
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
                  Posição/Cargo
                </label>
                <input
                  type="text"
                  name="position"
                  value={formData.position || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="ex: Guitarrista, Vocalista"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Biografia
              </label>
              <textarea
                name="bio"
                value={formData.bio || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                placeholder="Descreva um pouco sobre o voluntário..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard/voluntarios" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar Voluntário'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
