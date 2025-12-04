# 🚀 ZIONHUB - INSTRUÇÕES PARA CLAUDE CODE

## 📋 VISÃO GERAL DO PROJETO

**Nome:** ZionHub
**Descrição:** Sistema completo de gestão de escalas, eventos e voluntários para igrejas
**Tipo:** SaaS Multi-tenancy
**Público:** Igrejas evangélicas brasileiras

---

## 🎯 OBJETIVO

Criar um sistema web e mobile que permita igrejas gerenciarem:
- ✅ Eventos e cultos
- ✅ Escalação de voluntários
- ✅ Ministérios e departamentos
- ✅ Check-in/Check-out
- ✅ Setlist de músicas
- ✅ Notificações (Email + WhatsApp)
- ✅ Gamificação de voluntários
- ✅ Relatórios e métricas

---

## 🏗️ ARQUITETURA

```
sistema-ZionHub/
│
├── packages/                    # Código compartilhado
│   ├── shared/                 # Types, schemas, utils
│   └── api-client/             # Cliente HTTP
│
├── ZionHub-Mobile/             # React Native (iOS + Android)
├── ZionHub-Web/                # Next.js 14 (Web)
└── ZionHub-Backend/            # Node.js + Express + Supabase
```

---

## 🛠️ STACK TECNOLÓGICA

### Frontend Web (Next.js 14)
```json
{
  "framework": "Next.js 14",
  "language": "TypeScript",
  "ui": "shadcn/ui (Radix UI)",
  "styling": "Tailwind CSS",
  "state": "Zustand",
  "data-fetching": "@tanstack/react-query",
  "forms": "react-hook-form + zod",
  "animations": "framer-motion",
  "charts": "recharts",
  "icons": "lucide-react"
}
```

### Frontend Mobile (React Native CLI)
```json
{
  "framework": "React Native CLI (sem Expo)",
  "language": "TypeScript",
  "navigation": "React Navigation 6",
  "state": "Zustand",
  "data-fetching": "@tanstack/react-query",
  "forms": "react-hook-form + zod",
  "ui": "Componentes customizados"
}
```

### Backend (Node.js + Express)
```json
{
  "runtime": "Node.js 20+",
  "framework": "Express",
  "language": "TypeScript",
  "database": "Supabase (PostgreSQL)",
  "auth": "JWT",
  "validation": "Zod",
  "email": "NodeMailer / SendGrid",
  "whatsapp": "whatsapp-web.js",
  "logging": "Winston"
}
```

### Database (Supabase)
```json
{
  "database": "PostgreSQL",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage",
  "realtime": "Supabase Realtime",
  "security": "Row Level Security (RLS)"
}
```

---

## 🎨 DESIGN SYSTEM

### Cores (da Logo ZionHub)

```typescript
const colors = {
  primary: {
    900: '#0A2E3D',  // Azul muito escuro
    800: '#1E5F74',  // Azul petróleo (PRINCIPAL)
    700: '#2A7A8E',
    600: '#3795A8',
    500: '#4CA89A',  // Verde azulado (ACCENT)
    400: '#62BDA8',
    300: '#7FD8BE',  // Verde água (SECUNDÁRIA)
    200: '#A8E8D4',
    100: '#D1F4E9',
    50: '#E8F6F3',
  },
  success: { 600: '#16A34A', 500: '#22C55E', 100: '#DCFCE7' },
  warning: { 600: '#EA580C', 500: '#F97316', 100: '#FFEDD5' },
  error: { 600: '#DC2626', 500: '#EF4444', 100: '#FEE2E2' },
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
  }
}
```

### Tipografia
```typescript
{
  fontFamily: 'Inter, -apple-system, sans-serif',
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '32px',
  }
}
```

---

## 📊 MODELO DE DADOS (Supabase)

### Tabelas Principais

```sql
-- CHURCHES (Multi-tenancy)
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  logo TEXT,
  plan_id TEXT DEFAULT 'basic',
  cakto_id TEXT UNIQUE,
  status TEXT DEFAULT 'active',
  setup_completed BOOLEAN DEFAULT false,
  setup_token TEXT,
  setup_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USERS
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  photo TEXT,
  role TEXT DEFAULT 'member',
  status TEXT DEFAULT 'active',
  is_master BOOLEAN DEFAULT false,
  position TEXT,
  activation_token TEXT,
  activation_token_expires_at TIMESTAMPTZ,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, email)
);

-- MINISTRIES
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  leader_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEPARTMENTS
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- DEPARTMENT_ROLES
CREATE TABLE department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER_DEPARTMENT_ROLES
CREATE TABLE user_department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate',
  experience_time INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, department_role_id)
);

-- EVENTS
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  status TEXT DEFAULT 'draft',
  ministry_id UUID REFERENCES ministries(id),
  event_template_id UUID,
  schedule_template_id UUID,
  setlist_id UUID,
  recurrence_group_id UUID,
  qrcode TEXT,
  is_draft BOOLEAN DEFAULT true,
  workflow_stage TEXT DEFAULT 'created',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENT_ASSIGNMENTS
CREATE TABLE event_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  assigned_by UUID REFERENCES users(id),
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id, department_role_id)
);

-- GAMIFICATION
CREATE TABLE gamification_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank_position INTEGER,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(church_id, user_id)
);
```

