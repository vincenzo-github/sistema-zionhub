'use client'

import { Calendar, MapPin, Users } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: {
    id: string
    title: string
    date: string
    time: string
    location: string
    volunteers: {
      current: number
      total: number
    }
    ministries: string[]
    status: 'complete' | 'pending' | 'draft'
    emoji: string
  }
}

const statusConfig = {
  complete: {
    label: 'Completo',
    className: 'bg-success-100 text-success-600',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-warning-100 text-warning-600',
  },
  draft: {
    label: 'Rascunho',
    className: 'bg-gray-100 text-gray-600',
  },
}

export function EventCard({ event }: EventCardProps) {
  const status = statusConfig[event.status]
  const progress = (event.volunteers.current / event.volunteers.total) * 100

  return (
    <Card className="overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-1 cursor-pointer border-2 hover:border-primary-300">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <Avatar className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-800 to-primary-500">
            <AvatarFallback className="rounded-xl bg-transparent text-2xl">
              {event.emoji}
            </AvatarFallback>
          </Avatar>
          <Badge className={status.className}>{status.label}</Badge>
        </div>

        <h3 className="mb-3 text-lg font-semibold">{event.title}</h3>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {event.date} • {event.time}
            </span>
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
        <Button variant={event.status === 'complete' ? 'outline' : 'default'} className="w-full">
          {event.status === 'complete' && 'Ver Escala'}
          {event.status === 'pending' && 'Montar Escala'}
          {event.status === 'draft' && 'Iniciar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
