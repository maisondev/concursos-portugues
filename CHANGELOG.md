# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

---

## [Unreleased]

### Adicionado
- Landing page com apresentação dos benefícios do sistema
- Modal de autenticação (cadastro/login) na landing page
- Condicional na HomePage para mostrar landing quando não logado
- Documentação completa em CLAUDE.md (frontend e backend)
- Plano de desenvolvimento frontend

### Melhorado
- Reorganização da estrutura de rotas e páginas

---

## [1.0.0] - 2026-05-16

### Adicionado

#### Autenticação e API Integration
- Serviço `api.ts` centralizado com Bearer token automático
- Integração completa com backend API (Railway)
- Autenticação via JWT (30 dias de validade)
- Modal de login/cadastro integrado na navbar
- Logout automático em caso de erro 401
- Sincronização de mudanças pendentes antes de logout

#### Offline-First Architecture
- Sistema de fila de sincronização (`SyncManager`)
- Debounce de 2 segundos para agrupar mudanças
- Retry automático até 3 vezes
- Persistência da fila em localStorage
- Indicador de status na navbar (sincronizando/aguardando/sincronizado)
- Composable `useSync()` para monitorar status

#### Stores com API Integration
- `roadmap.ts` — sincronizado com `/api/roadmaps`
- `dailyLog.ts` — sincronizado com `/api/logs`
- `settings.ts` — sincronizado com `/api/settings`
- `teacherRanking.ts` — sincronizado com `/api/teachers`
- `auth.ts` — registra/login com `/api/auth`

#### Build e Deploy
- Configuração de ambiente (`.env`, `.env.production`)
- Vite base path configurado para `/roadmap-web/`
- GitHub Actions para deploy automático em GitHub Pages
- Suporte para variáveis de ambiente em produção

#### UI/UX
- Indicador de sincronização com animações
- Contador de streak de dias (estudo diário)
- Indicador de status do servidor (desativado, será WebSocket)
- Dark mode suportado em todos componentes

#### Documentação
- CLAUDE.md para frontend com arquitetura, padrões, endpoints
- CLAUDE.md para backend com endpoints, schema, deploy

### Alterado

#### HomePage.vue
- Renovação da página inicial com melhor layout
- Filtros por nome e status
- Busca global em todos roadmaps
- Import/export de roadmaps em JSON
- Visualização de atividade recente

#### AppNavBar.vue
- Integração com sync status
- Indicador de servidor online/offline
- Contador de streak dias consecutivos
- Modal de auth embutido

#### Settings
- Reorganização da estrutura de settings
- Separação entre dados locais e sincronizados

### Corrigido
- GitHub Pages 404 error (vite base path)
- Roadmaps persistindo após logout
- Health check chamando API desnecessariamente
- Sincronização visível com console logs detalhados

### Removido
- Polling de `/api/health` a cada 10s
- LocalStorage direto nos stores (tudo via API)
- Funcionalidade de servidor status (será WebSocket)

---

## Development

### Próximas Etapas
- [ ] Implementar POST/DELETE para dailyLog sync
- [ ] Implementar POST/PUT/DELETE para teacherRanking sync
- [ ] Landing page com benefits
- [ ] Otimizações de performance
- [ ] Testes automatizados
- [ ] WebSocket para status do servidor
- [ ] Mobile app (React Native)

### Conhecidos Problemas
- Nenhum conhecido no momento

---

## Notas de Compatibilidade

- **Frontend Stack**: Vue 3 + TypeScript + Pinia + Tailwind CSS
- **Backend Stack**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Navegadores Suportados**: Chrome, Firefox, Safari, Edge (últimas 2 versões)
- **Node.js Mínimo**: 16.x

---

## Versionamento

Este projeto segue [Semantic Versioning](https://semver.org/):
- **MAJOR**: mudanças incompatíveis (ex: mudança de schema)
- **MINOR**: novas features compatíveis (ex: novo campo)
- **PATCH**: bugfixes (ex: correção de layout)

---

**Última atualização**: 2026-05-16