---

## 🔐 AUTENTICAÇÃO E SEGURANÇA

### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  churchId: string;
  email: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  isMaster: boolean;
}
```

### Middleware de Autenticação
```typescript
// Todas as rotas protegidas devem:
1. Validar JWT token
2. Injetar churchId, userId, userRole no request
3. Aplicar Row Level Security (RLS) no Supabase
```

### Permissões por Perfil

| Ação | MASTER | Líder Ministério | Líder Dept | Voluntário |
|------|--------|------------------|------------|------------|
| Criar Ministério | ✅ | ❌ | ❌ | ❌ |
| Criar Departamento | ✅ | ✅ (seu ministério) | ❌ | ❌ |
| Criar Evento | ✅ | ✅ | ✅ | ❌ |
| Escalar Voluntários | ✅ | ✅ | ✅ (seu dept) | ❌ |
| Ver Relatórios | ✅ | ✅ (seu ministério) | ✅ (seu dept) | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ |

---

## 📱 TELAS PRINCIPAIS

### 1. Dashboard
**Rota Web:** `/dashboard`
**Screen Mobile:** `DashboardScreen`

**Componentes:**
- Card de saudação com gradient
- 4 cards de métricas (Eventos, Voluntários, Pendentes, Taxa)
- Lista de próximos eventos
- Calendário lateral
- Escalações pendentes
- Atividade recente

**APIs necessárias:**
- `GET /api/dashboard/stats`
- `GET /api/dashboard/upcoming-events`
- `GET /api/dashboard/pending-schedules`
- `GET /api/dashboard/recent-activity`

### 2. Eventos
**Rota Web:** `/events`
**Screen Mobile:** `EventsListScreen`

**Funcionalidades:**
- Grid/Lista de eventos
- Filtros (status, período, ministério)
- Busca
- Criar evento (modal)
- Ver detalhes

**APIs necessárias:**
- `GET /api/events` (com filtros)
- `POST /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

### 3. Escalação
**Rota Web:** `/events/:id/schedule`
**Screen Mobile:** `ScheduleScreen`

**Funcionalidades:**
- Drag & drop de voluntários
- Validações em tempo real
- Progresso visual
- Setlist
- Publicar escala

**APIs necessárias:**
- `GET /api/events/:id/schedule`
- `POST /api/events/:id/assignments`
- `PUT /api/events/:id/assignments/:assignmentId`
- `DELETE /api/events/:id/assignments/:assignmentId`
- `POST /api/events/:id/publish`

### 4. Voluntários
**Rota Web:** `/volunteers`
**Screen Mobile:** `VolunteersListScreen`

**Funcionalidades:**
- Lista de voluntários
- Cadastrar novo
- Editar perfil
- Ver histórico
- Marcar indisponibilidade

**APIs necessárias:**
- `GET /api/volunteers`
- `POST /api/volunteers`
- `GET /api/volunteers/:id`
- `PUT /api/volunteers/:id`
- `POST /api/volunteers/:id/unavailability`

### 5. Check-in
**Rota Web:** `/events/:id/checkin`
**Screen Mobile:** `CheckinScreen`

**Funcionalidades:**
- QR Code único por evento
- Scanner de QR
- Check-in manual (líder)
- Lista de presença
- Status visual

**APIs necessárias:**
- `GET /api/events/:id/qrcode`
- `POST /api/events/:id/checkin`
- `POST /api/events/:id/checkout`
- `GET /api/events/:id/attendance`

---

## 🔄 FLUXOS PRINCIPAIS

### Fluxo 1: Onboarding (Compra → Setup)

```
1. Compra no Cakto
   └─> Webhook: POST /api/webhook/cakto
       └─> Cria church com status "pending"
       └─> Gera setup_token
       └─> Envia email para igreja

2. Igreja acessa link de setup
   └─> GET /setup/:token
       └─> Valida token
       └─> Mostra tela de cadastro de responsável

3. Igreja indica responsável
   └─> POST /api/setup/responsible
       └─> Cria user com is_master=true
       └─> Gera activation_token
       └─> Envia email/whatsapp para responsável

4. Responsável ativa conta
   └─> GET /activate/:token
       └─> Valida token
       └─> Responsável cria senha
       └─> Login automático

5. Wizard de configuração
   └─> Cria ministério "Secretaria" (is_default=true)
   └─> Cria departamento "Gerenciamento" (is_default=true)
   └─> Define responsável como líder
   └─> church.setup_completed = true
```

