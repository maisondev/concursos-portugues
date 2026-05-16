# Roadmap Web - Frontend Guidelines

## 📋 Visão Geral

**Roadmap Web** é um PWA (Progressive Web App) para criação e acompanhamento de roadmaps de estudo com sincronização offline-first.

- **Stack**: Vue 3 + TypeScript + Pinia + Tailwind CSS
- **Modelo**: Offline-first com sincronização debounced (2s)
- **Autenticação**: JWT via Railway API
- **Status**: MVP com integração completa com backend

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── components/        # Componentes Vue (atoms, molecules, organisms)
├── composables/       # Composables Vue (useSync, etc)
├── pages/            # Pages/rotas principais
├── router/           # Configuração Vue Router
├── services/         # Serviços (api.ts, sync.ts)
├── stores/           # Pinia stores (auth, roadmap, dailyLog, etc)
├── types/            # TypeScript types e interfaces
├── data/             # Dados estáticos (roadmaps exemplo)
├── utils/            # Utilitários (helpers, validators)
├── design/           # Sistema de design (tokens, temas)
└── App.vue           # Componente raiz
```

### Fluxo de Dados

```
UI Component
    ↓
Composable / Store Action
    ↓
API Service (com sync manager)
    ↓
Backend API (Railway)
    ↓
PostgreSQL Database
```

### Princípios de Componentização

**CRÍTICO**: O sistema deve ser **maximamente componentizado**. Cada nova feature deve seguir rigorosamente:

1. **Atomic Design** (obrigatório)
   - **atoms/**: elementos base (AppButton, AppIcon, AppInput, AppModal)
   - **molecules/**: combinações de atoms (AppCard, AppBadge, StatCounter)
   - **organisms/**: componentes complexos (AppNavBar, AppForm, RoadmapCard)
   - **templates/**: layouts (AppLayout, AppNavBar)
   - **pages/**: rotas/páginas

2. **Props & Emits Tipados**
   ```typescript
   // ✅ CORRETO
   interface Props {
     title: string
     size?: 'sm' | 'md' | 'lg'
     disabled?: boolean
   }
   const props = withDefaults(defineProps<Props>(), { size: 'md' })
   
   // ❌ ERRADO
   const props = defineProps(['title', 'size'])
   ```

3. **Reutilização Máxima**
   - Nunca duplicar código HTML entre componentes
   - Se aparece em 2+ lugares, é um componente novo
   - Usar `<slot>` para variações

4. **Composables para Lógica**
   - Lógica complexa vai em composables, não em componentes
   - Exemplo: `useSync()`, `useFormValidation()`
   - Facilita testes e reutilização

5. **Exemplo: Feature Nova (Comentários)**
   ```
   ✅ Estrutura correta:
   
   components/
   ├── atoms/
   │   ├── CommentBadge.vue (status, autor, data)
   │   └── CommentInput.vue (textarea com validação)
   ├── molecules/
   │   ├── CommentCard.vue (comment + actions)
   │   └── CommentList.vue (lista de comments)
   ├── organisms/
   │   └── CommentSection.vue (gerencia state, integra lista + input)
   
   composables/
   └── useComments.ts (lógica de CRUD)
   
   stores/
   └── comments.ts (estado global de comentários)
   ```

6. **Checklist ao Criar Feature**
   - [ ] Dividi em atoms/molecules/organisms?
   - [ ] Props e emits estão tipados?
   - [ ] Componentizei lógica em composables?
   - [ ] Reutilizei componentes existentes?
   - [ ] Slot para variações?
   - [ ] Dark mode funciona?
   - [ ] TypeScript sem erros?

---

## 🎨 Tema e Dark Mode

### Dark Mode Padrão

- **Padrão**: Dark mode ativado por padrão em `index.html`
- **Detecção**: Script no `<head>` garante dark mode antes do render (sem flash)
- **Fallback**: Se localStorage vazio, aplicar dark mode
- **Toggle**: AppNavBar tem botão para alternar tema
- **Armazenamento**: `settings.store.theme` (localStorage)

**Importante**: Sempre testar componentes em ambos os modos!

```html
<!-- index.html inicia com dark mode -->
<html class="dark">
```

---

## 🎥 Recursos e Tutoriais

### Vídeo Tutorial (TODO - Fase 2)

- [ ] Criar vídeo de 5-10 minutos mostrando:
  1. Como se cadastrar
  2. Como criar um roadmap
  3. Como organizar blocos, tópicos e recursos
  4. Como usar offline-first
  5. Dashboard de progresso

- [ ] Exemplo: Usar roadmap "Interpretação de Textos" como case
- [ ] Plataforma: Loom ou YouTube
- [ ] Embedar na landing page (botão "Ver Tutorial")
- [ ] Adicionar link na navbar para visitantes

---

## 🔐 Autenticação

### Flow

1. **Cadastro**: `POST /api/auth/register` → cria User + retorna JWT
2. **Login**: `POST /api/auth/login` → retorna JWT
3. **Storage**: Token salvo em `localStorage` (`roadmap-auth-token-v1`)
4. **Headers**: Bearer token enviado em todas requisições (via `src/services/api.ts`)
5. **Logout**: Limpa token + sincroniza mudanças pendentes + limpa stores

### Requisitos

- Email obrigatório (validado no backend)
- Senha mín 6 caracteres
- Senha com bcrypt no backend
- Token expira em 30 dias

---

## 💾 Persistência: Offline-First com Sincronização

### Princípio

```
Ação local (instantâneo) → Fila de sincronização → Backend (2s depois)
```

### Implementação

- **Arquivo**: `src/services/sync.ts`
- **Debounce**: 2 segundos (agrupa mudanças)
- **Retry**: até 3 tentativas automáticas
- **Fallback**: localStorage se falhar (recupera ao voltar online)
- **Logout**: sincroniza tudo antes de deslogar

### Stores com Sincronização

- ✅ `roadmap.ts` — create/update/delete roadmaps
- 🔄 `dailyLog.ts` — (preparado, precisa implementar POST/DELETE)
- 🔄 `teacherRanking.ts` — (preparado, precisa implementar POST/DELETE)
- ⏸️ `settings.ts` — (apenas GET/PUT, sem fila)

---

## 📡 API Integration

### Base URL

```
VITE_API_URL = https://roadmap-production-badc.up.railway.app
```

Definido em `.env` e `.env.production`

### Endpoints Consumidos

| Método | Endpoint | Store | Status |
|--------|----------|-------|--------|
| POST | `/api/auth/register` | auth | ✅ |
| POST | `/api/auth/login` | auth | ✅ |
| GET | `/api/roadmaps` | roadmap | ✅ |
| POST | `/api/roadmaps` | roadmap | ✅ (sync) |
| PUT | `/api/roadmaps/:id` | roadmap | ✅ (sync) |
| DELETE | `/api/roadmaps/:id` | roadmap | ✅ (sync) |
| GET | `/api/logs` | dailyLog | ✅ |
| POST | `/api/logs` | dailyLog | ⏸️ (preparado) |
| DELETE | `/api/logs/:id` | dailyLog | ⏸️ (preparado) |
| GET | `/api/teachers` | teacherRanking | ✅ |
| POST | `/api/teachers` | teacherRanking | ⏸️ (preparado) |
| PUT | `/api/teachers/:id` | teacherRanking | ⏸️ (preparado) |
| DELETE | `/api/teachers/:id` | teacherRanking | ⏸️ (preparado) |

---

## 🎨 Padrões de Código

### Componentes

- **Atomic Design**: atoms (AppButton, AppIcon) → molecules → organisms → templates
- **Props**: tipadas com TypeScript
- **Emits**: usar `emits` do setup

### Stores (Pinia)

```typescript
export const useStoreXXX = defineStore('xxx', () => {
  const data = ref<Type>({})
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function actionName() {
    // syncManager.addAction() se autenticado
  }

  return { data, isLoading, error, actionName }
})
```

### Composables

```typescript
export function useComposable() {
  const state = ref()
  const computed = computed(() => ...)
  
  return { state, computed }
}
```

### Nomeação

- Componentes: `PascalCase` (AppButton.vue)
- Functions: `camelCase` (addRoadmap)
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case` ou `PascalCase` (match component name)

