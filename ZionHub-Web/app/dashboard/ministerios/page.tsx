'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, AlertCircle, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MinistryFilters as Filters } from '@/types/ministry'
import { useMinistry } from '@/hooks/useMinistry'

export default function MinisteriosPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '',
  })

  // Fetch ministries from API
  const { ministries, loading, error } = useMinistry({
    filters,
    autoFetch: true,
  })

  // Filtrar ministérios por busca
  const filteredMinistries = ministries.filter((ministry) => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return ministry.name.toLowerCase().includes(search)
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ministérios</h1>
          <p className="text-gray-600">
            Gerencie os ministérios da sua igreja
          </p>
        </div>

        <Link href="/dashboard/ministerios/novo">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Ministério
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {filteredMinistries.length} ministério(s) encontrado(s)
        </p>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Carregando ministérios...</h3>
          <p className="text-gray-600">Por favor, aguarde</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Erro ao carregar ministérios</h3>
          <p className="mb-4 text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredMinistries.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <BookOpen className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum ministério encontrado</h3>
          <p className="mb-4 text-gray-600">
            Crie o primeiro ministério para começar
          </p>
          <Link href="/dashboard/ministerios/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Ministério
            </Button>
          </Link>
        </Card>
      ) : (
        !loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredMinistries.map((ministry) => (
              <Link
                key={ministry.id}
                href={`/dashboard/ministerios/${ministry.id}`}
                className="transition-transform hover:scale-105"
              >
                <Card className="h-full p-6 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{ministry.name}</h3>
                      {ministry.is_default && (
                        <Badge className="mt-1 bg-blue-100 text-blue-800">Padrão</Badge>
                      )}
                    </div>
                    {ministry.color && (
                      <div
                        className="h-12 w-12 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: ministry.color }}
                      />
                    )}
                  </div>

                  {ministry.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {ministry.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 border-t pt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        {ministry.total_volunteers || 0}
                      </p>
                      <p className="text-xs text-gray-600">Voluntários</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary-600">
                        {ministry.total_departments || 0}
                      </p>
                      <p className="text-xs text-gray-600">Departamentos</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
