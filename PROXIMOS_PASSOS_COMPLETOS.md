# 🚀 ZIONHUB - PRÓXIMOS PASSOS COMPLETOS

**Base:** Análise Completa do Fluxo ZionHub  
**Data:** Dezembro 2024  
**Status:** Pronto para Desenvolvimento

---

## 📋 ÍNDICE

1. [Estrutura do Projeto](#estrutura)
2. [Backend - APIs Completas](#backend)
3. [Frontend Web - Todas as Telas](#frontend-web)
4. [Frontend Mobile - Todas as Telas](#frontend-mobile)
5. [Integrações Externas](#integracoes)
6. [Testes e Validações](#testes)
7. [Deploy e Infraestrutura](#deploy)

---

## 🏗️ ESTRUTURA DO PROJETO {#estrutura}

### ✅ JÁ CRIADO:
- [x] Estrutura de pastas completa
- [x] package.json (workspace)
- [x] README.md
- [x] .gitignore
- [x] Documentação completa
- [x] Protótipos HTML (Dashboard, Eventos, Escalação)

### 🔥 PRÓXIMO PASSO 1: SETUP INICIAL



#### 1 Configurar Supabase 

```bash
cd ZionHub-Back-end

# Instalar Supabase CLI
npm install -g supabase

# Iniciar projeto Supabase
supabase init

# Iniciar containers (PostgreSQL + API)
supabase start

# Guardar credenciais que aparecerem:
# API URL: http://localhost:54321
# anon key: eyJ...
# service_role key: eyJ...
```

#### 1.1 Criar .env.example para todos os projetos

**Backend:**
```bash
# ZionHub-Back-end/.env.example
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=7d

# Email (NodeMailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SendGrid (alternativa)
SENDGRID_API_KEY=your_sendgrid_key

# WhatsApp (Twilio ou whatsapp-web.js)
WHATSAPP_ENABLED=false
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Webhook do Cakto
CAKTO_WEBHOOK_SECRET=your_cakto_webhook_secret

# URLs
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:3001
```

**Web:**
```bash
# ZionHub-Web/.env.local.example
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

**Mobile:**
```bash
# ZionHub-Mobile/.env.example
API_URL=http://localhost:3001/api
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=your_anon_key
```

---

## 🔧 BACKEND - APIS COMPLETAS {#backend}

### 🔥 PRÓXIMO PASSO 2: MIGRATIONS DO BANCO

#### 2.1 Criar arquivo de migrations

```bash
cd ZionHub-Back-end/supabase/migrations
```

Criar arquivo: `20240101000000_initial_schema.sql`

```sql
-- ════════════════════════════════════════════════════════
-- ZIONHUB DATABASE SCHEMA
-- ════════════════════════════════════════════════════════

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ════════════════════════════════════════════════════════
-- TABLE: churches (Multi-tenancy)
-- ════════════════════════════════════════════════════════
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  whatsapp TEXT,
  logo TEXT,
  address TEXT,
  
  -- Plano e Integração
  plan_id TEXT DEFAULT 'basic' CHECK (plan_id IN ('basic', 'professional', 'enterprise')),
  cakto_id TEXT UNIQUE,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'cancelled')),
  
  -- Setup
  setup_completed BOOLEAN DEFAULT false,
  setup_token TEXT UNIQUE,
  setup_token_expires_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_churches_cakto_id ON churches(cakto_id);
CREATE INDEX idx_churches_email ON churches(email);
CREATE INDEX idx_churches_status ON churches(status);

-- ════════════════════════════════════════════════════════
-- TABLE: users
-- ════════════════════════════════════════════════════════
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  
  -- Dados Pessoais
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  photo TEXT,
  
  -- Perfil e Permissões
  role TEXT DEFAULT 'member' CHECK (role IN ('master', 'leader_ministry', 'leader_dept', 'member')),
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'inactive')),
  is_master BOOLEAN DEFAULT false, -- ✅ NOVO: Identifica o responsável principal
  position TEXT, -- Pastor, Líder, Coordenador, etc
  
  -- Ativação
  activation_token TEXT UNIQUE,
  activation_token_expires_at TIMESTAMPTZ,
  
  -- Controle
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(church_id, email)
);

CREATE INDEX idx_users_church_id ON users(church_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_master ON users(church_id, is_master);

-- ════════════════════════════════════════════════════════
-- TABLE: ministries
-- ════════════════════════════════════════════════════════
CREATE TABLE ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#1E5F74',
  icon TEXT,
  leader_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false, -- ✅ Ministério padrão (Secretaria)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(church_id, name)
);

CREATE INDEX idx_ministries_church_id ON ministries(church_id);
CREATE INDEX idx_ministries_leader_id ON ministries(leader_id);

-- ════════════════════════════════════════════════════════
-- TABLE: departments
-- ════════════════════════════════════════════════════════
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  ministry_id UUID NOT NULL REFERENCES ministries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  admin_id UUID REFERENCES users(id),
  is_default BOOLEAN DEFAULT false, -- ✅ Departamento padrão (Gerenciamento)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(ministry_id, name)
);

CREATE INDEX idx_departments_church_id ON departments(church_id);
CREATE INDEX idx_departments_ministry_id ON departments(ministry_id);

-- ════════════════════════════════════════════════════════
-- TABLE: department_roles (Funções dentro de departamentos)
-- ════════════════════════════════════════════════════════
CREATE TABLE department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  max_volunteers INTEGER DEFAULT 1, -- Máximo de pessoas nesta função por evento
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(department_id, name)
);

