'use client'

import { Search, SlidersHorizontal, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { EventFilters as Filters } from '@/types/event'

interface EventFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  resultsCount?: number
}

export function EventFilters({
  filters,
  onFiltersChange,
  resultsCount
}: EventFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar eventos por nome, local..."
            className="pl-10"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>

        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtros Avançados
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-4">
        {/* Status Filter */}
        <select
          value={filters.status || 'all'}
          onChange={(e) =>
            onFiltersChange({ ...filters, status: e.target.value as any })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="all">Todos</option>
          <option value="draft">Rascunhos</option>
          <option value="published">Publicados</option>
          <option value="in_progress">Em Andamento</option>
          <option value="completed">Completos</option>
          <option value="cancelled">Cancelados</option>
        </select>

        {/* Ministry Filter */}
        <select
          value={filters.ministry_id || 'all'}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              ministry_id: e.target.value === 'all' ? undefined : e.target.value
            })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        >
          <option value="all">Todos Ministérios</option>
          <option value="louvor">Louvor</option>
          <option value="tecnica">Técnica</option>
          <option value="recepcao">Recepção</option>
          <option value="kids">Kids</option>
        </select>

        {/* Period Filter */}
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Período
        </Button>

        {resultsCount !== undefined && (
          <div className="ml-auto text-sm text-gray-600">
            <strong>{resultsCount}</strong> eventos encontrados
          </div>
        )}
      </div>
    </div>
  )
}