### Fluxo 2: Criar Evento e Escalar

```
1. Líder cria evento
   └─> POST /api/events
       {
         name, date, start_time, end_time,
         location, ministry_id, type
       }
       └─> Cria event com status "draft"

2. Líder acessa escalação
   └─> GET /events/:id/schedule
       └─> Retorna funções necessárias (department_roles)
       └─> Retorna voluntários disponíveis

3. Líder escalada voluntários
   └─> POST /api/events/:id/assignments
       {
         department_role_id,
         user_id
       }
       └─> Valida disponibilidade
       └─> Valida duplicação
       └─> Cria assignment com status "pending"

4. Líder publica escala
   └─> POST /api/events/:id/publish
       └─> Valida se todas funções preenchidas
       └─> event.status = "published"
       └─> Envia notificações (email + whatsapp)
       └─> Gera QR Code único

5. Voluntários confirmam
   └─> PUT /api/assignments/:id/status
       { status: "confirmed" | "declined" }
       └─> Atualiza status
       └─> Envia notificação para líder
```

### Fluxo 3: Check-in no Evento

```
1. Voluntário abre app no dia do evento
   └─> Vê evento escalado
   └─> Vê QR Code ou botão Check-in

2. Voluntário faz check-in
   └─> POST /api/events/:id/checkin
       └─> Valida se está escalado
       └─> Valida se está no horário
       └─> check_in_time = NOW()
       └─> Gamificação: +10 pontos

3. Voluntário faz check-out
   └─> POST /api/events/:id/checkout
       └─> check_out_time = NOW()
       └─> Calcula tempo de presença
       └─> Gamificação: +5 pontos extras
```

---

## 🎮 GAMIFICAÇÃO

### Sistema de Pontos

```typescript
const POINTS = {
  CHECK_IN: 10,
  CHECK_OUT_EXTRA: 5,
  EARLY_CONFIRMATION: 3,
  PERFECT_ATTENDANCE_MONTH: 50,
  COMPLETE_PROFILE: 20,
}

const LEVELS = [
  { level: 1, minPoints: 0, name: 'Iniciante' },
  { level: 2, minPoints: 50, name: 'Comprometido' },
  { level: 3, minPoints: 150, name: 'Dedicado' },
  { level: 4, minPoints: 300, name: 'Exemplar' },
  { level: 5, minPoints: 500, name: 'Referência' },
]
```

---

## 📧 NOTIFICAÇÕES

### Eventos que disparam notificações

1. **Escalação criada** → Email + WhatsApp para voluntário
2. **Voluntário confirmou** → Notificação para líder
3. **Voluntário recusou** → Notificação para líder
4. **Lembrete 24h antes** → Email + WhatsApp
5. **Lembrete 2h antes** → WhatsApp
6. **Escala publicada** → Email para todos escalados

### Templates

```typescript
// Email: Escalação criada
{
  subject: "🎉 Você foi escalado! - [Nome do Evento]",
  body: `
    Olá [Nome],
    
    Você foi escalado para [Função] no evento:
    📅 [Nome do Evento]
    📍 [Local]
    🕐 [Data e Hora]
    
    [Confirmar] [Recusar]
  `
}
```

---

## ⚙️ CONFIGURAÇÕES TÉCNICAS

### package.json (Backend)

```json
{
  "name": "zionhub-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "typescript": "^5.3.3",
    "@supabase/supabase-js": "^2.39.0",
    "zod": "^3.22.4",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "nodemailer": "^6.9.8",
    "axios": "^1.6.5"
  }
}
```

### package.json (Web)

```json
{
  "name": "zionhub-web",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.3",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.1",
    "zustand": "^4.5.0",
    "@tanstack/react-query": "^5.17.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "axios": "^1.6.5",
    "framer-motion": "^10.18.0",
    "recharts": "^2.10.4",
    "lucide-react": "^0.312.0"
  }
}
```

---

## 📝 TAREFAS PRIORITÁRIAS

### FASE 1: Setup Inicial (Semana 1-2)
- [ ] Criar estrutura de pastas
- [ ] Configurar TypeScript
- [ ] Configurar ESLint + Prettier
- [ ] Setup Supabase local
- [ ] Criar migrations do banco
- [ ] Setup Next.js com shadcn/ui
- [ ] Setup Express + TypeScript
- [ ] Configurar variáveis de ambiente