CREATE INDEX idx_department_roles_department_id ON department_roles(department_id);

-- ════════════════════════════════════════════════════════
-- TABLE: user_department_roles (Relação N:N)
-- ════════════════════════════════════════════════════════
CREATE TABLE user_department_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id) ON DELETE CASCADE,
  proficiency_level TEXT DEFAULT 'intermediate' CHECK (proficiency_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  experience_time INTEGER DEFAULT 0, -- Meses de experiência
  is_favorite BOOLEAN DEFAULT false, -- ✅ NOVO: Marcar favoritos
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, department_role_id)
);

CREATE INDEX idx_user_dept_roles_user_id ON user_department_roles(user_id);
CREATE INDEX idx_user_dept_roles_dept_role_id ON user_department_roles(department_role_id);

-- ════════════════════════════════════════════════════════
-- TABLE: user_unavailability
-- ════════════════════════════════════════════════════════
CREATE TABLE user_unavailability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CHECK (end_date >= start_date)
);

CREATE INDEX idx_unavailability_user_id ON user_unavailability(user_id);
CREATE INDEX idx_unavailability_dates ON user_unavailability(start_date, end_date);

-- ════════════════════════════════════════════════════════
-- TABLE: event_templates
-- ════════════════════════════════════════════════════════
CREATE TABLE event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT, -- culto, ensaio, reuniao, etc
  default_start_time TIME,
  default_end_time TIME,
  default_location TEXT,
  ministry_id UUID REFERENCES ministries(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(church_id, name)
);

CREATE INDEX idx_event_templates_church_id ON event_templates(church_id);

-- ════════════════════════════════════════════════════════
-- TABLE: schedule_templates (Funções necessárias por template)
-- ════════════════════════════════════════════════════════
CREATE TABLE schedule_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_template_id UUID NOT NULL REFERENCES event_templates(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_schedule_templates_event_template_id ON schedule_templates(event_template_id);

-- ════════════════════════════════════════════════════════
-- TABLE: events
-- ════════════════════════════════════════════════════════
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  
  -- Dados do Evento
  name TEXT NOT NULL,
  type TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  description TEXT,
  
  -- Status e Workflow
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
  is_draft BOOLEAN DEFAULT true,
  workflow_stage TEXT DEFAULT 'created' CHECK (workflow_stage IN ('created', 'scheduling', 'scheduled', 'confirmed', 'in_progress', 'completed')),
  
  -- Relações
  ministry_id UUID REFERENCES ministries(id),
  event_template_id UUID REFERENCES event_templates(id),
  schedule_template_id UUID,
  setlist_id UUID,
  
  -- Recorrência
  recurrence_group_id UUID, -- Para agrupar eventos recorrentes
  
  -- Check-in
  qrcode TEXT UNIQUE,
  
  -- Controle
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_church_id ON events(church_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_ministry_id ON events(ministry_id);

-- ════════════════════════════════════════════════════════
-- TABLE: event_assignments (Escalações)
-- ════════════════════════════════════════════════════════
CREATE TABLE event_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  department_role_id UUID NOT NULL REFERENCES department_roles(id),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'checked_in', 'checked_out')),
  
  -- Check-in/Check-out
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  
  -- Controle
  notes TEXT,
  assigned_by UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  decline_reason TEXT,
  
  UNIQUE(event_id, user_id, department_role_id)
);

