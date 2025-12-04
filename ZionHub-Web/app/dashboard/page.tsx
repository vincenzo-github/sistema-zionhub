'use client'

import { useEffect, useState } from 'react'
import { Calendar as CalendarIcon, Users, CheckSquare, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { EventCard } from '@/components/dashboard/EventCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth'
import Link from 'next/link'

const stats = [
  {
    title: 'Total de Eventos',
    value: '28',
    icon: CalendarIcon,
    iconBg: 'bg-primary-50 text-primary-800',
    change: {
      value: '12%',
      trend: 'up' as const,
      label: 'vs mês passado',
    },
  },
  {
    title: 'Total de Voluntários',
    value: '156',
    icon: Users,
    iconBg: 'bg-success-100 text-success-600',
    change: {
      value: '8%',
      trend: 'up' as const,
      label: 'vs mês passado',
    },
  },
  {
    title: 'Escalações Pendentes',
    value: '5',
    icon: CheckSquare,
    iconBg: 'bg-warning-100 text-warning-600',
    change: {
      value: '2',
      trend: 'down' as const,
      label: 'vs semana passada',
    },
  },
  {
    title: 'Taxa de Confirmação',
    value: '89%',
    icon: TrendingUp,
    iconBg: 'bg-primary-100 text-primary-800',
    change: {
      value: '5%',
      trend: 'up' as const,
      label: 'vs mês passado',
    },
  },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Culto de Domingo',
    date: '07/12/2024',
    time: '19:00',
    location: 'Templo Principal',
    volunteers: { current: 12, total: 12 },
    ministries: ['Louvor', 'Técnica', 'Recepção'],
    status: 'complete' as const,
    emoji: '📅',
  },
  {
    id: '2',
    title: 'Ensaio de Louvor',
    date: '10/12/2024',
    time: '20:00',
    location: 'Sala de Ensaio',
    volunteers: { current: 4, total: 6 },
    ministries: ['Louvor'],
    status: 'pending' as const,
    emoji: '🎵',
  },
  {
    id: '3',
    title: 'Culto de Celebração',
    date: '14/12/2024',
    time: '19:00',
    location: 'Templo Principal',
    volunteers: { current: 0, total: 15 },
    ministries: ['Louvor', 'Técnica', 'Recepção', 'Kids'],
    status: 'draft' as const,
    emoji: '🎉',
  },
]

const recentActivity = [
  {
    id: '1',
    user: 'Maria Costa',
    action: 'confirmou presença em',
    event: 'Culto de Domingo',
    time: 'há 2 horas',
    icon: '✓',
    iconBg: 'bg-success-100 text-success-600',
  },
  {
    id: '2',
    user: 'Pedro Silva',
    action: 'foi cadastrado como voluntário',
    event: null,
    time: 'há 3 horas',
    icon: '👤',
    iconBg: 'bg-primary-100 text-primary-800',
  },
  {
    id: '3',
    user: null,
    action: 'Novo evento criado:',
    event: 'Culto Especial de Natal',
    time: 'há 5 horas',
    icon: '📅',
    iconBg: 'bg-primary-50 text-primary-800',
  },
  {
    id: '4',
    user: 'João Mendes',
    action: 'recusou escalação em',
    event: 'Ensaio de Louvor',
    time: 'há 1 dia',
    icon: '❌',
    iconBg: 'bg-error-100 text-error-600',
  },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary-800 to-primary-500 text-white">
          <CardContent className="relative p-8">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative z-10">
              <h1 className="mb-2 text-3xl font-bold">
                {greeting}, {user?.full_name?.split(' ')[0] || 'Bem-vindo'}! 👋
              </h1>
              <p className="mb-6 text-lg opacity-90">
                Você tem 3 eventos programados esta semana
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-4xl font-bold">12</p>
                  <p className="text-sm opacity-90">Voluntários escalados</p>
                </div>
                <div>
                  <p className="text-4xl font-bold">5</p>
                  <p className="text-sm opacity-90">Escalações pendentes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Dezembro 2024</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">◀</Button>
                <Button variant="ghost" size="sm">▶</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                <div key={i} className="text-xs font-semibold text-gray-600">
                  {d}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`aspect-square rounded-lg text-sm transition-colors ${
                    n === 3 ? 'bg-primary-800 font-semibold text-white' : ''
                  } ${[7, 10, 14, 21].includes(n) ? 'relative font-semibold' : ''} ${
                    ![3, 7, 10, 14, 21].includes(n) ? 'hover:bg-gray-100' : ''
                  }`}
                >
                  {n}
                  {[7, 10, 14, 21].includes(n) && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Próximos Eventos</CardTitle>
          <Link href="/eventos">
            <Button variant="ghost" size="sm">
              Ver todos →
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escalações Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border-l-4 border-warning-600 bg-warning-50 p-4">
              <p className="font-semibold">⚠️ Ensaio de Louvor</p>
              <p className="text-sm text-gray-600">10/12/2024 • Faltam 2 voluntários</p>
              <Button size="sm" className="mt-3">
                Montar Escala →
              </Button>
            </div>
            <div className="rounded-lg border-l-4 border-warning-600 bg-warning-50 p-4">
              <p className="font-semibold">⚠️ Culto de Celebração</p>
              <p className="text-sm text-gray-600">14/12/2024 • Escala não iniciada</p>
              <Button size="sm" className="mt-3">
                Iniciar →
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-gray-50">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${activity.iconBg}`}>
                  <span className="text-lg">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {activity.user && <strong>{activity.user}</strong>} {activity.action}{' '}
                    {activity.event && <strong>{activity.event}</strong>}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}