### FASE 2: Autenticação (Semana 3)
- [ ] Implementar JWT auth no backend
- [ ] Criar middleware de autenticação
- [ ] Implementar RLS no Supabase
- [ ] Tela de login (Web)
- [ ] Tela de cadastro (Web)
- [ ] Auth context/store (Zustand)

### FASE 3: Onboarding (Semana 4)
- [ ] Webhook do Cakto
- [ ] Fluxo de setup da igreja
- [ ] Cadastro de responsável
- [ ] Wizard de configuração
- [ ] Criação de ministério/departamento padrão

### FASE 4: Dashboard (Semana 5)
- [ ] Layout com sidebar
- [ ] Card de métricas
- [ ] Lista de eventos
- [ ] Calendário
- [ ] APIs do dashboard

### FASE 5: Eventos (Semana 6-7)
- [ ] CRUD de eventos
- [ ] Filtros e busca
- [ ] Grid/Lista view
- [ ] Detalhes do evento
- [ ] APIs de eventos

### FASE 6: Escalação (Semana 8-9)
- [ ] Tela de escalação
- [ ] Drag & drop (Web)
- [ ] Seleção de voluntários (Mobile)
- [ ] Validações
- [ ] Publicar escala
- [ ] APIs de escalação

### FASE 7: Voluntários (Semana 10)
- [ ] CRUD de voluntários
- [ ] Cadastro simplificado (3 etapas)
- [ ] Perfil completo
- [ ] Indisponibilidade
- [ ] APIs de voluntários

### FASE 8: Notificações (Semana 11)
- [ ] Service de email (NodeMailer)
- [ ] Service de WhatsApp
- [ ] Templates de notificações
- [ ] Agendamento de lembretes

### FASE 9: Check-in (Semana 12)
- [ ] Geração de QR Code
- [ ] Scanner de QR (Mobile)
- [ ] Check-in/Check-out
- [ ] Lista de presença
- [ ] APIs de check-in

### FASE 10: Gamificação (Semana 13)
- [ ] Sistema de pontos
- [ ] Níveis e badges
- [ ] Ranking
- [ ] Tela de gamificação

### FASE 11: Mobile (Semana 14-16)
- [ ] Setup React Native CLI
- [ ] Navegação
- [ ] Telas principais
- [ ] Integração com API
- [ ] Build Android/iOS

---

## 🎯 PRIORIZAÇÃO

### Must Have (MVP)
1. ✅ Autenticação
2. ✅ Onboarding
3. ✅ Dashboard
4. ✅ CRUD Eventos
5. ✅ Escalação
6. ✅ Voluntários (básico)
7. ✅ Notificações (email)

### Should Have (V1.1)
1. Check-in/Check-out
2. Gamificação
3. Relatórios
4. WhatsApp notifications
5. App Mobile

### Could Have (V2.0)
1. Setlist avançado
2. Integração com streaming
3. App para membros
4. Multi-campus
5. API pública

---

## 📚 REFERÊNCIAS

- **Design Reference:** `/mnt/user-data/uploads/1764784062138_image.png`
- **Protótipos HTML:**
  - Dashboard: `/mnt/user-data/outputs/zionhub-dashboard-prototype.html`
  - Eventos: `/mnt/user-data/outputs/zionhub-events-prototype.html`
  - Escalação: `/mnt/user-data/outputs/zionhub-escalation-prototype.html`
- **Análise Completa:** `/mnt/user-data/outputs/ANALISE_COMPLETA_FLUXO_ZIONHUB.md`
- **Stack Definitiva:** `/mnt/user-data/outputs/ZIONHUB_STACK_DEFINITIVA.md`
- **Análise do Concorrente:** `/mnt/user-data/outputs/ANALISE_PLANNING_CENTER_CONCORRENTE.md`

---

## 🤖 INSTRUÇÕES PARA CLAUDE CODE

Claude, por favor:

1. **Comece pelo Backend:**
   - Setup Express + TypeScript
   - Configurar Supabase
   - Criar todas as migrations do banco
   - Implementar autenticação JWT
   - Criar controllers, services e storage layers
   - Implementar todas as rotas da API

2. **Depois faça o Web:**
   - Setup Next.js 14 com App Router
   - Instalar e configurar shadcn/ui
   - Implementar o Design System (cores da marca)
   - Criar layout com sidebar
   - Implementar autenticação
   - Criar todas as telas (Dashboard, Eventos, Escalação, Voluntários)

3. **Por último o Mobile:**
   - Setup React Native CLI
   - Configurar navegação
   - Criar telas principais
   - Integrar com a API

**IMPORTANTE:**
- Use TypeScript em TUDO
- Siga o Design System (cores, tipografia)
- Implemente validações com Zod
- Use React Query para cache
- Adicione tratamento de erros
- Adicione logs com Winston
- Documente o código
- Crie testes unitários básicos

**Comece agora! Boa sorte! 🚀**
