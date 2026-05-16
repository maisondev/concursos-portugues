# 🏗️ Arquitetura - Roadmap

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    USUÁRIO (Browser)                         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  GitHub     │
                    │  Pages      │
                    │ (Frontend)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────────────┐
                    │   Vite (Build Tool)    │
                    │   Vue 3 + TypeScript   │
                    │   Tailwind + Pinia     │
                    └──────┬──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼─────┐    ┌──────▼──────┐
   │ API     │      │ LocalStore│    │  Service    │
   │ Service │      │ (offline) │    │  Worker     │
   │(HTTP)   │      │           │    │ (futuro)    │
   └────┬────┘      └───────────┘    └─────────────┘
        │
        │ JWT Bearer Token
        │ (Authorization header)
        │
        │          HTTPS
   ┌────▼──────────────────────────────────┐
   │        Railway (Backend)               │
   │     Node.js + Express + TypeScript    │
   │                                        │
   │  ┌──────────────────────────────────┐ │
   │  │      Routes (auth, roadmap,      │ │
   │  │      blocks, topics, etc)        │ │
   │  └──────────────────────────────────┘ │
   │               │                       │
   │  ┌────────────▼──────────────────────┐│
   │  │    Middleware (auth, cors)        ││
   │  └────────────┬──────────────────────┘│
   │               │                       │
   │  ┌────────────▼──────────────────────┐│
   │  │    Prisma ORM + Validation        ││
   │  └────────────┬──────────────────────┘│
   │               │                       │
   │  ┌────────────▼──────────────────────┐│
   │  │  PostgreSQL (Neon.tech)           ││
   │  │  (Users, Roadmaps, Blocks, etc)   ││
   │  └──────────────────────────────────┘ │
   └────────────────────────────────────────┘
```

---

## 🎯 Componentes Principais

### **Frontend (Vue 3 + TypeScript)**

#### **1. Structure**
```
src/
├── components/
│   ├── atoms/           # Componentes básicos (Button, Icon, Input)
│   ├── molecules/       # Combinações (Card, Badge, Modal)
│   ├── organisms/       # Complexos (NavBar, Form, List)
│   └── templates/       # Layouts (AppLayout, AppNavBar)
├── composables/         # Lógica reutilizável (useSync, useForm)
├── pages/              # Rotas (HomePage, RoadmapPage, etc)
├── stores/             # Pinia state (auth, roadmap, dailyLog, etc)
├── services/           # HTTP + Sync (api.ts, sync.ts)
├── router/             # Vue Router config
├── types/              # TypeScript interfaces
└── App.vue             # Componente raiz
```

#### **2. Fluxo de Dados**

```
User Interaction (UI)
        │
        ▼
Component/Page
        │
        ▼
Composable (useSync, useForm, etc)
        │
        ▼
Store (Pinia)
        │
        ├─ Otimistic Update (imediato)
        │
        ├─ syncManager.addAction()
        │  (queue para sincronizar)
        │
        ▼
API Service (api.ts)
        │
        ├─ localStorage (se offline)
        │
        ▼
Backend API
        │
        ▼
PostgreSQL
```

#### **3. Sync Manager (Offline-First)**

```
User faz ação (ex: criar roadmap)
        │
        ▼
addAction({ type, resource, data })
        │
        ├─ Gera ID único
        ├─ Armazena em localStorage
        ├─ Atualiza UI imediatamente
        │
        ▼
scheduleSyncWithDebounce() [2s]
        │
        ├─ Se outra ação vem, cancela timer
        ├─ Aguarda 2s sem ações
        │
        ▼
sync() [executa fila]
        │
        ├─ Para cada ação:
        │  ├─ Monta request correto (POST/PUT/DELETE)
        │  ├─ Envia via API Service
        │  ├─ Se sucesso: remove da fila
        │  ├─ Se erro: retry até 3 vezes
        │  │
        │  ├─ Se erro persistente:
        │  │  └─ Permanece em localStorage
        │  │     (sincroniza quando volta online)
        │
        ▼