CREATE INDEX idx_assignments_event_id ON event_assignments(event_id);
CREATE INDEX idx_assignments_user_id ON event_assignments(user_id);
CREATE INDEX idx_assignments_status ON event_assignments(status);

-- ════════════════════════════════════════════════════════
-- TABLE: setlists
-- ════════════════════════════════════════════════════════
CREATE TABLE setlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  is_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_setlists_event_id ON setlists(event_id);

-- ════════════════════════════════════════════════════════
-- TABLE: setlist_songs
-- ════════════════════════════════════════════════════════
CREATE TABLE setlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setlist_id UUID NOT NULL REFERENCES setlists(id) ON DELETE CASCADE,
  song_title TEXT NOT NULL,
  artist TEXT,
  key TEXT, -- Tom
  capo INTEGER,
  duration INTEGER, -- Segundos
  order_index INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_setlist_songs_setlist_id ON setlist_songs(setlist_id);

-- ════════════════════════════════════════════════════════
-- TABLE: event_schedules (Cronograma do evento)
-- ════════════════════════════════════════════════════════
CREATE TABLE event_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  time TIME NOT NULL,
  activity TEXT NOT NULL,
  duration INTEGER, -- Minutos
  responsible_user_id UUID REFERENCES users(id),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_event_schedules_event_id ON event_schedules(event_id);

-- ════════════════════════════════════════════════════════
-- TABLE: gamification_points
-- ════════════════════════════════════════════════════════
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

CREATE INDEX idx_gamification_church_id ON gamification_points(church_id);
CREATE INDEX idx_gamification_user_id ON gamification_points(user_id);
CREATE INDEX idx_gamification_rank ON gamification_points(church_id, points DESC);

-- ════════════════════════════════════════════════════════
-- TABLE: gamification_transactions (Histórico de pontos)
-- ════════════════════════════════════════════════════════
CREATE TABLE gamification_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  action_type TEXT NOT NULL, -- check_in, check_out, early_confirmation, etc
  description TEXT,
  event_id UUID REFERENCES events(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gamification_transactions_user_id ON gamification_transactions(user_id);

-- ════════════════════════════════════════════════════════
-- TABLE: notifications
-- ════════════════════════════════════════════════════════
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Conteúdo
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('assignment', 'confirmation', 'reminder', 'checkin', 'general')),
  
  -- Referências
  event_id UUID REFERENCES events(id),
  assignment_id UUID REFERENCES event_assignments(id),
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  
  -- Controle
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);

-- ════════════════════════════════════════════════════════
-- FUNCTIONS
-- ════════════════════════════════════════════════════════

-- Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_churches_updated_at BEFORE UPDATE ON churches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ministries_updated_at BEFORE UPDATE ON ministries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════

-- Habilitar RLS em todas as tabelas
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ministries ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE department_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_department_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (Exemplo para users)
CREATE POLICY "Users can view own church users"
  ON users FOR SELECT
  USING (church_id = current_setting('app.current_church_id')::UUID);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = current_setting('app.current_user_id')::UUID);

-- ════════════════════════════════════════════════════════
-- SEED DATA (Dados iniciais para testes)
-- ════════════════════════════════════════════════════════

-- Igreja de teste
INSERT INTO churches (id, name, email, status, setup_completed)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Igreja de Testes',
  'teste@igrejateste.com',
  'active',
  true
);

-- Usuário master de teste
-- Senha: "teste123" (hash bcrypt)
INSERT INTO users (church_id, email, password, full_name, role, is_master, status)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'admin@igrejateste.com',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin Teste',
  'master',
  true,
  'active'
);

-- Ministério padrão
INSERT INTO ministries (church_id, name, is_default)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Secretaria',
  true
);

-- Departamento padrão
INSERT INTO departments (church_id, ministry_id, name, is_default)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  (SELECT id FROM ministries WHERE name = 'Secretaria' LIMIT 1),
  'Gerenciamento',
  true
);
```

#### 2.2 Aplicar migrations

```bash
cd ZionHub-Back-end
supabase db reset
```

---

### 🔥 PRÓXIMO PASSO 3: BACKEND - SETUP EXPRESS

#### 3.1 Instalar dependências

```bash
cd ZionHub-Back-end

