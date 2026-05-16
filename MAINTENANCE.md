# 🛠️ Manutenção e Próximos Passos

## 📊 Status Atual (2026-05-16)

**MVP Completo**: Roadmap Web v1.0.0
- ✅ Autenticação com JWT
- ✅ CRUD de roadmaps (offline-first)
- ✅ Landing page com benefits
- ✅ Dark mode padrão
- ✅ Componentização máxima
- ✅ Sincronização debounced (2s)

---

## 🚀 Próximos Passos (Prioridade)

### Fase 2: Sincronização Completa (Semanas 1-2)

**2.1 - DailyLog Sync** 
- [ ] Implementar POST/DELETE para registros diários
- [ ] Mapear campos (fiz→text, minutosEstudados→minutes, questoesFeitas→questions)
- [ ] Testes manuais de criação/edição/exclusão

**2.2 - TeacherRanking Sync**
- [ ] Implementar POST/PUT/DELETE para ranking de professores
- [ ] Mapear campos (teacherName→name, discipline→subject, score→rating)
- [ ] Integrar com syncManager

**2.3 - Vídeo Tutorial**
- [ ] Criar vídeo de 5-10 min mostrando como usar o site
- [ ] Usar roadmap "Interpretação de Textos" como exemplo
- [ ] Publicar em YouTube/Loom e embedar na landing page
- [ ] Adicionar botão "Ver Tutorial" na navbar

### Fase 3: Otimizações (Semanas 3-4)

**3.1 - Performance**
```bash
npm run build --report  # Analisar bundle
# Alvo: < 200KB gzipped (atual: 87.82KB ✅)
```
- [ ] Lazy load de componentes pesados
- [ ] Code splitting por rota
- [ ] Compressão de imagens/assets
- [ ] Monitorar Web Vitals

**3.2 - Caching Inteligente**
- [ ] Service Worker para offline
- [ ] Cache de responses da API
- [ ] Estratégia: network-first dados, cache-first assets

**3.3 - SEO**
- [ ] Meta tags (title, description, og:*)
- [ ] Sitemap.xml
- [ ] robots.txt

### Fase 4: Testes (Semanas 5-6)

**4.1 - Testes Unitários (Vitest)**
```bash
npm install --save-dev vitest happy-dom @vue/test-utils
```
- [ ] Tests para stores (roadmap, auth, dailyLog)
- [ ] Tests para composables (useSync)
- [ ] Tests para utils/validators
- [ ] Cobertura: 70%+

**4.2 - Testes E2E (Cypress)**
- [ ] Flow de login/registro
- [ ] Criar/editar/deletar roadmap
- [ ] Sincronização offline-first
- [ ] Dark mode

**4.3 - Testes Manuais**
- [ ] Testar em navegadores antigos (IE11? Não, obsoleto)
- [ ] Testar em mobile (iPhone, Android)
- [ ] Testar offline → online

---

## 🔧 Estratégias de Manutenção

### Git Workflow

```bash
# Branch naming
main                 # production
feature/xyz          # nova feature
bugfix/xyz          # correção
docs/xyz            # documentação

# Commits
git commit -m "feat: descrição curta"
git commit -m "fix: descrição do bug"
git commit -m "refactor: descrição"

# PRs
- Sempre fazer PR antes de merge em main
- Requer aprovação (quando houver time)
- CI/CD deve passar
```

### Deploy

**GitHub Pages** (Automático via Actions)
```
Push main → GitHub Actions → Build → Deploy
Tempo: ~1 min
URL: https://maisondev.github.io/roadmap-web/
```

**Versioning** (Semantic)
- **v1.0.0** → MVP com login + roadmaps + landing
- **v1.1.0** → Sync completo (dailyLog + teacher)
- **v1.2.0** → Otimizações
- **v1.3.0** → Testes
- **v2.0.0** → Mobile (React Native)

### Monitoramento

**Problemas Conhecidos:**
- [ ] Nenhum no momento (2026-05-16)

**Monitorar:**
- [ ] Error logs (Sentry - futuro)
- [ ] Performance (Web Vitals - futuro)
- [ ] User feedback (GitHub Issues)

---

## 📋 Checklist de Manutenção Semanal

