# 🎯 IMPLEMENTAR TELAS DE EVENTOS - INSTRUÇÕES CLAUDE CODE

## 📋 CONTEXTO

Você precisa implementar todas as telas relacionadas a **EVENTOS** no sistema ZionHub.

São 4 telas principais:
1. **Lista de Eventos** - Grid/List view com filtros
2. **Criar Evento** - Formulário completo
3. **Detalhes do Evento** - Visualização completa
4. **Escalação** - Drag & Drop de voluntários

---

## 🎯 OBJETIVO

Criar telas completas e funcionais de eventos com:
- ✅ Lista com Grid/List toggle
- ✅ Filtros (status, período, ministério)
- ✅ Busca em tempo real
- ✅ Formulário de criação
- ✅ Progress bar de voluntários
- ✅ Tags de ministérios
- ✅ Badges de status
- ✅ Modal de criação
- ✅ Drag & Drop na escalação
- ✅ Validações em tempo real

---

## 📂 ESTRUTURA A CRIAR

```
ZionHub-Web/src/
├── app/
│   └── (dashboard)/
│       └── eventos/
│           ├── page.tsx                    ← Lista de eventos
│           ├── novo/
│           │   └── page.tsx                ← Criar evento
│           └── [id]/
│               ├── page.tsx                ← Detalhes do evento
│               └── escalacao/
│                   └── page.tsx            ← Tela de escalação
│
├── components/
│   └── eventos/
│       ├── EventCard.tsx                   ← Card de evento
│       ├── EventList.tsx                   ← Lista de eventos
│       ├── EventFilters.tsx                ← Filtros
│       ├── EventForm.tsx                   ← Formulário
│       ├── EventDetails.tsx                ← Detalhes
│       └── escalacao/
│           ├── VolunteersList.tsx          ← Lista de voluntários
│           ├── RoleCard.tsx                ← Card de função
│           ├── AssignedVolunteer.tsx       ← Voluntário escalado
│           └── DragAndDrop.tsx             ← Sistema de drag & drop
│
├── hooks/
│   └── useEvents.ts                        ← Hooks personalizados
│
└── types/
    └── event.ts                            ← Tipos TypeScript
```

---

## 📝 PASSO 1: CRIAR TIPOS TYPESCRIPT

### Arquivo: `ZionHub-Web/src/types/event.ts`

**Instrução:** Crie os tipos para eventos.

```typescript
export type EventStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'

export interface Event {
  id: string
  name: string
  type: string
  date: string
  start_time: string
  end_time: string
  location: string
  description?: string
  status: EventStatus
  is_draft: boolean
  ministry_id?: string
  ministry_name?: string
  volunteers: {
    current: number
    total: number
  }
  ministries: string[]
  emoji?: string
  created_at: string
  updated_at: string
}

export interface EventFilters {
  status?: EventStatus | 'all'
  ministry_id?: string
  start_date?: string
  end_date?: string
  search?: string
}

export interface CreateEventInput {
  name: string
  type: string
  date: string
  start_time: string
  end_time: string
  location: string
  description?: string
  ministry_id?: string
}

export interface Volunteer {
  id: string
  full_name: string
  photo?: string
  email: string
  status: 'available' | 'unavailable'
  skills: string[]
  is_favorite: boolean
}

export interface Role {
  id: string
  name: string
  description?: string
  max_volunteers: number
  assigned: Volunteer[]
}

export interface Assignment {
  id: string
  event_id: string
  user_id: string
  role_id: string
  status: 'pending' | 'confirmed' | 'declined'
  user: Volunteer
  role: Role
}
```

---

## 🎨 PASSO 2: CRIAR COMPONENTE EventCard

### Arquivo: `ZionHub-Web/src/components/eventos/EventCard.tsx`

**Instrução:** Crie o card de evento (reutilizar do dashboard, mas melhorado).

