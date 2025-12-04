# 🔔 Sistema de Notificações - Exemplos de Uso

## Toast Notifications (Feedback Instantâneo)

### Import
```typescript
import { toast } from '@/lib/toast'
```

### Exemplos Básicos

#### Success
```typescript
toast.success('Evento criado!', 'O evento foi criado com sucesso')
```

#### Error
```typescript
toast.error('Erro ao salvar', 'Tente novamente')
```

#### Warning
```typescript
toast.warning('Atenção', 'Este voluntário já está escalado')
```

#### Info
```typescript
toast.info('Informação', 'Check-in disponível agora')
```

#### Loading
```typescript
const id = toast.loading('Salvando evento...')
```

#### Promise
```typescript
toast.promise(
  minhaFuncaoAsync(),
  {
    loading: 'Carregando...',
    success: 'Sucesso!',
    error: 'Erro ao carregar',
  }
)
```

---

## Notification Center (Central de Notificações)

A NotificationCenter aparece automaticamente no header do dashboard.

### Funcionalidades:
- 🔔 Sino com badge de contagem
- 📋 Lista de notificações ordenadas por data
- ✅ Marcar como lida
- 🗑️ Deletar notificação
- ✓✓ Marcar todas como lidas

### Auto-refresh
As notificações atualizam automaticamente a cada 30 segundos.

---

## Exemplos Práticos

### Exemplo 1: Criar um Evento com Toast
```typescript
'use client'

import { useEvents } from '@/hooks/useEvents'
import { toast } from '@/lib/toast'

export function CreateEventForm() {
  const { createEvent } = useEvents({ autoFetch: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const promise = createEvent({
        name: 'Novo Evento',
        date: '2024-12-15',
        start_time: '19:00',
        end_time: '21:00',
        location: 'Templo',
      })

      toast.promise(promise, {
        loading: '📝 Criando evento...',
        success: '✅ Evento criado com sucesso!',
        error: '❌ Erro ao criar evento',
      })
    } catch (err) {
      toast.error('Erro', 'Algo deu errado')
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

### Exemplo 2: Deletar com Confirmação
```typescript
import { toast } from '@/lib/toast'

async function handleDelete(id: string) {
  try {
    await api.delete(`/events/${id}`)
    toast.success('Deletado!', 'Evento removido com sucesso')
  } catch (err) {
    toast.error('Erro', 'Não foi possível deletar')
  }
}
```

### Exemplo 3: Usar Notificações
```typescript
'use client'

import { useNotifications } from '@/hooks/useNotifications'

export function NotificationsList() {
  const { notifications, loading, markAsRead } = useNotifications()

  return (
    <div>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <h4>{notif.title}</h4>
          <p>{notif.message}</p>
          {!notif.is_read && (
            <button onClick={() => markAsRead(notif.id)}>
              Marcar como lida
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
```

---

## Tipos de Notificações (Backend)

Ao criar uma notificação no backend, use um desses tipos:

```typescript
type NotificationType =
  | 'assignment'   // Escalação de voluntário
  | 'confirmation' // Confirmação de ação
  | 'reminder'     // Lembrete
  | 'checkin'      // Check-in realizado
  | 'general'      // Geral
```

---

## API Endpoints

### GET /api/notifications
Lista todas as notificações do usuário

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123",
      "title": "Novo evento",
      "message": "Você foi escalado",
      "type": "assignment",
      "is_read": false,
      "created_at": "2024-12-04T10:30:00Z"
    }
  ]
}
```

### GET /api/notifications/unread-count
Conta notificações não lidas

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

### PUT /api/notifications/:id/read
Marca uma notificação como lida

### PUT /api/notifications/read-all
Marca todas como lidas

### DELETE /api/notifications/:id
Deleta uma notificação

---

## Boas Práticas

✅ **Faça:**
- Use toast para feedback imediato (salvo, erro, etc)
- Mostre erros específicos ao usuário
- Use loading toast para operações longas
- Personalize mensagens para contexto

❌ **Não Faça:**
- Spam de toasts (máx 1-2 por ação)
- Mensagens genéricas como "OK" ou "Tá"
- Deixar loading indefinidamente
- Mostrar erros técnicos ao usuário final

---

## Próximos Passos

1. ✅ Notificações (Feito!)
2. ⏳ Check-in/Check-out (Próximo)
3. 🏆 Gamificação

