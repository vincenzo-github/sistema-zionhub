'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List as ListIcon, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { EventCard } from '@/components/eventos/EventCard'
import { EventFilters } from '@/components/eventos/EventFilters'
import { EventFilters as Filters, Event } from '@/types/event'
import Link from 'next/link'

// DADOS MOCKADOS (substituir por API depois)
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Culto de Domingo',
    type: 'culto',
    date: '07/12/2024',
    start_time: '19:00',
    end_time: '21:00',
    location: 'Templo Principal',
    status: 'completed',
    is_draft: false,
    volunteers: { current: 12, total: 12 },
    ministries: ['Louvor', 'Técnica', 'Recepção'],
    emoji: '📅',
    created_at: '2024-11-01',
    updated_at: '2024-12-07',
  },
  {
    id: '2',
    name: 'Ensaio de Louvor',
    type: 'ensaio',
    date: '10/12/2024',
    start_time: '20:00',
    end_time: '22:00',
    location: 'Sala de Ensaio',
    status: 'published',
    is_draft: false,
    volunteers: { current: 4, total: 6 },
    ministries: ['Louvor'],
    emoji: '🎵',
    created_at: '2024-11-15',
    updated_at: '2024-12-01',
  },
  {
    id: '3',
    name: 'Culto de Celebração',
    type: 'culto',
    date: '14/12/2024',
    start_time: '19:00',
    end_time: '21:30',
    location: 'Templo Principal',
    status: 'draft',
    is_draft: true,
    volunteers: { current: 0, total: 15 },
    ministries: ['Louvor', 'Técnica', 'Recepção', 'Kids'],
    emoji: '🎉',
    created_at: '2024-11-20',
    updated_at: '2024-11-20',
  },
  {
    id: '4',
    name: 'Reunião de Oração',
    type: 'reuniao',
    date: '05/12/2024',
    start_time: '19:30',
    end_time: '21:00',
    location: 'Sala de Oração',
    status: 'completed',
    is_draft: false,
    volunteers: { current: 3, total: 3 },
    ministries: ['Intercessão'],
    emoji: '🙏',
    created_at: '2024-10-15',
    updated_at: '2024-12-05',
  },
  {
    id: '5',
    name: 'Culto de Natal',
    type: 'culto',
    date: '25/12/2024',
    start_time: '19:00',
    end_time: '22:00',
    location: 'Templo Principal',
    status: 'published',
    is_draft: false,
    volunteers: { current: 8, total: 20 },
    ministries: ['Louvor', 'Técnica', 'Recepção', 'Kids', 'Decoração'],
    emoji: '🎄',
    created_at: '2024-11-01',
    updated_at: '2024-12-01',
  },
  {
    id: '6',
    name: 'Véspera de Natal',
    type: 'culto',
    date: '24/12/2024',
    start_time: '20:00',
    end_time: '23:00',
    location: 'Templo Principal',
    status: 'published',
    is_draft: false,
    volunteers: { current: 18, total: 18 },
    ministries: ['Louvor', 'Técnica', 'Recepção'],
    emoji: '🌟',
    created_at: '2024-11-01',
    updated_at: '2024-12-01',
  },
]

export default function EventosPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    search: '',
  })

  // Filtrar eventos (lógica simples - depois fazer no backend)
  const filteredEvents = mockEvents.filter((event) => {
    if (filters.status && filters.status !== 'all' && event.status !== filters.status) {
      return false
    }
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
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8 w-8 p-0"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-8 w-8 p-0"
          >
            <ListIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Events Grid/List */}
      {filteredEvents.length === 0 ? (
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
      )}
    </div>
  )
}
