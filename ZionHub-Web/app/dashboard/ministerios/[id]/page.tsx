'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertCircle, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ministry } from '@/types/ministry'
import { useMinistry } from '@/hooks/useMinistry'

export default function MinisterioDetalhePage() {
  const params = useParams()
  const ministryId = params.id as string
  const [ministry, setMinistry] = useState<Ministry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getMinistry } = useMinistry({
    autoFetch: false,
  })

  useEffect(() => {
    const fetchMinistry = async () => {
      try {
        const data = await getMinistry(ministryId)
        setMinistry(data || null)
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar ministério')
      } finally {
        setLoading(false)
      }
    }

    fetchMinistry()
  }, [ministryId, getMinistry])

  if (loading) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/ministerios" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>
        <Card className="p-12 text-center">
          <div className="h-10 w-10 mx-auto animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600">Carregando ministério...</p>
        </Card>
      </div>
    )
  }

  if (error || !ministry) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/ministerios" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>
        <Card className="border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Erro ao carregar ministério</h3>
          <p className="mb-4 text-red-700">{error || 'Ministério não encontrado'}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard/ministerios" className="flex items-center gap-2 text-primary-600 hover:text-primary-700">
          <ArrowLeft className="h-5 w-5" />
          Voltar
        </Link>
        <div className="flex gap-2">
          <Link href={`/dashboard/ministerios/${ministry.id}/editar`}>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Ministry Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between gap-6">
          {ministry.color && (
            <div
              className="h-24 w-24 rounded-lg border-4 border-gray-200 flex-shrink-0"
              style={{ backgroundColor: ministry.color }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{ministry.name}</h1>
            <div className="mt-2 flex gap-2">
              {ministry.is_default && (
                <Badge className="bg-blue-100 text-blue-800">Padrão</Badge>
              )}
            </div>
            {ministry.description && (
              <p className="mt-4 text-gray-700">{ministry.description}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary-600">{ministry.total_volunteers || 0}</p>
          <p className="text-gray-600">Voluntários</p>
        </Card>
        <Card className="p-6 text-center">
          <p className="text-3xl font-bold text-primary-600">{ministry.total_departments || 0}</p>
          <p className="text-gray-600">Departamentos</p>
        </Card>
      </div>

      {/* Ministry Info */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Criado em:</span>
              <span className="font-medium">
                {new Date(ministry.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última atualização:</span>
              <span className="font-medium">
                {new Date(ministry.updated_at).toLocaleDateString('pt-BR')}
              </span>
            </div>
            {ministry.leader_name && (
              <div className="flex justify-between">
                <span className="text-gray-600">Líder:</span>
                <span className="font-medium">{ministry.leader_name}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
