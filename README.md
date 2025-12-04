# 🚀 ZionHub - Sistema de Gestão de Escalas e Eventos para Igrejas

Sistema completo de gestão de escalas, eventos e voluntários para igrejas evangélicas brasileiras.

## 📋 Estrutura do Projeto

```
sistema-ZionHub/
├── ZionHub-Back-end/        # Node.js + Express + TypeScript
├── ZionHub-Web/             # Next.js 14 + Tailwind CSS
├── ZionHub-Mobile/          # React Native (em breve)
├── INSTRUCOES_CLAUDE_CODE.md # Instruções detalhadas do projeto
└── README.md               # Este arquivo
```

## 🏗️ Stack Tecnológico

### Backend
- **Node.js 20+** com Express
- **TypeScript** para type safety
- **Supabase (PostgreSQL)** para banco de dados
- **JWT** para autenticação
- **Zod** para validação
- **Winston** para logs

### Frontend Web
- **Next.js 14** com App Router
- **React 18** com TypeScript
- **Tailwind CSS** para styling
- **Zustand** para state management
- **React Query** para data fetching
- **React Hook Form + Zod** para formulários

## 🎨 Design System

### Cores (da Logo ZionHub)
- **Primary (Azul Petróleo):** `#1E5F74`
- **Secondary (Verde Água):** `#7FD8BE`
- **Accent (Verde Azulado):** `#4CA89A`

Todas as cores estão configuradas no Tailwind (`tailwind.config.ts`).

## 🚀 Como Começar

### Pré-requisitos
- Node.js 20+
- npm ou yarn
- Conta Supabase
- Git

### 1. Setup do Backend

```bash
cd ZionHub-Back-end
npm install
cp .env.example .env.local
# Configure as variáveis de ambiente
npm run dev
```

**Variáveis de Ambiente Necessárias:**
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
JWT_SECRET=sua-chave-secreta
DATABASE_URL=postgresql://...
```

### 2. Setup do Banco de Dados

1. Acesse seu projeto no Supabase
2. Vá para SQL Editor
3. Execute o arquivo `migrations/001_create_tables.sql`

**Endpoints Disponíveis:**
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/register` - Registrar novo usuário
- `GET /api/auth/me` - Obter usuário logado
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `GET /api/volunteers` - Listar voluntários
- `GET /dashboard/stats` - Obter estatísticas

### 3. Setup do Frontend Web

```bash
cd ZionHub-Web
npm install
cp .env.example .env.local
# Configure a URL da API
npm run dev
```

**Variáveis de Ambiente:**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

Acesse [http://localhost:3001](http://localhost:3001)

## 📱 Fluxos Principais

### 1. Login
- Acesse a página de login
- Digite o ID da Igreja, Email e Senha
- Sistema valida JWT e redireciona para Dashboard

### 2. Dashboard
- Visualiza métricas (eventos, voluntários, escalações)
- Mostra próximos eventos
- Ações rápidas para criar eventos

### 3. Gerenciar Eventos
- Lista todos os eventos (filtros por status)
- Criar novo evento
- Ver detalhes e editar
- Escalar voluntários

### 4. Gerenciar Voluntários
- Lista todos os voluntários
- Criar novo voluntário
- Editar informações
- Ver histórico de eventos

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Tokens)** com expiração de 7 dias.

**Token Structure:**
```typescript
{
  userId: string,
  churchId: string,
  email: string,
  role: 'master' | 'leader_ministry' | 'leader_dept' | 'member',
  isMaster: boolean
}
```

**Headers Necessários:**
```
Authorization: Bearer <seu-token-jwt>
```

## 📊 Modelo de Dados

### Tabelas Principais
- `churches` - Igrejas
- `users` - Usuários (voluntários, líderes, admin)
- `events` - Eventos e cultos
- `event_assignments` - Escalações
- `ministries` - Ministérios
- `departments` - Departamentos
- `gamification_points` - Pontos de gamificação

## 🛠️ Desenvolvimento

### Build para Produção

**Backend:**
```bash
cd ZionHub-Back-end
npm run build
npm start
```

**Web:**
```bash
cd ZionHub-Web
npm run build
npm start
```

### Linting & Formatting

```bash
npm run lint
npm run format
```

## 📝 Commits

Siga o padrão:
```
feat: adicionar nova feature
fix: corrigir bug
docs: documentação
refactor: refatorar código
test: adicionar testes
```

## 🤝 Contribuindo

1. Crie uma branch (`git checkout -b feature/sua-feature`)
2. Commit suas mudanças (`git commit -m 'feat: sua feature'`)
3. Push para a branch (`git push origin feature/sua-feature`)
4. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- [INSTRUCOES_CLAUDE_CODE.md](./INSTRUCOES_CLAUDE_CODE.md) - Especificações detalhadas
- Documentação da API
- Issues do GitHub

## 📄 Licença

MIT - Veja LICENSE.md para detalhes

---

**Desenvolvido com ❤️ para igrejas evangélicas brasileiras**