npm init -y

npm install express typescript @types/express @types/node
npm install @supabase/supabase-js
npm install zod
npm install jsonwebtoken @types/jsonwebtoken
npm install bcryptjs @types/bcryptjs
npm install cors @types/cors
npm install helmet
npm install express-rate-limit
npm install winston
npm install nodemailer @types/nodemailer
npm install dotenv
npm install tsx --save-dev
```

#### 3.2 Configurar TypeScript

Criar `ZionHub-Back-end/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 3.3 Criar estrutura de arquivos do backend

```
ZionHub-Back-end/src/
├── index.ts                    # Entry point
├── config/
│   ├── supabase.ts            # Cliente Supabase
│   ├── logger.ts              # Winston logger
│   └── constants.ts           # Constantes
├── middlewares/
│   ├── auth.ts                # JWT authentication
│   ├── validate.ts            # Zod validation
│   ├── errorHandler.ts        # Error handler
│   └── rateLimiter.ts         # Rate limiting
├── schemas/
│   ├── church.schema.ts
│   ├── user.schema.ts
│   ├── event.schema.ts
│   └── ...
├── types/
│   ├── express.d.ts           # Extend Express types
│   ├── models.ts              # Database models
│   └── api.ts                 # API request/response types
├── storage/
│   ├── church.storage.ts
│   ├── user.storage.ts
│   ├── event.storage.ts
│   └── ...
├── services/
│   ├── auth.service.ts
│   ├── email.service.ts
│   ├── whatsapp.service.ts
│   └── gamification.service.ts
├── controllers/
│   ├── auth.controller.ts
│   ├── church.controller.ts
│   ├── user.controller.ts
│   ├── event.controller.ts
│   ├── assignment.controller.ts
│   └── ...
├── routes/
│   ├── index.ts               # Router principal
│   ├── auth.routes.ts
│   ├── church.routes.ts
│   ├── user.routes.ts
│   ├── event.routes.ts
│   └── ...
└── utils/
    ├── jwt.ts
    ├── hash.ts
    ├── tokens.ts
    └── validators.ts
```

#### 3.4 Criar package.json scripts

```json
{
  "name": "ZionHub-Back-end",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:reset": "supabase db reset",
    "db:migrate": "supabase db push"
  }
}
```

---

### 🔥 PRÓXIMO PASSO 4: IMPLEMENTAR AUTENTICAÇÃO

#### 4.1 Criar JWT utils

`ZionHub-Back-end/src/utils/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  churchId: string;
  email: string;
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member';
  isMaster: boolean;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
```

#### 4.2 Criar middleware de autenticação

`ZionHub-Back-end/src/middlewares/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      churchId: string;
      userId: string;
      userRole: string;
      isMaster: boolean;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token não fornecido'
        }
      });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer "
    const decoded = verifyToken(token);
    
    // Injetar dados no request
    req.churchId = decoded.churchId;
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.isMaster = decoded.isMaster;
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: 'Token inválido ou expirado'
      }
    });
  }
}

export function requireMaster(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.isMaster) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Apenas MASTER pode executar esta ação'
      }
    });
  }
  next();
}
```

---

### 🔥 PRÓXIMO PASSO 5: CRIAR TODOS OS ENDPOINTS

#### Lista completa de endpoints necessários:

