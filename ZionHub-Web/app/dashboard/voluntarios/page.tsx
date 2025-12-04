'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List as ListIcon, Users, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { VolunteerFilters as Filters } from '@/types/volunteer'
import { useVolunteers } from '@/hooks/useVolunteers'
import Link from 'next/link'

export default function VoluntariosPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    search: '',
  })

  // Fetch volunteers from API
  const { volunteers, loading, error } = useVolunteers({
    filters,
    autoFetch: true,
  })

  // Filtrar voluntários por busca
  const filteredVolunteers = volunteers.filter((volunteer) => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        volunteer.full_name.toLowerCase().includes(search) ||
        volunteer.email.toLowerCase().includes(search)
      )
    }
    return true
  })

  const handleEdit = (id: string) => {
    console.log('Editar voluntário:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Deletar voluntário:', id)
  }

  const handleToggleFavorite = (id: string) => {
    console.log('Toggle favorito:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Voluntários</h1>
          <p className="text-gray-600">
            Gerencie todos os voluntários da sua igreja
          </p>
        </div>

        <Link href="/dashboard/voluntarios/novo">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Voluntário
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none"
          />
          <Button variant="outline">Filtros</Button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          {filteredVolunteers.length} voluntário(s) encontrado(s)
        </p>
      </Card>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 rounded-lg border p-1">
          <Button
            variant={viewMode === 'grid' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600"></div>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Carregando voluntários...</h3>
          <p className="text-gray-600">Por favor, aguarde</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Erro ao carregar voluntários</h3>
          <p className="mb-4 text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !error && filteredVolunteers.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum voluntário encontrado</h3>
          <p className="mb-4 text-gray-600">
            Tente ajustar os filtros ou registre um novo voluntário
          </p>
          <Link href="/dashboard/voluntarios/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Voluntário
            </Button>
          </Link>
        </Card>
      ) : (
        !loading && !error && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
          >
            {filteredVolunteers.map((volunteer) => (
              <Card key={volunteer.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{volunteer.full_name}</h3>
                    <p className="text-sm text-gray-600">{volunteer.position || 'Voluntário'}</p>
                    <p className="mt-1 text-sm text-gray-500">{volunteer.email}</p>
                    {volunteer.phone && (
                      <p className="text-sm text-gray-500">{volunteer.phone}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/voluntarios/${volunteer.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(volunteer.id)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="text-sm">
                    <span className="font-semibold">{volunteer.total_events}</span>
                    <span className="text-gray-600"> eventos</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">{volunteer.attendance_rate}%</span>
                    <span className="text-gray-600"> presença</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  )
}
