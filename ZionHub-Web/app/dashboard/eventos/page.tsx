'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List as ListIcon, Calendar, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EventCard } from '@/components/eventos/EventCard'
import { EventFilters } from '@/components/eventos/EventFilters'
import { EventFilters as Filters } from '@/types/event'
import { useEvents } from '@/hooks/useEvents'
import Link from 'next/link'

export default function EventosPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    search: '',
  })

  // Fetch events from API
  const { events, loading, error } = useEvents({
    filters,
    autoFetch: true,
  })

  // Filtrar eventos por busca (o backend já filtra por status)
  const filteredEvents = events.filter((event) => {
    if (filters.search) {
      const search = filters.search.toLowerCase()
      return (
        event.name.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search)
      )
    }
    return true
  })

  const handleEdit = (id: string) => {
    console.log('Editar evento:', id)
  }

  const handleDelete = (id: string) => {
    console.log('Deletar evento:', id)
  }

  const handleDuplicate = (id: string) => {
    console.log('Duplicar evento:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Eventos</h1>
          <p className="text-gray-600">
            Gerencie todos os eventos da sua igreja
          </p>
        </div>

        <Link href="/dashboard/eventos/novo">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Evento
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <EventFilters
        filters={filters}
        onFiltersChange={setFilters}
        resultsCount={filteredEvents.length}
      />

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
          <h3 className="mb-2 text-lg font-semibold">Carregando eventos...</h3>
          <p className="text-gray-600">Por favor, aguarde</p>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="border-red-200 bg-red-50 p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-red-900">Erro ao carregar eventos</h3>
          <p className="mb-4 text-red-700">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar Novamente
          </Button>
        </Card>
      )}

      {/* Events Grid/List */}
      {!loading && !error && filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Calendar className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Nenhum evento encontrado</h3>
          <p className="mb-4 text-gray-600">
            Tente ajustar os filtros ou crie um novo evento
          </p>
          <Link href="/dashboard/eventos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Evento
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
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