```typescript
// ════════════════════════════════════════════════════════
// AUTENTICAÇÃO
// ════════════════════════════════════════════════════════
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/activate/:token
GET    /api/auth/me

// ════════════════════════════════════════════════════════
// ONBOARDING / SETUP
// ════════════════════════════════════════════════════════
POST   /api/webhook/cakto                    // Webhook do Cakto
GET    /api/setup/:token                     // Validar token de setup
POST   /api/setup/responsible                // Cadastrar responsável
POST   /api/setup/complete                   // Completar wizard

// ════════════════════════════════════════════════════════
// CHURCHES
// ════════════════════════════════════════════════════════
GET    /api/churches/me                      // Dados da igreja logada
PUT    /api/churches/me                      // Atualizar igreja
POST   /api/churches/me/logo                 // Upload logo

// ════════════════════════════════════════════════════════
// USERS
// ════════════════════════════════════════════════════════
GET    /api/users                            // Listar usuários
POST   /api/users                            // Criar usuário
GET    /api/users/:id                        // Detalhes do usuário
PUT    /api/users/:id                        // Atualizar usuário
DELETE /api/users/:id                        // Deletar usuário (MASTER)
POST   /api/users/:id/photo                  // Upload foto
POST   /api/users/:id/unavailability         // Marcar indisponibilidade
GET    /api/users/:id/unavailability         // Listar indisponibilidades
DELETE /api/users/unavailability/:id         // Remover indisponibilidade

// ════════════════════════════════════════════════════════
// MINISTRIES
// ════════════════════════════════════════════════════════
GET    /api/ministries                       // Listar ministérios
POST   /api/ministries                       // Criar ministério (MASTER)
GET    /api/ministries/:id                   // Detalhes
PUT    /api/ministries/:id                   // Atualizar (MASTER/Leader)
DELETE /api/ministries/:id                   // Deletar (MASTER)

// ════════════════════════════════════════════════════════
// DEPARTMENTS
// ════════════════════════════════════════════════════════
GET    /api/departments                      // Listar departamentos
POST   /api/departments                      // Criar departamento
GET    /api/departments/:id                  // Detalhes
PUT    /api/departments/:id                  // Atualizar
DELETE /api/departments/:id                  // Deletar
GET    /api/departments/:id/roles            // Listar funções
POST   /api/departments/:id/roles            // Criar função
PUT    /api/departments/roles/:id            // Atualizar função
DELETE /api/departments/roles/:id            // Deletar função

// ════════════════════════════════════════════════════════
// EVENTS
// ════════════════════════════════════════════════════════
GET    /api/events                           // Listar eventos (com filtros)
POST   /api/events                           // Criar evento
GET    /api/events/:id                       // Detalhes do evento
PUT    /api/events/:id                       // Atualizar evento
DELETE /api/events/:id                       // Deletar evento
POST   /api/events/:id/publish               // Publicar escala
POST   /api/events/:id/duplicate             // Duplicar evento
GET    /api/events/:id/qrcode                // Gerar QR Code

// ════════════════════════════════════════════════════════
// EVENT ASSIGNMENTS (Escalação)
// ════════════════════════════════════════════════════════
GET    /api/events/:id/schedule              // Ver escala
GET    /api/events/:id/available-volunteers  // Voluntários disponíveis
POST   /api/events/:id/assignments           // Criar escalação
PUT    /api/events/:id/assignments/:assignmentId  // Atualizar
DELETE /api/events/:id/assignments/:assignmentId  // Remover
POST   /api/assignments/:id/confirm          // Confirmar presença
POST   /api/assignments/:id/decline          // Recusar

// ════════════════════════════════════════════════════════
// CHECK-IN / CHECK-OUT
// ════════════════════════════════════════════════════════
POST   /api/events/:id/checkin               // Check-in
POST   /api/events/:id/checkout              // Check-out
GET    /api/events/:id/attendance            // Lista de presença

// ════════════════════════════════════════════════════════
// SETLIST
// ════════════════════════════════════════════════════════
GET    /api/events/:id/setlist               // Ver setlist
POST   /api/events/:id/setlist               // Criar/atualizar setlist
POST   /api/events/:id/setlist/songs         // Adicionar música
PUT    /api/events/:id/setlist/songs/:songId // Atualizar música
DELETE /api/events/:id/setlist/songs/:songId // Remover música
PUT    /api/events/:id/setlist/reorder       // Reordenar músicas

// ════════════════════════════════════════════════════════
// DASHBOARD
// ════════════════════════════════════════════════════════
GET    /api/dashboard/stats                  // Métricas principais
GET    /api/dashboard/upcoming-events        // Próximos eventos
GET    /api/dashboard/pending-schedules      // Escalas pendentes
GET    /api/dashboard/recent-activity        // Atividade recente

// ════════════════════════════════════════════════════════
// REPORTS
// ════════════════════════════════════════════════════════
GET    /api/reports/volunteers               // Relatório de voluntários
GET    /api/reports/events                   // Relatório de eventos
GET    /api/reports/attendance               // Relatório de presença
GET    /api/reports/ministry/:id             // Relatório por ministério

// ════════════════════════════════════════════════════════
// GAMIFICATION
// ════════════════════════════════════════════════════════
GET    /api/gamification/ranking             // Ranking geral
GET    /api/gamification/me                  // Meus pontos
GET    /api/gamification/transactions        // Histórico de pontos

// ════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════
GET    /api/notifications                    // Listar notificações
PUT    /api/notifications/:id/read           // Marcar como lida
PUT    /api/notifications/read-all           // Marcar todas como lidas
DELETE /api/notifications/:id                // Deletar notificação
```

