# 🚀 ZionHub - Guia Completo de Setup

## ✅ O que foi criado

O projeto ZionHub foi implementado do zero seguindo todas as especificações do arquivo `INSTRUCOES_CLAUDE_CODE.md`.

### 📦 Backend (Express + TypeScript)
- ✅ Estrutura completa do Express
- ✅ Configuração de TypeScript
- ✅ Autenticação JWT
- ✅ Middleware de autenticação
- ✅ Validação com Zod
- ✅ Logging com Winston
- ✅ Routes: Auth, Church, Events, Volunteers, Dashboard
- ✅ Services e Controllers
- ✅ Migrations SQL para Supabase

### 🎨 Frontend Web (Next.js 14)
- ✅ Setup Next.js 14 com App Router
- ✅ Configuração de Tailwind CSS
- ✅ Design System (cores da marca)
- ✅ Autenticação e JWT
- ✅ State Management (Zustand)
- ✅ API Client (Axios)
- ✅ Páginas principais:
  - Login
  - Dashboard (com métricas)
  - Eventos (CRUD)
  - Voluntários (CRUD)
  - Configurações
- ✅ Componentes reutilizáveis
- ✅ Sidebar responsiva

## 🔧 Setup Passo a Passo

### 1️⃣ Clonar/Acessar o Repositório

```bash
cd /Users/catedralchurch/Documents/Clientes/Sitema\ Igrejas/Sistema-ZionHub
```

### 2️⃣ Configurar Supabase

#### A. Criar Projeto Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova organização/projeto
3. Copie a URL e as chaves

#### B. Executar Migrations
1. Abra o SQL Editor do Supabase
2. Copie o conteúdo de `ZionHub-Back-end/migrations/001_create_tables.sql`
3. Cole e execute no Supabase

### 3️⃣ Setup Backend

```bash
# Instalar dependências
cd ZionHub-Back-end
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais
nano .env.local
# ou use seu editor favorito
```

**Variáveis necessárias:**
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-service-role-key
JWT_SECRET=sua-chave-secreta-super-segura
NODE_ENV=development
PORT=3000
```

**Iniciar servidor:**
```bash
npm run dev
```

O backend estará disponível em: `http://localhost:3000`

### 4️⃣ Setup Frontend

```bash
# Instalar dependências
cd ZionHub-Web
npm install

# Copiar arquivo de ambiente
cp .env.example .env.local
```

**Variáveis necessárias:**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Iniciar desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3001`

## 🧪 Testar o Sistema

### 1. Login
1. Acesse `http://localhost:3001/login`
2. Use credenciais de um usuário já existente no banco

### 2. Dashboard
- Visualize métricas (ainda vazias inicialmente)
- Veja eventos próximos
- Acione botões de ação rápida

### 3. Eventos
- Liste eventos (vazio inicialmente)
- Use o botão "+ Novo Evento" para criar
- Filtre por status

### 4. Voluntários
- Liste voluntários
- Crie novo voluntário
- Pesquise por nome/email

## 📚 Estrutura de Pastas

### Backend
```
ZionHub-Back-end/
├── src/
│   ├── index.ts              # Entry point
│   ├── types/                # TypeScript types
│   ├── lib/                  # Bibliotecas (Supabase)
│   ├── utils/                # Utilitários (JWT, Logger)
│   ├── middleware/           # Middlewares (Auth)
│   ├── schemas/              # Validações Zod
│   ├── services/             # Business logic
│   └── routes/               # API routes
├── migrations/               # SQL migrations
├── package.json
├── tsconfig.json
└── .env.example
```

### Frontend
```
ZionHub-Web/
├── app/
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── login/                # Login page
│   ├── dashboard/            # Dashboard
│   ├── events/               # Events pages
│   ├── volunteers/           # Volunteers pages
│   └── settings/             # Settings page
├── components/               # Componentes reutilizáveis
├── lib/                      # API client
├── store/                    # Zustand stores
├── types/                    # TypeScript types
├── tailwind.config.ts        # Tailwind config
└── package.json
```

## 🔐 Autenticação

### Fluxo de Login
1. Usuário acessa `/login`
2. Preenche Church ID, Email e Senha
3. Backend valida credenciais contra Supabase
4. Backend gera JWT token
5. Frontend armazena token em cookie
6. Redirecionado para `/dashboard`

### Proteção de Rotas
- Todas as rotas de dashboard exigem login
- Token é validado no middleware `authMiddleware`

## 📖 APIs Disponíveis

### Autenticação
```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### Igrejas
```
GET /api/church
PUT /api/church
```

### Eventos
```
GET /api/events (com filtros)
POST /api/events
GET /api/events/:id
PUT /api/events/:id
DELETE /api/events/:id
```

### Voluntários
```
GET /api/volunteers (com busca)
POST /api/volunteers
GET /api/volunteers/:id
PUT /api/volunteers/:id
```

### Dashboard
```
GET /api/dashboard/stats
GET /api/dashboard/upcoming-events
GET /api/dashboard/pending-schedules
GET /api/dashboard/recent-activity
```

## 🎨 Customizando o Design System

### Cores
Edite `ZionHub-Web/tailwind.config.ts`:
```typescript
colors: {
  primary: {
    800: '#1E5F74',  // Azul petróleo
    // ... mais cores
  }
}
```

### Tipografia
Customizar em `tailwind.config.ts`:
```typescript
fontFamily: {
  sans: ['Inter', '-apple-system', 'sans-serif'],
},
fontSize: {
  xs: '12px',
  // ... mais tamanhos
}
```

## 🚀 Build para Produção

### Backend
```bash
cd ZionHub-Back-end
npm run build
npm start
```

### Frontend
```bash
cd ZionHub-Web
npm run build
npm start
```

## 🐛 Troubleshooting

### "Cannot find module" no backend
```bash
cd ZionHub-Back-end
rm -rf node_modules
npm install
```

### Port já está em uso
```bash
# Backend (3000)
sudo lsof -i :3000
sudo kill -9 <PID>

# Frontend (3001)
sudo lsof -i :3001
sudo kill -9 <PID>
```

### Conexão com Supabase falha
- Verifique as credenciais em `.env.local`
- Teste a conexão em `POST /health`
- Confirme que as migrations foram executadas

### JWT token inválido
- Limpe os cookies do navegador
- Faça login novamente
- Verifique se `JWT_SECRET` é o mesmo em backend e frontend

## 📝 Próximos Passos

### Features a Implementar (Baseado no roadmap)
1. **Escalação avançada** (Drag & Drop no web)
2. **Check-in/Check-out** (QR Code)
3. **Gamificação** (Pontos e Ranking)
4. **Notificações** (Email e WhatsApp)
5. **Relatórios** (Gráficos e analytics)
6. **Mobile** (React Native)

### Melhorias Sugeridas
- [ ] Adicionar testes unitários
- [ ] Implementar rate limiting mais robusto
- [ ] Adicionar cache com Redis
- [ ] Implementar WebSockets para real-time
- [ ] Adicionar analytics e tracking
- [ ] Criar CI/CD pipeline

## 📞 Suporte

Para questões técnicas:
1. Consulte `INSTRUCOES_CLAUDE_CODE.md` para especificações
2. Verifique os logs (`logs/` ou console)
3. Valide as variáveis de ambiente

## 🎉 Sucesso!

O projeto ZionHub está pronto para desenvolvimento!

Você pode agora:
- ✅ Fazer login
- ✅ Visualizar dashboard
- ✅ Criar eventos
- ✅ Gerenciar voluntários
- ✅ Acessar configurações

**Happy coding!** 🚀
