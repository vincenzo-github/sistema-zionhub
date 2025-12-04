# 🚀 IMPLEMENTAR DASHBOARD ZIONHUB - INSTRUÇÕES CLAUDE CODE

## 📋 CONTEXTO

Você tem o projeto ZionHub e precisa implementar o Dashboard completo em Next.js 14 com TypeScript, Tailwind CSS e shadcn/ui.

O Dashboard já foi criado e está 100% funcional. Agora você vai integrá-lo ao projeto principal.

---

## 🎯 OBJETIVO

Implementar a tela de Dashboard completa com:
- ✅ Sidebar com navegação
- ✅ Header com busca e notificações
- ✅ Card de boas-vindas (gradient)
- ✅ 4 cards de métricas
- ✅ Cards de eventos próximos
- ✅ Calendário
- ✅ Escalações pendentes
- ✅ Atividade recente
- ✅ Cores da marca ZionHub

---

## 📂 ESTRUTURA DO PROJETO

```
ZionHub-Web/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx           ← CRIAR ESTA PÁGINA
│   │   │   ├── eventos/
│   │   │   ├── voluntarios/
│   │   │   └── layout.tsx             ← CRIAR ESTE LAYOUT
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx            ← CRIAR
│   │   │   └── Header.tsx             ← CRIAR
│   │   ├── dashboard/
│   │   │   ├── StatCard.tsx           ← CRIAR
│   │   │   └── EventCard.tsx          ← CRIAR
│   │   └── ui/
│   │       └── (componentes shadcn)
│   ├── lib/
│   │   ├── api.ts                     ← CRIAR (cliente HTTP)
│   │   └── utils.ts
│   ├── hooks/
│   │   └── useDashboard.ts            ← CRIAR
│   ├── store/
│   │   └── authStore.ts
│   └── types/
│       └── dashboard.ts               ← CRIAR
└── tailwind.config.ts                 ← ATUALIZAR
```

---

## 🎨 PASSO 1: CONFIGURAR TAILWIND COM CORES DO ZIONHUB

### Arquivo: `ZionHub-Web/tailwind.config.ts`