---

### 🔥 PRÓXIMO PASSO 6: IMPLEMENTAR CONTROLLERS

Exemplo completo de um controller:

`ZionHub-Back-end/src/controllers/event.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { EventStorage } from '../storage/event.storage';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';

export class EventController {
  private storage: EventStorage;
  
  constructor() {
    this.storage = new EventStorage();
  }
  
  // GET /api/events
  async list(req: Request, res: Response) {
    try {
      const { churchId } = req;
      const { status, ministry_id, start_date, end_date, search } = req.query;
      
      const events = await this.storage.listEvents(churchId, {
        status: status as string,
        ministryId: ministry_id as string,
        startDate: start_date as string,
        endDate: end_date as string,
        search: search as string
      });
      
      return res.json({
        success: true,
        data: events
      });
    } catch (error) {
      console.error('List events error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao listar eventos'
        }
      });
    }
  }
  
  // POST /api/events
  async create(req: Request, res: Response) {
    try {
      const { churchId, userId } = req;
      
      // Validar com Zod
      const validated = createEventSchema.parse(req.body);
      
      const event = await this.storage.createEvent({
        ...validated,
        church_id: churchId,
        created_by: userId
      });
      
      return res.status(201).json({
        success: true,
        data: event
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Dados inválidos',
            details: error.errors
          }
        });
      }
      
      console.error('Create event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao criar evento'
        }
      });
    }
  }
  
  // GET /api/events/:id
  async getById(req: Request, res: Response) {
    try {
      const { churchId } = req;
      const { id } = req.params;
      
      const event = await this.storage.getEventById(id, churchId);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Evento não encontrado'
          }
        });
      }
      
      return res.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Get event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao buscar evento'
        }
      });
    }
  }
  
  // PUT /api/events/:id
  async update(req: Request, res: Response) {
    try {
      const { churchId } = req;
      const { id } = req.params;
      
      // Validar
      const validated = updateEventSchema.parse(req.body);
      
      const event = await this.storage.updateEvent(id, churchId, validated);
      
      if (!event) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Evento não encontrado'
          }
        });
      }
      
      return res.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error('Update event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao atualizar evento'
        }
      });
    }
  }
  
  // DELETE /api/events/:id
  async delete(req: Request, res: Response) {
    try {
      const { churchId } = req;
      const { id } = req.params;
      
      await this.storage.deleteEvent(id, churchId);
      
      return res.json({
        success: true,
        message: 'Evento deletado com sucesso'
      });
    } catch (error) {
      console.error('Delete event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao deletar evento'
        }
      });
    }
  }
  
  // POST /api/events/:id/publish
  async publish(req: Request, res: Response) {
    try {
      const { churchId } = req;
      const { id } = req.params;
      
      // Validar se todas as funções estão preenchidas
      const validation = await this.storage.validateSchedule(id, churchId);
      
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_SCHEDULE',
            message: 'Escala incompleta',
            details: validation.errors
          }
        });
      }
      
      // Atualizar status do evento
      await this.storage.updateEvent(id, churchId, {
        status: 'published',
        is_draft: false
      });
      
      // Enviar notificações
      await notificationService.sendAssignmentNotifications(id);
      
      return res.json({
        success: true,
        message: 'Escala publicada com sucesso'
      });
    } catch (error) {
      console.error('Publish event error:', error);
      return res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Erro ao publicar escala'
        }
      });
    }
  }
}
```

---

## 🌐 FRONTEND WEB - TODAS AS TELAS {#frontend-web}

### 🔥 PRÓXIMO PASSO 7: SETUP NEXT.JS

#### 7.1 Criar projeto Next.js