```typescript
'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Event } from '@/types/event'

interface EventCardProps {
  event: Event
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
}

const statusConfig = {
  draft: {
    label: 'Rascunho',
    className: 'bg-gray-100 text-gray-600',
  },
  published: {
    label: 'Publicado',
    className: 'bg-blue-100 text-blue-600',
  },
  in_progress: {
    label: 'Em Andamento',
    className: 'bg-warning-light text-warning-dark',
  },
  completed: {
    label: 'Completo',
    className: 'bg-success-light text-success-dark',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-error-light text-error-dark',
  },
}

export function EventCard({ event, onEdit, onDelete, onDuplicate }: EventCardProps) {
  const status = statusConfig[event.status]
  const progress = event.volunteers.total > 0 
    ? (event.volunteers.current / event.volunteers.total) * 100 
    : 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-1 border-2 hover:border-primary-300">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <Avatar className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-800 to-primary-500">
            <AvatarFallback className="rounded-xl bg-transparent text-2xl">
              {event.emoji || '📅'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center gap-2">
            <Badge className={status.className}>{status.label}</Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(event.id)}>
                  ✏️ Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDuplicate?.(event.id)}>
                  📋 Duplicar
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(event.id)}
                  className="text-error"
                >
                  🗑️ Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Link href={`/eventos/${event.id}`}>
          <h3 className="mb-3 text-lg font-semibold hover:text-primary-800 transition-colors">
            {event.name}
          </h3>
        </Link>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{event.date} • {event.start_time} - {event.end_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>
              {event.volunteers.current}/{event.volunteers.total} voluntários
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {event.volunteers.total > 0 && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">Voluntários escalados</span>
              <span className="font-semibold">
                {event.volunteers.current}/{event.volunteers.total}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className={cn(
                  'h-full transition-all',
                  progress === 100
                    ? 'bg-gradient-to-r from-success to-success/80'
                    : 'bg-gradient-to-r from-primary-500 to-primary-300'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {event.ministries.map((ministry) => (
            <Badge
              key={ministry}
              variant="secondary"
              className="bg-primary-50 text-primary-800 hover:bg-primary-100"
            >
              {ministry}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-t bg-gray-50 p-4">
        <Link href={`/eventos/${event.id}/escalacao`} className="w-full">
          <Button
            variant={event.status === 'completed' ? 'outline' : 'default'}
            className="w-full"
          >
            {event.status === 'completed' && 'Ver Escala'}
            {event.status === 'published' && 'Editar Escala'}
            {event.status === 'draft' && 'Montar Escala'}
            {event.status === 'in_progress' && 'Ver Escala'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
```

---

## 🔍 PASSO 3: CRIAR COMPONENTE EventFilters

### Arquivo: `ZionHub-Web/src/components/eventos/EventFilters.tsx`

**Instrução:** Crie os filtros de eventos.

```typescript
'use client'

import { Search, SlidersHorizontal, Calendar } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, status: value as any })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="draft">Rascunhos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="completed">Completos</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>

        {/* Ministry Filter */}
        <Select
          value={filters.ministry_id || 'all'}
          onValueChange={(value) =>
            onFiltersChange({ 
              ...filters, 
              ministry_id: value === 'all' ? undefined : value 
            })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ministério" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="louvor">Louvor</SelectItem>
            <SelectItem value="tecnica">Técnica</SelectItem>
            <SelectItem value="recepcao">Recepção</SelectItem>
            <SelectItem value="kids">Kids</SelectItem>
          </SelectContent>
        </Select>

        {/* Period Filter */}
        <Button variant="outline">
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
```

---

## 📋 PASSO 4: CRIAR PÁGINA LISTA DE EVENTOS

### Arquivo: `ZionHub-Web/src/app/(dashboard)/eventos/page.tsx`

**Instrução:** Crie a página principal de listagem de eventos.

```typescript
'use client'

import { useState } from 'react'
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react'
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
    // Implementar navegação ou modal
  }

  const handleDelete = (id: string) => {
    console.log('Deletar evento:', id)
    // Implementar confirmação e delete
  }

  const handleDuplicate = (id: string) => {
    console.log('Duplicar evento:', id)
    // Implementar duplicação
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
        
        <Link href="/eventos/novo">
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
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
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
          <Link href="/eventos/novo">
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
```

---

