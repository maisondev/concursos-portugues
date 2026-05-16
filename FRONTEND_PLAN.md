# Frontend Development Plan - Roadmap Web

## 📋 Visão Geral

Este documento descreve o roadmap de desenvolvimento do frontend para os próximos meses. A prioridade é consolidar a integração com a API, melhorar a experiência do usuário e preparar para expansão (mobile, testes, performance).

---

## 🎯 Fases de Desenvolvimento

### Fase 1: Consolidação (Semanas 1-2) ✅ CONCLUÍDO

**Objetivos:**
- [x] API integration completa
- [x] Offline-first architecture
- [x] JWT authentication
- [x] CLAUDE.md documentation
- [x] Landing page com benefits

**Status:** 🟢 Concluído

---

### Fase 2: Sincronização Completa (Semanas 3-4) ⏳ PRÓXIMA

**Objetivos:**
- [ ] Sync para dailyLog (POST/DELETE)
- [ ] Sync para teacherRanking (POST/PUT/DELETE)
- [ ] Validação de dados antes de sincronizar
- [ ] Tratamento de conflitos (ex: atualizar durante sync)
- [ ] Testes manuais completos

**Subtarefas:**

#### 2.1 - DailyLog Sync
```typescript
// Adicionar em stores/dailyLog.ts
- addLog() → syncManager.addAction('create', 'log', ...)
- updateTodayLog() → usa POST /api/logs (upsert)
- deleteLog() → syncManager.addAction('delete', 'log', ...)
```

**Descrição:** O endpoint POST /api/logs faz upsert por (userId, date), então não precisa UPDATE separado. Apenas CREATE e DELETE.

#### 2.2 - TeacherRanking Sync
```typescript
// Adicionar em stores/teacherRanking.ts
- addEntry() → syncManager.addAction('create', 'teacher', ...)
- updateEntry() → syncManager.addAction('update', 'teacher', ...)
- deleteEntry() → syncManager.addAction('delete', 'teacher', ...)
```

**Mapeamento de campos:**
- `teacherName` ↔ `name`
- `discipline` ↔ `subject`
- `score` ↔ `rating`

#### 2.3 - Validação de Dados
- Validar antes de adicionar à fila
- Mostrar erro ao usuário se falhar validação
- Não adicionar à fila se inválido

#### 2.4 - Tratamento de Conflitos
- Se usuário atualizar enquanto sync está acontecendo
- Opção: requeue automático após sucesso de anterior
- Mostrar warning se múltiplas mudanças na mesma entidade

**Timeline:** 2 semanas (10 dias úteis)

---

### Fase 3: Otimizações (Semanas 5-6) ⏳ PLANEJADA

**Objetivos:**
- [ ] Code splitting otimizado
- [ ] Lazy loading de rotas
- [ ] Caching inteligente
- [ ] Compressão de assets
- [ ] Otimizar images

**Subtarefas:**

#### 3.1 - Performance Monitoring
- Adicionar biblioteca de web vitals
- Monitorar Core Web Vitals (LCP, FID, CLS)
- Relatório mensal de performance

#### 3.2 - Bundle Optimization
```bash
npm run build --report  # Analisar bundle size
# Alvo: < 200KB gzipped
```

#### 3.3 - Caching Strategy
- Service Worker para cache de assets
- Cache de responses de API
- Estratégia: network-first para dados, cache-first para assets

**Timeline:** 2 semanas

---

### Fase 4: Testes (Semanas 7-8) ⏳ PLANEJADA

**Objetivos:**
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração
- [ ] Testes E2E (Cypress)
- [ ] Cobertura mínima: 70%

**Escopo:**
- Stores (Pinia)
- Composables (useSync, etc)
- Componentes críticos (AppNavBar, RoadmapCard)
- API service

**Exemplo Vitest:**
```typescript
// tests/stores/roadmap.test.ts
import { setActivePinia, createPinia } from 'pinia'
import { useRoadmapStore } from '@/stores/roadmap'

describe('RoadmapStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add roadmap to queue', () => {
    const store = useRoadmapStore()
    const id = store.addRoadmap('Test', '', '', [])
    expect(id).toBeDefined()
  })
})
```

**Timeline:** 2 semanas

---

### Fase 5: Features Avançadas (Semanas 9-12) ⏳ PLANEJADA

**Objetivos:**
- [ ] Compartilhamento de roadmaps
- [ ] Colaboração em tempo real
- [ ] Comentários e discussões
- [ ] Sistema de notificações
- [ ] Pesquisa global melhorada

**Subtarefas:**

#### 5.1 - Share Links
- Gerar link público para roadmap
- Permitir visualização sem login
- Opção de permitir comentários

#### 5.2 - Real-time Collaboration
- WebSocket para atualizações em tempo real
- Presença de usuários (quem está visualizando)
- Cursor multiplayer (tipo Google Docs)