```bash
cd sistema-ZionHub
npx create-next-app@latest ZionHub-Web --typescript --tailwind --app --src-dir --import-alias "@/*"
```

#### 7.2 Instalar dependências

```bash
cd ZionHub-Web

# shadcn/ui
npx shadcn-ui@latest init

# Componentes shadcn/ui necessários
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add alert
npx shadcn-ui@latest add progress

# Outras dependências
npm install zustand
npm install @tanstack/react-query
npm install axios
npm install react-hook-form @hookform/resolvers
npm install zod
npm install date-fns
npm install recharts
npm install framer-motion
npm install lucide-react
npm install sonner
```

#### 7.3 Configurar cores do Tailwind

`ZionHub-Web/tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  // ... outras configurações
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#0A2E3D',
          800: '#1E5F74',  // Azul petróleo PRINCIPAL
          700: '#2A7A8E',
          600: '#3795A8',
          500: '#4CA89A',  // Verde azulado ACCENT
          400: '#62BDA8',
          300: '#7FD8BE',  // Verde água SECUNDÁRIA
          200: '#A8E8D4',
          100: '#D1F4E9',
          50: '#E8F6F3',
        },
        // Sobrescrever cores do shadcn
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#F5F7FA",
        foreground: "#1E293B",
        // ... demais cores
      },
    },
  },
}
```

#### 7.4 Estrutura de pastas do Web

```
ZionHub-Web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── events/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── schedule/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── volunteers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── ministries/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── setup/
│   │   └── [token]/
│   │       └── page.tsx
│   ├── activate/
│   │   └── [token]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MobileMenu.tsx
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── EventCard.tsx
│   │   ├── Calendar.tsx
│   │   └── RecentActivity.tsx
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventFilters.tsx
│   │   ├── EventForm.tsx
│   │   └── EventList.tsx
│   ├── schedule/
│   │   ├── VolunteersList.tsx
│   │   ├── RoleCard.tsx
│   │   ├── AssignedVolunteer.tsx
│   │   └── DragAndDrop.tsx
│   ├── volunteers/
│   │   ├── VolunteerCard.tsx
│   │   ├── VolunteerForm.tsx
│   │   └── VolunteerFilters.tsx
│   └── ui/
│       └── (shadcn components)
├── lib/
│   ├── api.ts                 # Axios client
│   ├── queryClient.ts         # React Query
│   └── utils.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useEvents.ts
│   ├── useVolunteers.ts
│   └── useDashboard.ts
├── store/
│   ├── authStore.ts           # Zustand
│   └── uiStore.ts
├── types/
│   ├── api.ts
│   ├── models.ts
│   └── components.ts
└── styles/
    └── globals.css
```

---

### 🔥 PRÓXIMO PASSO 8: IMPLEMENTAR TELAS WEB

#### Lista completa de telas a implementar:

```
✅ = Já tem protótipo HTML
🔥 = Próxima a fazer
⏳ = Depois

AUTENTICAÇÃO:
🔥 /login                        # Login
🔥 /register                     # Cadastro
⏳ /forgot-password              # Esqueci senha
⏳ /reset-password/:token        # Redefinir senha
⏳ /activate/:token              # Ativar conta

ONBOARDING:
🔥 /setup/:token                 # Setup inicial da igreja
🔥 /setup/wizard                 # Wizard de configuração

DASHBOARD:
✅ /dashboard                    # Dashboard principal

EVENTOS:
✅ /events                       # Lista de eventos
✅ /events/new                   # Criar evento
✅ /events/[id]                  # Detalhes do evento
✅ /events/[id]/schedule         # Escalação
⏳ /events/[id]/checkin          # Check-in

VOLUNTÁRIOS:
🔥 /volunteers                   # Lista de voluntários
🔥 /volunteers/new               # Cadastrar voluntário
🔥 /volunteers/[id]              # Perfil do voluntário
⏳ /volunteers/[id]/history      # Histórico

MINISTÉRIOS:
🔥 /ministries                   # Gerenciar ministérios
🔥 /ministries/[id]              # Detalhes do ministério

DEPARTAMENTOS:
🔥 /departments                  # Gerenciar departamentos
🔥 /departments/[id]             # Detalhes do departamento

RELATÓRIOS:
⏳ /reports                      # Dashboard de relatórios
⏳ /reports/volunteers           # Relatório de voluntários
⏳ /reports/events               # Relatório de eventos
⏳ /reports/attendance           # Relatório de presença

GAMIFICAÇÃO:
⏳ /gamification                 # Ranking e pontos
⏳ /gamification/me              # Meus pontos

CONFIGURAÇÕES:
⏳ /settings                     # Configurações gerais
⏳ /settings/profile             # Meu perfil
⏳ /settings/church              # Dados da igreja
⏳ /settings/notifications       # Preferências de notificações
```