localStorage.removeItem() [limpeza]
```

#### **4. Stores (Pinia)**

**Pattern Padrão:**
```typescript
export const useStoreXXX = defineStore('xxx', () => {
  // State
  const data = ref<Type[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  // Actions
  async function addItem(payload) {
    // 1. Validar
    if (!payload.title) throw new Error('...')
    
    // 2. Otimistic update
    const tempId = generateId()
    data.value.push({ id: tempId, ...payload })
    
    // 3. Queue para sync
    syncManager.addAction({
      type: 'create',
      resource: 'xxx',
      resourceId: tempId,
      data: payload,
      maxAttempts: 3
    })
  }
  
  return { data, isLoading, error, addItem }
})
```

**Stores Principais:**
- `auth.ts` — Login/registro, JWT token
- `roadmap.ts` — CRUD roadmaps + blocks + topics + resources
- `dailyLog.ts` — Registros diários (TODO: sync completo)
- `settings.ts` — Preferências (tema, language, goals)
- `teacherRanking.ts` — Rankings de professores (TODO: sync completo)

#### **5. Componentização (CRÍTICO)**

```
❌ Errado: 500 linhas em uma página
✅ Correto: Atoms → Molecules → Organisms → Pages

Exemplo: Feature de Comentários

components/
├── atoms/
│   ├── CommentBadge.vue (autor, data)
│   └── CommentInput.vue (textarea + validação)
├── molecules/
│   ├── CommentCard.vue (comentário + actions)
│   └── CommentList.vue (lista)
├── organisms/
│   └── CommentSection.vue (gerencia state)

composables/
└── useComments.ts (lógica CRUD)

stores/
└── comments.ts (estado global)
```

---

### **Backend (Node.js + Express + TypeScript)**

#### **1. Structure**
```
src/
├── routes/              # Express routes
│   ├── auth.ts         # POST /api/auth/register, /login
│   ├── roadmap.ts      # CRUD /api/roadmaps
│   ├── blocks.ts       # CRUD /api/roadmaps/:id/blocks
│   ├── topics.ts       # CRUD /api/topics
│   ├── resources.ts    # CRUD /api/resources
│   ├── logs.ts         # CRUD /api/logs
│   ├── teachers.ts     # CRUD /api/teachers
│   └── settings.ts     # GET/PUT /api/settings
├── middleware/          # Express middleware
│   ├── auth.ts         # Valida JWT
│   ├── cors.ts         # CORS config
│   └── errorHandler.ts # Centralized error handling
├── lib/                 # Utilities
│   ├── prisma.ts       # Prisma client singleton
│   └── config.ts       # Environment vars
├── types/              # TypeScript interfaces
│   └── index.ts        # User, Roadmap, etc
├── app.ts              # Express app setup
└── server.ts           # Entry point
```

#### **2. Request Flow**

```
Client HTTP Request
        │ (GET /api/roadmaps)
        │ (Authorization: Bearer JWT)
        │
        ▼
Express Router
        │
        ▼
authMiddleware
        ├─ Extrai Bearer token
        ├─ Valida JWT
        ├─ Injeta req.userId
        │
        ├─ ❌ JWT inválido? → res.status(401).json(...)
        │
        ▼
Route Handler
        │
        ├─ Try/Catch
        │ ├─ Validação de input
        │ ├─ Query ao Prisma
        │ ├─ Resposta JSON
        │ │
        │ └─ ❌ Erro? → res.status(500).json(...)
        │
        ▼
Prisma ORM
        │
        ├─ Monta SQL
        ├─ Executa no PostgreSQL
        │
        ▼
PostgreSQL
        │ (Users, Roadmaps, Blocks, Topics, Resources, etc)
        │
        ▼
Response JSON
        │
        ▼
Client
```

#### **3. Banco de Dados (Prisma Schema)**

```prisma
// User
model User {
  id        String  @id @default(cuid())
  email     String  @unique
  password  String  // bcrypt hash
  
  roadmaps  Roadmap[]
  logs      DailyLog[]
  settings  Settings?
  teachers  TeacherRanking[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Roadmap (usuario tem vários)
model Roadmap {
  id        String  @id @default(cuid())
  userId    String  @db.String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  title     String
  description String?
  category  String?
  tags      String[]
  status    String  @default("ativo") // ativo, pausado, concluido
  color     String?
  rating    Int?    @default(0)
  visibility String @default("private") // private, public
  order     Int     @default(0)
  
  blocks    Block[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, id])
}

// Block (roadmap tem vários blocos)
model Block {
  id        String  @id @default(cuid())
  roadmapId String
  roadmap   Roadmap @relation(fields: [roadmapId], references: [id], onDelete: Cascade)
  
  title     String
  priority  Int?
  order     Int     @default(0)
  
  topics    Topic[]
  
  @@index([roadmapId])
}

// Topic (bloco tem vários tópicos)
model Topic {
  id        String  @id @default(cuid())
  blockId   String
  block     Block   @relation(fields: [blockId], references: [id], onDelete: Cascade)
  
  title     String
  description String?
  status    String  @default("nao_iniciado") // nao_iniciado, em_progresso, concluido
  order     Int     @default(0)
  
  resources Resource[]
  
  @@index([blockId])
}

// Resource (tópico tem vários recursos)
model Resource {
  id        String  @id @default(cuid())
  topicId   String
  topic     Topic   @relation(fields: [topicId], references: [id], onDelete: Cascade)
  
  type      String  // video, article, pdf, link, etc
  title     String
  url       String
  seen      Boolean @default(false)
  rating    Int?    @default(0)
  order     Int     @default(0)
  
  @@index([topicId])
}

// DailyLog (usuario tem vários registros)
model DailyLog {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  date      String  // YYYY-MM-DD
  text      String? // o que fez
  minutes   Int?    // minutos estudados
  questions Int?    // questões feitas
  mood      Int?    // 1-5 (muito ruim até muito bom)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, date])
  @@index([userId])
}

// Settings (usuario tem um)
model Settings {
  id        String  @id @default(cuid())
  userId    String  @unique
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  theme               String  @default("dark")
  dailyGoalMinutes    Int     @default(60)
  dailyGoalQuestions  Int     @default(10)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// TeacherRanking (usuario pode rankear professores)
model TeacherRanking {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name      String  // nome do professor
  subject   String  // disciplina (Português, Math, etc)
  rating    Int     // 1-5 stars
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
}
```

#### **4. Autenticação (JWT)**

```
1. Cadastro (POST /api/auth/register)
   ├─ Email + Senha
   ├─ Validar (email @, senha 6+ chars)
   ├─ Hash senha com bcrypt (10 rounds)
   ├─ Criar User no DB
   ├─ Gerar JWT (30 dias)
   └─ Retorna { user: { id, email }, token: "eyJhb..." }

2. Login (POST /api/auth/login)
   ├─ Email + Senha
   ├─ Buscar user por email
   ├─ Comparar senha (bcrypt.compare)
   ├─ Gerar JWT (30 dias)
   └─ Retorna { user, token }

3. Protected Routes (GET /api/roadmaps)
   ├─ Header: Authorization: Bearer eyJhb...
   ├─ authMiddleware extrai token
   ├─ jwt.verify() com JWT_SECRET
   ├─ Injeta req.userId
   └─ Route handler usa req.userId para filtrar dados
   
4. Logout (Frontend)
   ├─ localStorage.removeItem(token)
   ├─ syncManager.clearQueue()
   ├─ Limpar stores
   └─ Redirect para login
```

---

## 🔄 Sincronização Deep Dive

### **Offline-First Architecture**

```
USER ONLINE          USER OFFLINE         USER VOLTAR ONLINE
    │                    │                      │
    ├─ Create roadmap    ├─ Create roadmap      ├─ Auto-sync queue
    │  (sync agora)      │  (queue local)       │  (1 por 1)
    │                    │                      │
    ├─ Update bloco      ├─ Update bloco        ├─ Verifica erros
    │  (sync agora)      │  (queue local)       │  (retry até 3x)
    │                    │                      │
    └─ (tudo OK)         └─ Dados locais OK     └─ (tudo sincronizado)
```

### **Debounce Strategy**

```
00:00 - User cria roadmap → addAction()
        Timer inicia (2s)

00:00.5 - User adiciona bloco → addAction()
          Timer resetado (2s)

00:01 - User adiciona tópico → addAction()
        Timer resetado (2s)

00:03 - 2s passaram sem ações
        sync() executa:
        ├─ POST /api/roadmaps
        ├─ POST /api/roadmaps/:id/blocks
        ├─ POST /api/topics
        └─ localStorage.clear()
```

### **Retry Logic**

```
sync() tenta POST /api/roadmaps

Tentativa 1: ❌ Timeout
├─ action.attempts++
└─ Reagendar em 5s

Tentativa 2: ❌ 500 Error
├─ action.attempts++
└─ Reagendar em 10s

Tentativa 3: ❌ 401 Unauthorized (token expirou)
├─ action.attempts++
├─ Logout automático
└─ Permanecer em localStorage

Se attempts >= 3:
└─ Log erro, remover da fila
   (usuário notificado)
```

---

## 🔐 Segurança

### **Frontend**
- ✅ JWT em localStorage (padrão SPA)
- ✅ XSS prevention via Vue (sanitization automática)
- ✅ HTTPS obrigatório em produção
- ✅ CSRF: não aplicável (token no header, não cookie)

### **Backend**
- ✅ Senhas: bcrypt (nunca plain text)
- ✅ JWT_SECRET em .env (nunca no código)
- ✅ Validação de input em todos endpoints
- ✅ CORS restrito para frontend
- ✅ Middleware de autenticação obrigatório
- ✅ SQL injection: Prisma previne

### **Database**
- ✅ PostgreSQL com SSL (Neon.tech)
- ✅ Backup automático
- ✅ Dados isolados por userId

---

## 📈 Performance

### **Frontend Metrics**
```
Bundle Size: 291KB (88KB gzipped) ✅
LCP: < 2.5s (Largest Contentful Paint)
FID: < 100ms (First Input Delay)
CLS: < 0.1 (Cumulative Layout Shift)
```

### **Backend Metrics**
```
Response time: < 200ms
Database queries: < 50ms (com index)
Concurrent users: ~1000 (Railway starter)
```

### **Otimizações**
- Lazy loading de rotas (Vue Router)
- Code splitting automático (Vite)
- Tailwind purge (unused CSS)
- IndexDB para cache local (futuro)
- Service Worker (futuro)

---

## 🚀 Deploy Pipeline

```
Developer                GitHub              GitHub Actions        GitHub Pages
    │                      │                      │                    │
    ├─ git push main ──────┤                      │                    │
    │                      │                      │                    │
    │                      ├─ Trigger action ────┤                    │
    │                      │                      │                    │
    │                      │                      ├─ npm install       │
    │                      │                      ├─ npm run build     │
    │                      │                      ├─ npm run build:ts  │
    │                      │                      │                    │
    │                      │                      ├─ Deploy dist/ ────┤
    │                      │                      │                    │
    │                      │                      │                    ├─ LIVE 🚀
    │                      │                      │                    │
    │                      │                      │  (~1 minuto)       │
```

---

## 🏆 Checklist Arquitetura

- [x] Atomic Design (atoms/molecules/organisms)
- [x] Offline-first + syncManager
- [x] Pinia stores tipados
- [x] API service centralizado
- [x] Error handling
- [x] Dark mode support
- [x] TypeScript strict mode
- [ ] Testes unitários (futuro)
- [ ] Testes E2E (futuro)
- [ ] WebSocket real-time (futuro)

---

**Última atualização**: 2026-05-16