#### 5.3 - Comments & Discussion
- Sistema de comentários por recurso
- Threads de discussão
- Notificações

#### 5.4 - Notifications
- In-app notifications
- Email notifications (opcional)
- Webhook integration

**Timeline:** 4 semanas

---

### Fase 6: Mobile App (Semanas 13+) ⏳ FUTURO

**Objetivos:**
- [ ] React Native app (iOS + Android)
- [ ] Sincronização bidirecional
- [ ] Push notifications
- [ ] Offline mode completo

**Stack:**
- React Native
- Expo
- Reutilizar API cliente
- SQLite para persistência local

**Timeline:** 6+ semanas

---

## 🔧 Arquitetura e Padrões

### Estrutura de Stores

```typescript
// Padrão estabelecido
export const useStoreXXX = defineStore('xxx', () => {
  const data = ref<Type[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  function addItem(payload) {
    syncManager.addAction({
      type: 'create',
      resource: 'xxx',
      resourceId: id,
      data: payload,
      maxAttempts: 3
    })
    // Otimistic update
    data.value.push(item)
  }
  
  return { data, isLoading, error, addItem }
})
```

### Estrutura de Componentes

```
Atomic Design:
- atoms/    (AppButton, AppIcon, AppInput)
- molecules/ (AppCard, AppModal)
- organisms/ (AppNavBar, AppForm)
- templates/ (AppLayout)
- pages/    (HomePage, SettingsPage)
```

---

## 📊 Métricas de Sucesso

| Métrica | Meta | Status |
|---------|------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | ⏳ |
| FID (First Input Delay) | < 100ms | ⏳ |
| CLS (Cumulative Layout Shift) | < 0.1 | ⏳ |
| Bundle Size | < 200KB | ⏳ |
| Test Coverage | > 70% | ⏳ |
| Lighthouse Score | > 90 | ⏳ |

---

## 🚀 Deploy Timeline

| Fase | Sprint | Deploy |
|------|--------|--------|
| 1 | Semana 1-2 | v1.0.0 (2026-05-16) |
| 2 | Semana 3-4 | v1.1.0 (2026-05-30) |
| 3 | Semana 5-6 | v1.2.0 (2026-06-13) |
| 4 | Semana 7-8 | v1.3.0 (2026-06-27) |
| 5 | Semana 9-12 | v1.5.0 (2026-07-25) |
| 6 | Semana 13+ | v2.0.0 (Mobile) |

---

## 🔍 Dependências e Ferramentas

### Adicionar em Fase 2-3
```bash
# Testing
npm install --save-dev vitest happy-dom @vue/test-utils

# Performance
npm install web-vitals

# Service Worker
npm install -D workbox-webpack-plugin

# Monitoring (futuro)
npm install @sentry/vue
```

### Remover/Deprecate
- ~~localStorage direto~~ (usar API)
- ~~/api/health polling~~ (usar WebSocket)

---

## 📝 Documentação

### Criar
- [ ] Architecture Decision Records (ADRs)
- [ ] API Integration Guide
- [ ] Component Storybook
- [ ] User Guide (em Português)

### Manter Atualizado
- ✅ CLAUDE.md (guidelines)
- ✅ CHANGELOG.md (releases)
- ✅ FRONTEND_PLAN.md (este arquivo)

---

## 🎓 Lições Aprendidas

### Do MVP (2026-05-16)

1. **Offline-first foi a escolha certa**
   - Usuários esperam que mudanças sejam instantâneas
   - Debounce de 2s é invisível para usuario
   - Retry automático resolve 99% dos problemas

2. **API-first simplifica arquitetura**
   - Não manter duplicação de dados (local + API)
   - Um store por recurso, sincronizado via API
   - Logout automático em 401 foi essencial

3. **Token em localStorage é seguro para SPA**
   - XSS ainda é risco, mas mitigado por Content-Security-Policy
   - Alternativa (httpOnly) não funciona bem com SPA

4. **Vite + Tailwind + Vue 3 é combinação ótima**
   - Dev experience excelente
   - Build rápido
   - HMR funciona perfeitamente

---

## ❓ Perguntas Abertas

- Quando implementar mobile? (Fase 6 ou paralelamente?)
- Usar Storybook ou testes visuais?
- Monitorar com Sentry ou observability própria?
- Será necessário CDN para assets?

---

## 📞 Contato e Feedback

- Issues: [GitHub Issues](https://github.com/maisondev/roadmap-web/issues)
- Discussions: [GitHub Discussions](https://github.com/maisondev/roadmap-web/discussions)
- Email: maisongalvao@outlook.com

---

**Última atualização:** 2026-05-16
**Versão do plano:** 1.0
**Próxima revisão:** 2026-05-30
