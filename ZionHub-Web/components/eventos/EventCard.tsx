'use client'

import Link from 'next/link'
import { Calendar, MapPin, Users, MoreVertical } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
    className: 'bg-yellow-100 text-yellow-600',
  },
  completed: {
    label: 'Completo',
    className: 'bg-success-100 text-success-600',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-error-100 text-error-600',
  },
}

export function EventCard({ event, onEdit, onDelete, onDuplicate }: EventCardProps) {
  const status = statusConfig[event.status]
  const progress = event.volunteers.total > 0
    ? (event.volunteers.current / event.volunteers.total) * 100
    : 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-1 border-2 hover:border-primary-300 cursor-pointer">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <Avatar className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-800 to-primary-500">
            <AvatarFallback className="rounded-xl bg-transparent text-2xl">
              {event.emoji || '📅'}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            <Badge className={status.className}>{status.label}</Badge>

            <div className="relative group/menu">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>

              <div className="hidden group-hover/menu:block absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit?.(event.id)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onDuplicate?.(event.id)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                >
                  📋 Duplicar
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete?.(event.id)
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-error-50 text-error-600 text-sm"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
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
                    ? 'bg-gradient-to-r from-success-500 to-success-400'
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
            {event.status === 'cancelled' && 'Ver Detalhes'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
