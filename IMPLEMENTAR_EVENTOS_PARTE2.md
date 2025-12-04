# 🎯 IMPLEMENTAR TELAS DE EVENTOS - PARTE 2

## 📋 ESTA É A PARTE 2

Continuação da implementação das telas de Eventos. Nesta parte:
- ✅ Página de Detalhes do Evento
- ✅ Tela de Escalação com Drag & Drop
- ✅ Componentes de Voluntários
- ✅ Sistema de Drag & Drop

---

## 📄 PASSO 7: CRIAR PÁGINA DETALHES DO EVENTO

### Arquivo: `ZionHub-Web/src/app/(dashboard)/eventos/[id]/page.tsx`

**Instrução:** Crie a página de detalhes do evento com todas as informações.

```typescript
'use client'

import { use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Edit, 
  Trash2,
  Copy,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// DADOS MOCKADOS (substituir por API)
const mockEvent = {
  id: '1',
  name: 'Culto de Domingo',
  type: 'Culto',
  date: '07/12/2024',
  start_time: '19:00',
  end_time: '21:00',
  location: 'Templo Principal',
  description: 'Culto de celebração com louvor, pregação da palavra e comunhão.',
  status: 'published',
  ministry_name: 'Louvor',
  volunteers: { current: 12, total: 12 },
  assignments: [
    {
      id: '1',
      role: 'Vocal Principal',
      user: {
        id: '1',
        full_name: 'Maria Costa',
        photo: null,
        status: 'confirmed',
      },
    },
    {
      id: '2',
      role: 'Guitarra',
      user: {
        id: '2',
        full_name: 'Pedro Silva',
        photo: null,
        status: 'confirmed',
      },
    },
    {
      id: '3',
      role: 'Bateria',
      user: {
        id: '3',
        full_name: 'João Mendes',
        photo: null,
        status: 'pending',
      },
    },
    {
      id: '4',
      role: 'Teclado',
      user: {
        id: '4',
        full_name: 'Carlos Lima',
        photo: null,
        status: 'declined',
      },
    },
  ],
  setlist: [
    { id: '1', title: 'Rompendo em Fé', artist: 'Fernandinho', key: 'Em', duration: '4:32' },
    { id: '2', title: 'Tua Graça Me Basta', artist: 'Oficina G3', key: 'G', duration: '3:58' },
    { id: '3', title: 'Bondade de Deus', artist: 'Isaías Saad', key: 'C', duration: '5:12' },
  ],
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EventoDetalhesPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()

  // TODO: Buscar evento da API
  const event = mockEvent

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      console.log('Deletar evento:', id)
      router.push('/eventos')
    }
  }

  const handleDuplicate = () => {
    console.log('Duplicar evento:', id)
  }

  const getStatusBadge = (status: string) => {
    const config = {
      published: { label: 'Publicado', className: 'bg-blue-100 text-blue-600' },
      draft: { label: 'Rascunho', className: 'bg-gray-100 text-gray-600' },
      completed: { label: 'Completo', className: 'bg-success-light text-success-dark' },
      cancelled: { label: 'Cancelado', className: 'bg-error-light text-error-dark' },
    }
    return config[status as keyof typeof config] || config.draft
  }

  const statusBadge = getStatusBadge(event.status)

  const getAssignmentStatusIcon = (status: string) => {
    if (status === 'confirmed') return <CheckCircle className="h-4 w-4 text-success" />
    if (status === 'declined') return <XCircle className="h-4 w-4 text-error" />
    return <ClockIcon className="h-4 w-4 text-warning" />
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/eventos" className="hover:text-primary-800">
          Eventos
        </Link>
        <span>/</span>
        <span className="text-gray-900">{event.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            <Badge className={statusBadge.className}>
              {statusBadge.label}
            </Badge>
          </div>
          <p className="text-gray-600">
            {event.type} • {event.ministry_name}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicar
          </Button>
          <Link href={`/eventos/${id}/editar`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} className="text-error">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Evento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Calendar className="h-5 w-5 text-primary-800" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-semibold">{event.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <Clock className="h-5 w-5 text-primary-800" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="font-semibold">
                    {event.start_time} - {event.end_time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                  <MapPin className="h-5 w-5 text-primary-800" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Local</p>
                  <p className="font-semibold">{event.location}</p>
                </div>
              </div>

              {event.description && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Descrição</p>
                  <p className="text-gray-900">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Escalação */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Escalação ({event.volunteers.current}/{event.volunteers.total})
              </CardTitle>
              <Link href={`/eventos/${id}/escalacao`}>
                <Button>Editar Escala</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {event.assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={assignment.user.photo || undefined} />
                        <AvatarFallback className="bg-primary-100 text-primary-800">
                          {assignment.user.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{assignment.user.full_name}</p>
                        <p className="text-sm text-gray-600">{assignment.role}</p>
                      </div>
                    </div>
                    {getAssignmentStatusIcon(assignment.user.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Voluntários</span>
                  <span className="font-semibold">
                    {event.volunteers.current}/{event.volunteers.total}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-300"
                    style={{
                      width: `${(event.volunteers.current / event.volunteers.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-success-light p-3">
                  <p className="text-2xl font-bold text-success-dark">8</p>
                  <p className="text-xs text-success-dark">Confirmados</p>
                </div>
                <div className="rounded-lg bg-warning-light p-3">
                  <p className="text-2xl font-bold text-warning-dark">3</p>
                  <p className="text-xs text-warning-dark">Pendentes</p>
                </div>
                <div className="rounded-lg bg-error-light p-3">
                  <p className="text-2xl font-bold text-error-dark">1</p>
                  <p className="text-xs text-error-dark">Recusados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Setlist */}
          {event.setlist && event.setlist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Setlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {event.setlist.map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 rounded-lg border p-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 font-semibold text-primary-800">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-xs text-gray-600">
                          {song.artist} • {song.key} • {song.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/eventos/${id}/escalacao`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Montar Escala
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Copy className="mr-2 h-4 w-4" />
                Duplicar Evento
              </Button>
              <Button variant="outline" className="w-full justify-start text-error">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir Evento
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

---

## 🎯 PASSO 8: CRIAR TELA DE ESCALAÇÃO

### Arquivo: `ZionHub-Web/src/app/(dashboard)/eventos/[id]/escalacao/page.tsx`

**Instrução:** Crie a tela de escalação com drag & drop (versão simplificada primeiro).

```typescript
'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Save, Send, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// DADOS MOCKADOS
const mockEvent = {
  id: '1',
  name: 'Culto de Domingo',
  date: '07/12/2024',
  time: '19:00 - 21:00',
  location: 'Templo Principal',
}

const mockRoles = [
  { id: '1', name: 'Vocal Principal', max: 1, assigned: [] },
  { id: '2', name: 'Back Vocal', max: 2, assigned: [] },
  { id: '3', name: 'Guitarra', max: 1, assigned: [] },
  { id: '4', name: 'Bateria', max: 1, assigned: [] },
  { id: '5', name: 'Baixo', max: 1, assigned: [] },
  { id: '6', name: 'Teclado', max: 1, assigned: [] },
]

const mockVolunteers = [
  {
    id: '1',
    full_name: 'Maria Costa',
    status: 'available',
    skills: ['Vocal', 'Back Vocal'],
    is_favorite: true,
  },
  {
    id: '2',
    full_name: 'Pedro Silva',
    status: 'available',
    skills: ['Guitarra'],
    is_favorite: true,
  },
  {
    id: '3',
    full_name: 'Ana Santos',
    status: 'available',
    skills: ['Back Vocal'],
    is_favorite: false,
  },
  {
    id: '4',
    full_name: 'João Mendes',
    status: 'available',
    skills: ['Bateria'],
    is_favorite: false,
  },
  {
    id: '5',
    full_name: 'Carlos Lima',
    status: 'unavailable',
    skills: ['Teclado'],
    is_favorite: false,
  },
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function EscalacaoPage({ params }: PageProps) {
  const { id } = use(params)
  const [roles, setRoles] = useState(mockRoles)
  const [volunteers, setVolunteers] = useState(mockVolunteers)
  const [search, setSearch] = useState('')
  const [selectedMinistry, setSelectedMinistry] = useState('louvor')

  // Filtrar voluntários
  const filteredVolunteers = volunteers.filter((v) =>
    v.full_name.toLowerCase().includes(search.toLowerCase())
  )

  // Calcular progresso
  const totalAssigned = roles.reduce((acc, role) => acc + role.assigned.length, 0)
  const totalNeeded = roles.reduce((acc, role) => acc + role.max, 0)
  const progress = totalNeeded > 0 ? (totalAssigned / totalNeeded) * 100 : 0

  const handlePublish = () => {
    if (totalAssigned < totalNeeded) {
      alert('Complete todas as funções antes de publicar!')
      return
    }
    console.log('Publicar escala')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/eventos" className="hover:text-primary-800">
            Eventos
          </Link>
          <span>/</span>
          <Link href={`/eventos/${id}`} className="hover:text-primary-800">
            {mockEvent.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Escalação</span>
        </div>

        {/* Event Info Card */}
        <Card className="border-l-4 border-l-primary-500 bg-gradient-to-r from-primary-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{mockEvent.name}</h1>
                <p className="text-gray-600">
                  {mockEvent.date} • {mockEvent.time} • {mockEvent.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Progresso</p>
                <p className="text-2xl font-bold">
                  {totalAssigned}/{totalNeeded}
                </p>
                <div className="mt-2 h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-primary-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Voluntários Disponíveis */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Voluntários Disponíveis</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredVolunteers.map((volunteer) => (
                <div
                  key={volunteer.id}
                  className={`
                    flex items-center gap-3 rounded-lg border p-3 cursor-move
                    ${volunteer.status === 'unavailable' ? 'opacity-50' : 'hover:bg-gray-50'}
                  `}
                >
                  <Avatar>
                    <AvatarImage />
                    <AvatarFallback className="bg-primary-100 text-primary-800">
                      {volunteer.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{volunteer.full_name}</p>
                      {volunteer.is_favorite && <span className="text-warning">⭐</span>}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {volunteer.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {volunteer.status === 'unavailable' && (
                    <Badge className="bg-error-light text-error-dark">
                      Indisponível
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Board de Escalação */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tabs de Ministérios */}
          <Tabs value={selectedMinistry} onValueChange={setSelectedMinistry}>
            <TabsList>
              <TabsTrigger value="louvor">Louvor</TabsTrigger>
              <TabsTrigger value="tecnica">Técnica</TabsTrigger>
              <TabsTrigger value="recepcao">Recepção</TabsTrigger>
            </TabsList>

            <TabsContent value="louvor" className="space-y-4">
              {roles.map((role) => (
                <Card key={role.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <Badge
                        className={
                          role.assigned.length === role.max
                            ? 'bg-success-light text-success-dark'
                            : 'bg-warning-light text-warning-dark'
                        }
                      >
                        {role.assigned.length}/{role.max}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {role.assigned.length === 0 ? (
                      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                        <p className="text-sm text-gray-500">
                          Arraste voluntários aqui
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {role.assigned.map((volunteer: any) => (
                          <div
                            key={volunteer.id}
                            className="flex items-center justify-between rounded-lg border bg-success-light/50 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary-500 text-white text-xs">
                                  {volunteer.full_name.split(' ').map((n: string) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <p className="font-semibold">{volunteer.full_name}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // Remover voluntário
                                setRoles(
                                  roles.map((r) =>
                                    r.id === role.id
                                      ? { ...r, assigned: r.assigned.filter((v: any) => v.id !== volunteer.id) }
                                      : r
                                  )
                                )
                              }}
                            >
                              Remover
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button variant="outline">
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button onClick={handlePublish} disabled={totalAssigned < totalNeeded}>
              <Send className="mr-2 h-4 w-4" />
              Publicar Escala
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## ✅ CHECKLIST PARTE 2

- [ ] Criar `app/(dashboard)/eventos/[id]/page.tsx`
- [ ] Criar `app/(dashboard)/eventos/[id]/escalacao/page.tsx`
- [ ] Testar página de detalhes
- [ ] Testar tela de escalação básica
- [ ] Validar navegação entre telas

---

## 🚀 PRÓXIMOS PASSOS

Na **PARTE 3** vamos adicionar:
- ✅ Drag & Drop real (react-dnd ou dnd-kit)
- ✅ Hooks personalizados (useEvents, useAssignments)
- ✅ Integração com API
- ✅ Validações avançadas
- ✅ Componentes adicionais

---

**AGORA VOCÊ TEM DETALHES E ESCALAÇÃO BÁSICA! 🎉**
