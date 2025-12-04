# 🎯 IMPLEMENTAR TELAS DE EVENTOS - PARTE 3 (FINAL)

## 📋 ESTA É A PARTE 3 - FINALIZAÇÃO

Última parte da implementação das telas de Eventos:
- ✅ Componentes UI necessários (Label, Select, Textarea, Tabs)
- ✅ Hooks personalizados (useEvents)
- ✅ Melhorias no Drag & Drop
- ✅ Integração com API
- ✅ README com instruções

---

## 🧩 PASSO 9: CRIAR COMPONENTES UI FALTANTES

### 9.1 Arquivo: `ZionHub-Web/src/components/ui/label.tsx`

**Instrução:** Crie o componente Label.

```typescript
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

---

### 9.2 Arquivo: `ZionHub-Web/src/components/ui/select.tsx`

**Instrução:** Crie o componente Select.

```typescript
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-gray-900 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
}
```

---

### 9.3 Arquivo: `ZionHub-Web/src/components/ui/textarea.tsx`

**Instrução:** Crie o componente Textarea.

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

---

### 9.4 Arquivo: `ZionHub-Web/src/components/ui/tabs.tsx`

**Instrução:** Crie o componente Tabs.

```typescript
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-600',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

---

### 9.5 Arquivo: `ZionHub-Web/src/components/ui/dropdown-menu.tsx`

**Instrução:** Crie o componente DropdownMenu.

```typescript
import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-white p-1 text-gray-900 shadow-md',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
}
```

---

## 🪝 PASSO 10: CRIAR HOOKS PERSONALIZADOS

### Arquivo: `ZionHub-Web/src/hooks/useEvents.ts`

**Instrução:** Crie hooks para gerenciar eventos (com React Query).

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Event, EventFilters, CreateEventInput } from '@/types/event'

// Listar eventos
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: Event[] }>('/events', {
        params: filters,
      })
      return data.data
    },
  })
}

// Buscar evento por ID
export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: Event }>(`/events/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}

// Criar evento
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateEventInput) => {
      const { data } = await api.post<{ data: Event }>('/events', input)
      return data.data
    },
    onSuccess: () => {
      // Invalidar cache de eventos
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Atualizar evento
export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: Partial<CreateEventInput>) => {
      const { data } = await api.put<{ data: Event }>(`/events/${id}`, input)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', id] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Deletar evento
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Duplicar evento
export function useDuplicateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<{ data: Event }>(`/events/${id}/duplicate`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// Buscar escalação do evento
export function useEventSchedule(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId, 'schedule'],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}/schedule`)
      return data.data
    },
    enabled: !!eventId,
  })
}

// Buscar voluntários disponíveis
export function useAvailableVolunteers(eventId: string) {
  return useQuery({
    queryKey: ['events', eventId, 'volunteers'],
    queryFn: async () => {
      const { data } = await api.get(`/events/${eventId}/available-volunteers`)
      return data.data
    },
    enabled: !!eventId,
  })
}

// Criar escalação
export function useCreateAssignment(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { role_id: string; user_id: string }) => {
      const { data } = await api.post(`/events/${eventId}/assignments`, input)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })
}

