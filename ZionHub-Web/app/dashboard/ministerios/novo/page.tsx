'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useMinistry } from '@/hooks/useMinistry'
import { CreateMinistryInput } from '@/types/ministry'

const COLORS = [
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12',
  '#9B59B6',
  '#1ABC9C',
  '#34495E',
  '#E67E22',
]

export default function NovoMinisterioPage() {
  const router = useRouter()
  const { createMinistry, loading, error } = useMinistry({
    autoFetch: false,
  })

  const [formData, setFormData] = useState<CreateMinistryInput>({
    name: '',
    description: '',
    color: COLORS[0],
    icon: '📚',
    leader_id: '',
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
      await createMinistry(formData)
      router.push('/dashboard/ministerios')
    } catch (err: any) {
      setSubmitError(err.message || 'Erro ao criar ministério')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href="/dashboard/ministerios" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Novo Ministério</h1>
        <p className="text-gray-600">
          Preencha as informações abaixo para criar um novo ministério
        </p>
      </div>

      {/* Error Alert */}
      {(submitError || error) && (
        <Card className="border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Erro ao criar ministério</h3>
              <p className="text-sm text-red-700">{submitError || error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nome do Ministério *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="ex: Louvor e Adoração"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
                  placeholder="Descreva o ministério..."
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cor do Ministério
                </label>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`h-10 w-10 rounded-lg border-2 transition-all ${
                        formData.color === color
                          ? 'border-gray-400 ring-2 ring-primary-500'
                          : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Link href="/dashboard/ministerios" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Criar Ministério'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}