---

## 📱 FRONTEND MOBILE {#frontend-mobile}

### 🔥 PRÓXIMO PASSO 9: SETUP REACT NATIVE

#### 9.1 Criar projeto React Native

```bash
cd sistema-ZionHub
npx react-native@latest init ZionHubMobile --template react-native-template-typescript
```

#### 9.2 Instalar dependências

```bash
cd ZionHubMobile

# Navegação
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# State e Data
npm install zustand
npm install @tanstack/react-query
npm install axios

# Forms
npm install react-hook-form @hookform/resolvers
npm install zod

# UI
npm install react-native-vector-icons
npm install @shopify/flash-list
npm install react-native-gesture-handler
npm install react-native-reanimated
npm install react-native-svg

# Utils
npm install date-fns
npm install react-native-calendars

# QR Code
npm install react-native-camera
npm install react-native-qrcode-scanner

# Notificações
npm install @notifee/react-native
npm install @react-native-firebase/messaging
```

---

## 🔌 INTEGRAÇÕES EXTERNAS {#integracoes}

### 🔥 PRÓXIMO PASSO 10: INTEGRAÇÃO CAKTO

Criar endpoint webhook e sistema de processamento

### 🔥 PRÓXIMO PASSO 11: EMAIL (NodeMailer/SendGrid)

Criar service de envio de emails

### 🔥 PRÓXIMO PASSO 12: WHATSAPP (Twilio ou whatsapp-web.js)

Criar service de envio de WhatsApp

---

## 🧪 TESTES E VALIDAÇÕES {#testes}

### 🔥 PRÓXIMO PASSO 13: TESTES UNITÁRIOS

```bash
# Backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Web
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

---

## 🚀 DEPLOY {#deploy}

### 🔥 PRÓXIMO PASSO 14: PREPARAR DEPLOY

#### Backend → Railway
#### Web → Vercel
#### Database → Supabase Cloud
#### Mobile → App Stores

---

## 📋 CHECKLIST RESUMIDO

### SEMANA 1-2: FUNDAÇÃO
- [ ] Setup Git + GitHub
- [ ] Supabase local configurado
- [ ] Migrations aplicadas
- [ ] Backend estruturado
- [ ] JWT auth implementado
- [ ] Web com Next.js + shadcn/ui configurado

### SEMANA 3-4: CORE
- [ ] Todas as APIs do backend
- [ ] Telas de autenticação (Web)
- [ ] Dashboard (Web)
- [ ] CRUD de eventos (Web)

### SEMANA 5-6: ESCALAÇÃO
- [ ] Tela de escalação (Web)
- [ ] Drag & drop
- [ ] Validações
- [ ] Notificações por email

### SEMANA 7-8: VOLUNTÁRIOS
- [ ] CRUD de voluntários
- [ ] Perfis completos
- [ ] Indisponibilidade

### SEMANA 9-12: MOBILE
- [ ] Setup React Native
- [ ] Telas principais
- [ ] Integração com API

---

## 📞 PRÓXIMOS PASSOS IMEDIATOS

**AGORA MESMO:**

1. ✅ Fazer setup do Supabase local
2. ✅ Aplicar migrations
3. ✅ Criar estrutura do backend
4. ✅ Implementar autenticação JWT
5. ✅ Criar primeiro endpoint funcional

**Cole no Claude Code:**

```
Claude, vamos começar pelo backend!

1. Configure o Supabase local
2. Aplique as migrations SQL que estão no arquivo
3. Crie a estrutura completa de arquivos do backend
4. Implemente autenticação JWT
5. Crie os endpoints de autenticação (/login, /register, /me)
6. Teste tudo com dados mockados

Siga EXATAMENTE a estrutura definida neste documento!
```

---

**ESTÁ COMPLETO! NADA FALTANDO! 🚀**