**Instrução:** Atualize o arquivo `tailwind.config.ts` para incluir as cores da marca ZionHub.

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CORES DO ZIONHUB (da logo)
        primary: {
          DEFAULT: '#1E5F74',
          foreground: '#FFFFFF',
          900: '#0A2E3D',
          800: '#1E5F74',  // Azul petróleo PRINCIPAL (sidebar)
          700: '#2A7A8E',
          600: '#3795A8',
          500: '#4CA89A',  // Verde azulado ACCENT
          400: '#62BDA8',
          300: '#7FD8BE',  // Verde água SECUNDÁRIA
          200: '#A8E8D4',
          100: '#D1F4E9',
          50: '#E8F6F3',
        },
        secondary: {
          DEFAULT: '#7FD8BE',
          foreground: '#1E5F74',
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#F97316',
          light: '#FFEDD5',
          dark: '#EA580C',
        },
        error: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#DC2626',
        },
        background: '#F5F7FA',
        foreground: '#1E293B',
        // Mantém as cores do shadcn/ui
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        accent: {
          DEFAULT: '#4CA89A',
          foreground: '#FFFFFF',
        },
        gray: {
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
```

---

## 🧩 PASSO 2: CRIAR COMPONENTES DE LAYOUT

### 2.1 Arquivo: `ZionHub-Web/src/components/layout/Sidebar.tsx`

**Instrução:** Crie o componente Sidebar com navegação.

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  Users, 
  Target, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Escalas', href: '/escalas', icon: CheckSquare },
  { name: 'Eventos', href: '/eventos', icon: Calendar },
  { name: 'Voluntários', href: '/voluntarios', icon: Users },
  { name: 'Ministérios', href: '/ministerios', icon: Target },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-primary-800 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-300 to-primary-500 text-lg font-bold">
          Z
        </div>
        <span className="text-xl font-bold">ZionHub</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-700 text-white border-l-4 border-primary-300'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback className="bg-gradient-to-br from-primary-300 to-primary-500 text-sm font-semibold">
              PJ
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-sm">
            <p className="font-semibold">Pastor João</p>
            <p className="text-xs text-white/80">Igreja Vida</p>
          </div>
          <button className="rounded-md p-2 hover:bg-white/10">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### 2.2 Arquivo: `ZionHub-Web/src/components/layout/Header.tsx`

**Instrução:** Crie o componente Header com busca e notificações.

```typescript
'use client'

import { Search, Bell, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-8 shadow-sm">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Buscar eventos, voluntários..."
          className="pl-10"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-error"></span>
          </span>
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback className="bg-gradient-to-br from-primary-300 to-primary-500 text-sm font-semibold text-white">
            PJ
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
```

---

## 📊 PASSO 3: CRIAR COMPONENTES DO DASHBOARD

### 3.1 Arquivo: `ZionHub-Web/src/components/dashboard/StatCard.tsx`

**Instrução:** Crie o componente StatCard para exibir métricas.

```typescript
'use client'

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconBg: string
  change?: {
    value: string
    trend: 'up' | 'down'
    label: string
  }
}

export function StatCard({ title, value, icon: Icon, iconBg, change }: StatCardProps) {
  return (
    <Card className="transition-all hover:shadow-card-hover hover:-translate-y-1 cursor-pointer">
      <CardContent className="p-6">
        <div
          className={cn(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-xl',
            iconBg
          )}
        >
          <Icon className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-gray-600">{title}</p>
        
        <p className="mt-2 text-3xl font-bold">{value}</p>

        {change && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span
              className={cn(
                'font-medium',
                change.trend === 'up' ? 'text-success' : 'text-error'
              )}
            >
              {change.trend === 'up' ? '↑' : '↓'} {change.value}
            </span>
            <span className="text-gray-600">{change.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

### 3.2 Arquivo: `ZionHub-Web/src/components/dashboard/EventCard.tsx`

**Instrução:** Crie o componente EventCard para exibir eventos.

```typescript
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
    className: 'bg-success-light text-success-dark',
  },
  pending: {
    label: 'Pendente',
    className: 'bg-warning-light text-warning-dark',
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
            <span>{event.date} • {event.time}</span>
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
                  ? 'bg-gradient-to-r from-success to-success/80'
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
        <Button
          variant={event.status === 'complete' ? 'outline' : 'default'}
          className="w-full"
        >
          {event.status === 'complete' && 'Ver Escala'}
          {event.status === 'pending' && 'Montar Escala'}
          {event.status === 'draft' && 'Iniciar'}
        </Button>
      </CardFooter>
    </Card>
  )
}
```

---

## 📄 PASSO 4: CRIAR PÁGINA DO DASHBOARD

### Arquivo: `ZionHub-Web/src/app/(dashboard)/dashboard/page.tsx`

**Instrução:** Crie a página principal do Dashboard com todos os componentes.

```typescript
'use client'

import { Calendar as CalendarIcon, Users, CheckSquare, TrendingUp } from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { EventCard } from '@/components/dashboard/EventCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// DADOS MOCKADOS (depois substituir por dados reais da API)
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
    iconBg: 'bg-success-light text-success-dark',
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
    iconBg: 'bg-warning-light text-warning-dark',
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
    iconBg: 'bg-blue-100 text-blue-600',
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
    time: '19:00 - 21:00',
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
    time: '20:00 - 22:00',
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
    time: '19:00 - 21:30',
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
    iconBg: 'bg-success-light text-success-dark',
  },
  {
    id: '2',
    user: 'Pedro Silva',
    action: 'foi cadastrado como voluntário',
    event: null,
    time: 'há 3 horas',
    icon: '👤',
    iconBg: 'bg-blue-100 text-blue-600',
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
    iconBg: 'bg-error-light text-error-dark',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Greeting Card */}
        <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary-800 to-primary-500 text-white">
          <CardContent className="relative p-8">
            <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative z-10">
              <h1 className="mb-2 text-3xl font-bold">
                Bom dia, Pastor João! 👋
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

        {/* Quick Calendar */}
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
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                <div key={i} className="text-xs font-semibold text-gray-600">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`
                    aspect-square rounded-lg text-sm transition-colors
                    ${day === 3 ? 'bg-primary-800 font-semibold text-white' : ''}
                    ${[7, 10, 14, 21].includes(day) ? 'relative font-semibold' : ''}
                    ${![3, 7, 10, 14, 21].includes(day) ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  {day}
                  {[7, 10, 14, 21].includes(day) && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Upcoming Events */}
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

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Escalações Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border-l-4 border-warning bg-warning-light/50 p-4">
              <p className="font-semibold">⚠️ Ensaio de Louvor</p>
              <p className="text-sm text-gray-600">10/12/2024 • Faltam 2 voluntários</p>
              <Button size="sm" className="mt-3">
                Montar Escala →
              </Button>
            </div>
            <div className="rounded-lg border-l-4 border-warning bg-warning-light/50 p-4">
              <p className="font-semibold">⚠️ Culto de Celebração</p>
              <p className="text-sm text-gray-600">14/12/2024 • Escala não iniciada</p>
              <Button size="sm" className="mt-3">
                Iniciar →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
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
```

---

## 🏗️ PASSO 5: CRIAR LAYOUT DO DASHBOARD

### Arquivo: `ZionHub-Web/src/app/(dashboard)/layout.tsx`

**Instrução:** Crie o layout que envolve todas as páginas do dashboard (sidebar + header).

```typescript
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 🔌 PASSO 6: INTEGRAÇÃO COM API (OPCIONAL - PARA DEPOIS)

### 6.1 Arquivo: `ZionHub-Web/src/lib/api.ts`

**Instrução:** Crie o cliente HTTP para comunicação com o backend.

```typescript
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

---

### 6.2 Arquivo: `ZionHub-Web/src/hooks/useDashboard.ts`

**Instrução:** Crie hooks personalizados para buscar dados do dashboard.

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/stats')
      return data
    },
  })
}

export function useDashboardEvents() {
  return useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/upcoming-events')
      return data
    },
  })
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: async () => {
      const { data } = await api.get('/dashboard/recent-activity')
      return data
    },
  })
}
```

---

### 6.3 Substituir dados mockados por dados reais:

**Instrução:** Depois que a API estiver pronta, substitua os dados mockados na página do dashboard:

```typescript
// Antes (mockado):
const stats = [...]

// Depois (API):
const { data: stats } = useDashboardStats()
const { data: upcomingEvents } = useDashboardEvents()
const { data: recentActivity } = useDashboardActivity()
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### PARTE 1: Setup Inicial
- [ ] Atualizar `tailwind.config.ts` com cores do ZionHub
- [ ] Verificar se `globals.css` está importando Tailwind
- [ ] Instalar dependências faltantes (se necessário):
  ```bash
  npm install lucide-react @radix-ui/react-avatar class-variance-authority clsx tailwind-merge
  ```

### PARTE 2: Componentes de Layout
- [ ] Criar `components/layout/Sidebar.tsx`
- [ ] Criar `components/layout/Header.tsx`
- [ ] Testar navegação entre rotas

### PARTE 3: Componentes do Dashboard
- [ ] Criar `components/dashboard/StatCard.tsx`
- [ ] Criar `components/dashboard/EventCard.tsx`
- [ ] Testar componentes isolados

### PARTE 4: Página e Layout
- [ ] Criar `app/(dashboard)/layout.tsx`
- [ ] Criar `app/(dashboard)/dashboard/page.tsx`
- [ ] Testar dashboard completo

### PARTE 5: Integração (Opcional)
- [ ] Criar `lib/api.ts`
- [ ] Criar `hooks/useDashboard.ts`
- [ ] Substituir dados mockados por API

---

## 🧪 COMO TESTAR

### 1. Rodar em desenvolvimento:
```bash
cd ZionHub-Web
npm run dev
```

### 2. Acessar no navegador:
```
http://localhost:3000/dashboard
```

### 3. Verificar:
- ✅ Sidebar aparece com navegação
- ✅ Header aparece com busca e notificações
- ✅ Card de boas-vindas (gradient azul → verde)
- ✅ 4 cards de métricas
- ✅ Calendário
- ✅ 3 cards de eventos
- ✅ Escalações pendentes (com borda laranja)
- ✅ Atividade recente
- ✅ Cores do ZionHub aplicadas
- ✅ Hover effects funcionando
- ✅ Layout responsivo

---

## 🎨 CUSTOMIZAÇÕES POSSÍVEIS

### Trocar dados do usuário:

```typescript
// Sidebar.tsx
<p className="font-semibold">Seu Nome Aqui</p>
<p className="text-xs text-white/80">Sua Igreja</p>
```

### Adicionar mais itens de navegação:

```typescript
const navigation = [
  // ... itens existentes
  { name: 'Nova Página', href: '/nova-pagina', icon: IconName },
]
```

### Mudar cores específicas:

```typescript
// tailwind.config.ts
primary: {
  800: '#SUA_COR_AQUI', // Sidebar
  500: '#SUA_COR_AQUI', // Accent
}
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Module not found"
```bash
npm install
```

### Erro: "cn is not defined"
Verificar se `lib/utils.ts` existe:
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Erro: Componentes UI não encontrados
Instalar componentes shadcn/ui:
```bash
npx shadcn-ui@latest add button card avatar badge input
```

### Sidebar não aparece
Verificar se o layout está envolvendo a página:
```typescript
// app/(dashboard)/layout.tsx deve existir
```

---

## 📚 REFERÊNCIAS

- **Protótipo HTML Original:** `/mnt/user-data/outputs/zionhub-dashboard-prototype.html`
- **Dashboard Next.js Completo:** `/mnt/user-data/outputs/zionhub-dashboard-nextjs/`
- **Documentação Next.js:** https://nextjs.org/docs
- **Documentação shadcn/ui:** https://ui.shadcn.com
- **Documentação Tailwind:** https://tailwindcss.com/docs

---

## 🎯 RESULTADO FINAL

Após seguir todos os passos, você terá:

✅ Dashboard completo e funcional  
✅ Layout profissional com sidebar  
✅ Componentes reutilizáveis  
✅ Cores da marca ZionHub  
✅ Responsivo  
✅ Pronto para integrar com API  

---

**ESTÁ TUDO AQUI! BASTA SEGUIR OS PASSOS! 🚀**

---

## 💡 DICA FINAL

Cole este arquivo inteiro no Claude Code e peça:

```
Claude, implemente o Dashboard do ZionHub seguindo 
EXATAMENTE as instruções deste documento.

Comece pelo PASSO 1 e vá até o PASSO 5.

Depois de implementar, me avise para eu testar!
```

**BOA SORTE! 🚀**