- [ ] Verificar GitHub Issues
- [ ] Revisar console logs em produção
- [ ] Testar login/logout
- [ ] Testar sincronização offline
- [ ] Verificar bundle size
- [ ] Atualizar dependencies (npm outdated)
- [ ] Backup de dados no banco

---

## 🎯 Regras de Código

### Componentização (CRÍTICO)

**Nunca fazer:**
```typescript
// ❌ Lógica dentro do componente
<script setup>
const handleSync = async () => {
  const queue = syncManager.queue
  // ... 50 linhas de lógica aqui
}
</script>
```

**Fazer:**
```typescript
// ✅ Lógica em composables
export function useSync() {
  const handleSync = async () => { ... }
  return { handleSync }
}

// Componente apenas renderiza
<script setup>
const { handleSync } = useSync()
</script>
```

### TypeScript

```typescript
// ✅ OBRIGATÓRIO: Types explícitos
interface Props {
  title: string
  onClick?: () => void
}

// ❌ PROIBIDO: any
const props: any = defineProps(['title'])
```

### Dark Mode

```typescript
// ✅ Sempre suportar ambos
class="bg-white dark:bg-slate-800"
class="text-gray-900 dark:text-white"

// ❌ Hardcoded colors
class="bg-#ffffff"
```

---

## 📚 Documentação

### Adicionar/Atualizar:

- ✅ **CLAUDE.md** — Guidelines (frontend + backend)
- ✅ **CHANGELOG.md** — Releases
- ✅ **FRONTEND_PLAN.md** — Roadmap de features
- ✅ **MAINTENANCE.md** — Este arquivo (próximos passos)
- ❌ **ARCHITECTURE.md** — ADRs (Architecture Decision Records)
- ❌ **API.md** — Documentação de endpoints customizados
- ❌ **TESTING.md** — Guia de testes

---

## 🔐 Segurança

### Checklist de Segurança

- [x] Senha com bcrypt (backend)
- [x] JWT com expiração (30 dias)
- [x] HTTPS em produção
- [x] CORS configurado
- [ ] Rate limiting (API)
- [ ] Validação de input (backend)
- [ ] XSS protection (sanitize)
- [ ] CSRF tokens (se necessário)
- [ ] Audit logs (futuro)

### Dados Sensíveis

- ✅ Token em localStorage (SPA padrão)
- ✅ Senha nunca é transmitida em plain text
- ❌ Não salvar dados sensíveis em localStorage

---

## 💾 Backup & Disaster Recovery

**Banco de Dados** (PostgreSQL via Neon.tech)
- [ ] Backup automático (configurar no Neon)
- [ ] Teste de restore mensal
- [ ] Documentar processo de recuperação

**Código** (GitHub)
- [x] Repositório público como backup
- [ ] Tags de versão para releases

---

## 👥 Contribution Guidelines (Futuro)

Quando tiver colaboradores:

```markdown
1. Fork o repositório
2. Criar branch (feature/xyz)
3. Commit com mensagens descritivas
4. Push para seu fork
5. Abrir PR com descrição
6. Aguardar revisão + CI passar
7. Merge por maintainer
```

---

## 📞 Contatos & Recursos

- **Email**: maisongalvao@outlook.com
- **GitHub**: https://github.com/maisondev/roadmap-web
- **Backend**: https://github.com/maisondev/roadmap-api
- **Issues**: https://github.com/maisondev/roadmap-web/issues

### Stack

- Frontend: Vue 3 + TypeScript + Pinia + Tailwind
- Backend: Node.js + Express + Prisma + PostgreSQL
- Deploy: GitHub Pages + Railway
- Database: PostgreSQL (Neon.tech)

---

## ❓ FAQs de Manutenção

**P: Como adicionar uma nova página?**
A: Criar em src/pages/, adicionar rota em router/index.ts, importar componente.

**P: Como adicionar novo endpoint da API?**
A: Adicionar função em src/services/api.ts, chamar nos stores/composables.

**P: Como fazer release?**
A: Atualizar CHANGELOG.md, criar tag git (v1.x.x), GitHub Actions faz deploy.

**P: Dark mode não está funcionando?**
A: Verificar classe `dark:` em componentes, settings.ts theme default.

**P: Sincronização parou?**
A: Verificar console [SYNC], localStorage, status da API, token JWT.

---

**Última atualização**: 2026-05-16
**Próxima revisão**: 2026-05-30
**Responsável**: Maison Galvão