## ✏️ PASSO 5: CRIAR FORMULÁRIO DE EVENTO

### Arquivo: `ZionHub-Web/src/components/eventos/EventForm.tsx`

**Instrução:** Crie o formulário completo de criação/edição de evento.

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateEventInput } from '@/types/event'

interface EventFormProps {
  initialData?: Partial<CreateEventInput>
  isEdit?: boolean
}

export function EventForm({ initialData, isEdit = false }: EventFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateEventInput>({
    name: initialData?.name || '',
    type: initialData?.type || 'culto',
    date: initialData?.date || '',
    start_time: initialData?.start_time || '',
    end_time: initialData?.end_time || '',
    location: initialData?.location || '',
    description: initialData?.description || '',
    ministry_id: initialData?.ministry_id || '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Chamar API
      console.log('Criar/Atualizar evento:', formData)
      
      // Simular delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirecionar para lista
      router.push('/eventos')
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof CreateEventInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome do Evento */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Evento *</Label>
            <Input
              id="name"
              placeholder="Ex: Culto de Domingo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          {/* Tipo e Ministério */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Evento *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="culto">Culto</SelectItem>
                  <SelectItem value="ensaio">Ensaio</SelectItem>
                  <SelectItem value="reuniao">Reunião</SelectItem>
                  <SelectItem value="evento_especial">Evento Especial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ministry">Ministério</Label>
              <Select
                value={formData.ministry_id}
                onValueChange={(value) => handleChange('ministry_id', value)}
              >
                <SelectTrigger id="ministry">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="louvor">Louvor</SelectItem>
                  <SelectItem value="tecnica">Técnica</SelectItem>
                  <SelectItem value="recepcao">Recepção</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data e Horário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="date"
                type="date"
                className="pl-10"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Horários */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_time">Hora de Início *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="start_time"
                  type="time"
                  className="pl-10"
                  value={formData.start_time}
                  onChange={(e) => handleChange('start_time', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_time">Hora de Término *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="end_time"
                  type="time"
                  className="pl-10"
                  value={formData.end_time}
                  onChange={(e) => handleChange('end_time', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Local e Descrição</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Local */}
          <div className="space-y-2">
            <Label htmlFor="location">Local *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="location"
                placeholder="Ex: Templo Principal"
                className="pl-10"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Textarea
                id="description"
                placeholder="Adicione detalhes sobre o evento..."
                className="min-h-[120px] pl-10"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && '⏳ '}
          {isEdit ? 'Salvar Alterações' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  )
}
```

---

## 📄 PASSO 6: CRIAR PÁGINA NOVO EVENTO

### Arquivo: `ZionHub-Web/src/app/(dashboard)/eventos/novo/page.tsx`

**Instrução:** Crie a página de criação de evento.

```typescript
import { EventForm } from '@/components/eventos/EventForm'

export default function NovoEventoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Criar Novo Evento</h1>
        <p className="text-gray-600">
          Preencha as informações abaixo para criar um novo evento
        </p>
      </div>

      {/* Form */}
      <EventForm />
    </div>
  )
}
```

---

## 🔥 CONTINUA NO PRÓXIMO ARQUIVO...

Este é o PARTE 1 do guia de Eventos. Devido ao tamanho, vou criar mais 2 arquivos:

- **PARTE 2:** Detalhes do Evento e Tela de Escalação
- **PARTE 3:** Componentes de Drag & Drop e Hooks

---

## ✅ CHECKLIST PARTE 1

- [ ] Criar `types/event.ts`
- [ ] Criar `components/eventos/EventCard.tsx`
- [ ] Criar `components/eventos/EventFilters.tsx`
- [ ] Criar `app/(dashboard)/eventos/page.tsx`
- [ ] Criar `components/eventos/EventForm.tsx`
- [ ] Criar `app/(dashboard)/eventos/novo/page.tsx`
- [ ] Testar lista de eventos
- [ ] Testar filtros
- [ ] Testar criação de evento

---

**PRÓXIMO:** Vou criar a PARTE 2 com Detalhes e Escalação! 🚀
