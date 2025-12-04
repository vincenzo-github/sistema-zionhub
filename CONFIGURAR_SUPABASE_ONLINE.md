# 🚀 Configurar Supabase ONLINE - Passo a Passo

## ✅ Status das Credenciais

Suas credenciais já estão configuradas no arquivo `.env`:

```
SUPABASE_URL=https://xzbwfsphfupcenwfwqpe.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔧 PRÓXIMOS PASSOS - Execute AGORA:

### PASSO 1: Acessar Supabase Dashboard

1. Acesse https://app.supabase.com
2. Faça login com sua conta
3. Selecione seu projeto "xzbwfsphfupcenwfwqpe"

### PASSO 2: Ir para SQL Editor

1. No menu esquerdo, clique em **SQL Editor**
2. Clique em **+ New Query**

### PASSO 3: Copiar e Executar a Migration

Copie TODO o conteúdo do arquivo:
```
ZionHub-Back-end/migrations/001_create_tables.sql
```

E cole no SQL Editor do Supabase.

Depois clique em **▶ Run** (ou `Ctrl + Enter`)

### PASSO 4: Verificar se criou as tabelas

Após executar, vá em **Table Editor** (no menu lateral) e verifique se as tabelas foram criadas:

- ✅ churches
- ✅ users
- ✅ ministries
- ✅ departments
- ✅ events
- ✅ event_assignments
- ✅ gamification_points
- ✅ e todas as outras...

### PASSO 5: Habilitar Row Level Security (RLS)

As políticas RLS já estão criadas na migration. Verifique:

1. Vá em **Authentication** → **Policies**
2. Selecione uma tabela (ex: `users`)
3. Veja as políticas de segurança

### PASSO 6: Testar Conexão do Backend

Agora execute o backend para testar:

```bash
cd ZionHub-Back-end
npm install
npm run dev
```

Se ver `Server running on port 3001` ✅, funcionou!

### PASSO 7: Testar um Endpoint

No terminal ou Postman, execute:

```bash
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "timestamp": "2024-12-03T..."
}
```

---

## 📋 Checklist de Verificação

- [ ] Supabase URL está correto
- [ ] ANON KEY foi copiado corretamente
- [ ] SERVICE ROLE KEY foi copiado corretamente
- [ ] Migration SQL foi executada sem erros
- [ ] Todas as tabelas foram criadas
- [ ] RLS foi habilitado
- [ ] Backend conecta ao Supabase
- [ ] GET /health retorna 200

---

## 🆘 Se der erro?

### Erro: "permission denied"
- Você precisa da **SERVICE_ROLE_KEY** para criar tabelas
- Confirme que está usando a chave correta no `.env`

### Erro: "relation already exists"
- Significa que as tabelas já foram criadas
- Você pode dropar tudo e refazer, ou pular esta etapa

### Erro: "Invalid request"
- Verifique se a SQL não tem erros de sintaxe
- Copie a SQL novamente com cuidado

### Backend não conecta ao Supabase
- Verifique se `SUPABASE_URL` está correto
- Teste o URL no navegador: deve ser um HTTPS válido

---

## 📝 Comandos Úteis

Ver dados de teste criados:
```sql
SELECT * FROM churches;
SELECT * FROM users;
SELECT * FROM ministries;
```

---

**Quando terminar tudo, avise para continuarmos com a implementação do Backend!**

Próximo passo será criar a estrutura completa de **Controllers, Services e Storage Layers** conforme especificado em `PROXIMOS_PASSOS_COMPLETOS.md`.