// Remover escalação
export function useDeleteAssignment(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      await api.delete(`/events/${eventId}/assignments/${assignmentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
    },
  })
}

// Publicar escala
export function usePublishSchedule(eventId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`/events/${eventId}/publish`)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', eventId] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
```

---

## 📦 PASSO 11: INSTALAR DEPENDÊNCIAS

### Instrução: Instale as dependências necessárias.

```bash
cd ZionHub-Web

# Componentes UI do Radix
npm install @radix-ui/react-label
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install @radix-ui/react-dropdown-menu

# React Query (se ainda não instalou)
npm install @tanstack/react-query

# Axios (se ainda não instalou)
npm install axios

# Ícones
npm install lucide-react

# Utils
npm install class-variance-authority clsx tailwind-merge
```

---

## 🔗 PASSO 12: INTEGRAR COM API

### 12.1 Exemplo: Usar hooks na página de lista

```typescript
// Em: app/(dashboard)/eventos/page.tsx

// Substituir dados mockados por:
import { useEvents, useDeleteEvent } from '@/hooks/useEvents'

export default function EventosPage() {
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    search: '',
  })

  // Buscar eventos da API
  const { data: events, isLoading } = useEvents(filters)
  const deleteEvent = useDeleteEvent()

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza?')) {
      await deleteEvent.mutateAsync(id)
    }
  }

  if (isLoading) return <div>Carregando...</div>

  // ... resto do código
}
```

---

## 📚 PASSO 13: CRIAR README DE EVENTOS

### Arquivo: `ZionHub-Web/EVENTOS_README.md`

**Instrução:** Crie documentação das telas de eventos.

```markdown
# 🎯 Telas de Eventos - ZionHub

## 📋 Visão Geral

Sistema completo de gerenciamento de eventos com 4 telas principais:
1. **Lista de Eventos** - Visualização em grid/lista com filtros
2. **Criar/Editar Evento** - Formulário completo
3. **Detalhes do Evento** - Visualização completa com sidebar
4. **Escalação** - Drag & Drop de voluntários

## 🗂️ Estrutura de Arquivos

```
src/
├── app/(dashboard)/eventos/
│   ├── page.tsx                    # Lista de eventos
│   ├── novo/page.tsx               # Criar evento
│   └── [id]/
│       ├── page.tsx                # Detalhes
│       ├── editar/page.tsx         # Editar (TODO)
│       └── escalacao/page.tsx      # Escalação
│
├── components/eventos/
│   ├── EventCard.tsx               # Card de evento
│   ├── EventFilters.tsx            # Filtros
│   └── EventForm.tsx               # Formulário
│
├── hooks/
│   └── useEvents.ts                # Hooks React Query
│
└── types/
    └── event.ts                    # Tipos TypeScript
```

## 🚀 Como Usar

### 1. Lista de Eventos

```typescript
import { useEvents } from '@/hooks/useEvents'

const { data: events } = useEvents({
  status: 'published',
  search: 'culto'
})
```

### 2. Criar Evento

```typescript
import { useCreateEvent } from '@/hooks/useEvents'

const createEvent = useCreateEvent()

await createEvent.mutateAsync({
  name: 'Culto de Domingo',
  type: 'culto',
  date: '2024-12-07',
  start_time: '19:00',
  end_time: '21:00',
  location: 'Templo Principal'
})
```

### 3. Atualizar Evento

```typescript
const updateEvent = useUpdateEvent(eventId)

await updateEvent.mutateAsync({
  name: 'Novo Nome'
})
```

### 4. Deletar Evento

```typescript
const deleteEvent = useDeleteEvent()

await deleteEvent.mutateAsync(eventId)
```

## 🎨 Componentes Disponíveis

### EventCard

```tsx
<EventCard
  event={event}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onDuplicate={handleDuplicate}
/>
```

### EventFilters

```tsx
<EventFilters
  filters={filters}
  onFiltersChange={setFilters}
  resultsCount={10}
/>
```

### EventForm

```tsx
<EventForm
  initialData={event}
  isEdit={true}
/>
```

## 📊 Status dos Eventos

- `draft` - Rascunho (cinza)
- `published` - Publicado (azul)
- `in_progress` - Em Andamento (laranja)
- `completed` - Completo (verde)
- `cancelled` - Cancelado (vermelho)

## 🔄 Fluxo Completo

1. **Criar Evento** → Status: `draft`
2. **Montar Escala** → Adicionar voluntários
3. **Publicar Escala** → Status: `published`, notificações enviadas
4. **Dia do Evento** → Status: `in_progress`
5. **Após o Evento** → Status: `completed`

## 🧪 Testes

```bash
# Rodar testes (quando implementados)
npm test
```

## 📝 TODO

- [ ] Drag & Drop real (dnd-kit)
- [ ] Recorrência de eventos
- [ ] Templates de eventos
- [ ] Exportar para PDF
- [ ] Notificações em tempo real
- [ ] Filtros avançados (data range picker)
```

---

## ✅ CHECKLIST FINAL

### Componentes UI:
- [ ] Label
- [ ] Select
- [ ] Textarea
- [ ] Tabs
- [ ] DropdownMenu

### Hooks:
- [ ] useEvents (listar)
- [ ] useEvent (buscar por ID)
- [ ] useCreateEvent
- [ ] useUpdateEvent
- [ ] useDeleteEvent
- [ ] useDuplicateEvent
- [ ] useEventSchedule
- [ ] useAvailableVolunteers
- [ ] useCreateAssignment
- [ ] useDeleteAssignment
- [ ] usePublishSchedule

### Páginas:
- [ ] Lista de eventos
- [ ] Criar evento
- [ ] Detalhes do evento
- [ ] Escalação

### Integração:
- [ ] Substituir dados mockados por API
- [ ] Testar CRUD completo
- [ ] Validar formulários
- [ ] Tratamento de erros

---

## 🎉 CONCLUSÃO

Com as 3 partes, você tem:

✅ **Lista de Eventos** com filtros e busca  
✅ **Formulário Completo** de criação/edição  
✅ **Página de Detalhes** com todas as informações  
✅ **Tela de Escalação** básica (pronta para drag & drop)  
✅ **Componentes Reutilizáveis**  
✅ **Hooks Personalizados** (React Query)  
✅ **Tipos TypeScript** completos  
✅ **Documentação** completa  

---

## 🚀 PRÓXIMOS PASSOS

1. **Implementar Drag & Drop** com `@dnd-kit/core`
2. **Adicionar Validações** com Zod
3. **Melhorar UX** com loading states
4. **Adicionar Toasts** para feedback
5. **Testes** com Jest e Testing Library

---

**PARABÉNS! SISTEMA DE EVENTOS COMPLETO! 🎊**