---

## 🔄 Sincronização: Guia Prático

### Adicionar ação à fila

```typescript
import { syncManager } from '@/services/sync'

syncManager.addAction({
  type: 'create',
  resource: 'roadmap',
  resourceId: newId,
  data: { title, description },
  maxAttempts: 3
})
```

### Monitorar status

```typescript
import { useSync } from '@/composables/useSync'

const { syncStatus, isSyncing, hasPending } = useSync()
// syncStatus = { text, color, icon }
```

### Debug no console

```
[SYNC] ➕ Ação adicionada
[SYNC] ⏱️  Agendando sync
[SYNC] 🔄 Iniciando sincronização
[SYNC] ✅ Sucesso
[SYNC] ❌ Erro
```

---

## ⚡ Performance

### Otimizações

- ✅ Lazy loading de routes
- ✅ Code splitting automático (Vite)
- ✅ Tailwind CSS otimizado
- ✅ Debounce (não spamma API)
- ✅ Offline-first (não depende de rede)

### Não fazer

- ❌ Chamadas HTTP síncronas
- ❌ Sem tratamento de erro
- ❌ Sem isLoading/error states
- ❌ Watch sem unmount cleanup

---

## 🧪 Testes

### Executar

```bash
npm run dev      # desenvolvimento
npm run build    # produção
npm run preview  # preview do build
```

### Manual

- ✅ Cadastro/Login offline
- ✅ Criar roadmap e aguardar 2s
- ✅ Deslogar com mudanças pendentes
- ✅ Login em outro dispositivo
- ✅ DevTools F12 → Console

---

## 📦 Dependências Principais

- `vue@3.4.0`
- `vue-router@4.3.0`
- `pinia@2.1.0`
- `tailwindcss@3.4.0`
- `@heroicons/vue@2.1.0`

---

## 🚀 Deploy

### GitHub Pages

- **Branch**: main
- **Action**: `.github/workflows/deploy.yml`
- **URL**: https://maisondev.github.io/roadmap-web/
- **Env**: `.env.production` com `VITE_API_URL=https://roadmap-production-badc.up.railway.app`

### Processo

1. Commit → push para main
2. GitHub Actions roda (build + deploy)
3. ~30s depois está live

---

## 🔍 Debugging

### Console logs úteis

```
[SYNC] — sincronização
[API] — requisições HTTP (implementar se necessário)
```

### DevTools

- **Vue DevTools**: inspeciona components e stores
- **Network**: vê requisições HTTP e status
- **Storage**: vê localStorage e sessionStorage

---

## 📝 Checklist de PR

- [ ] TypeScript sem errors (`npm run build`)
- [ ] Componentes em atomic design
- [ ] Stores tipadas
- [ ] isLoading + error states
- [ ] Sync integrado se necessário
- [ ] Console.log removido (exceto debug propositais)
- [ ] Commit message descritivo

---

## 📚 Recursos

- [Vue 3 Docs](https://vuejs.org)
- [Pinia Docs](https://pinia.vuejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Última atualização**: 2026-05-16
