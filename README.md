# 🗺️ Roadmap — Organize Seus Estudos com Inteligência

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/maisondev/roadmap-web?style=social)](https://github.com/maisondev/roadmap-web)
[![GitHub](https://img.shields.io/badge/GitHub-maisondev-black?logo=github)](https://github.com/maisondev/roadmap-web)

> Um PWA (Progressive Web App) offline-first para criar, organizar e acompanhar roadmaps de estudo com sincronização automática em tempo real.

**[Acesse o app →](https://maisondev.github.io/roadmap-web/)**

---

## ✨ Features Principais

### 📚 **Organize Seus Estudos**
- Crie múltiplos roadmaps para diferentes assuntos
- Divida em blocos (módulos) → tópicos → recursos
- Associe vídeos, artigos, PDFs e links a cada tópico
- Personalize com cores e categorias

### 📊 **Acompanhe Progresso em Tempo Real**
- Veja progresso por roadmap, bloco e tópico
- Registros diários de estudo (minutos, questões, mood)
- Streak counter — mantenha a consistência
- Dashboard com estatísticas detalhadas

### 📱 **Funciona Offline**
- Use a app sem internet
- Mudanças sincronizam automaticamente quando volta online
- Sincronização inteligente (debounce de 2s)
- Nunca perde dados

### 🔒 **Seus Dados Protegidos**
- Autenticação segura com JWT
- Senhas criptografadas com bcrypt
- Dados privados e só seus
- Sem tracking, sem ads

### 🎓 **Comunidade**
- Avalie e classifique seus professores
- Ranking de professores por disciplina
- Compartilhe feedback da comunidade

### 🌙 **Dark Mode Padrão**
- Interface moderna e profissional
- Reduz fadiga ocular
- Suporte completo a ambos temas

---

## 🚀 Quick Start

### Sem instalação (recomendado)

Acesse: **[https://maisondev.github.io/roadmap-web/](https://maisondev.github.io/roadmap-web/)**

1. Clique em "Cadastro"
2. Crie sua conta com email e senha
3. Comece a criar seus roadmaps!

### Desenvolvimento Local

**Requisitos:**
- Node.js 18+
- npm ou yarn

```bash
# Clonar repositório
git clone https://github.com/maisondev/roadmap-web.git
cd roadmap-web

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

Acesse `http://localhost:5173` no navegador.

---

## 📋 Como Funciona

### Fluxo Típico

```
1. Cadastro/Login
   ↓
2. Criar Roadmap
   └─ "Português para Concursos"
   ↓
3. Adicionar Blocos
   ├─ Gramática
   ├─ Literatura
   └─ Redação
   ↓
4. Adicionar Tópicos por Bloco
   └─ Gramática
      ├─ Verbos
      ├─ Pontuação
      └─ Concordância
   ↓
5. Adicionar Recursos por Tópico
   └─ Verbos
      ├─ Vídeo: "Conjugação verbal" (YouTube)
      ├─ Artigo: "Guia de verbos" (blog)
      └─ Exercícios: "1000 questões" (PDF)
   ↓
6. Marcar Progresso
   └─ Verbos (100% completo ✓)
   ↓
7. Acompanhar Dashboard
   └─ 3 roadmaps | 15 blocos | 50 tópicos | 40% progresso geral
```

---

## 🛠️ Stack Técnico

### Frontend
- **Vue 3** — Framework reativo
- **TypeScript** — Type safety
- **Pinia** — State management
- **Tailwind CSS** — Styling utilities
- **Vite** — Build tool rápido
- **Heroicons** — Icons

### Backend
- **Node.js + Express** — Server
- **TypeScript** — Type safety
- **Prisma ORM** — Database layer
- **PostgreSQL** — Database
- **JWT** — Autenticação
- **Bcrypt** — Password hashing

### Infraestrutura
- **GitHub Pages** — Frontend hosting
- **Railway** — Backend hosting
- **Neon.tech** — PostgreSQL hosting
- **GitHub Actions** — CI/CD

---

## 📱 Compatibilidade

| Navegador | Suporte |
|-----------|---------|
| Chrome/Edge | ✅ Completo |
| Firefox | ✅ Completo |
| Safari | ✅ Completo |
| Mobile (iOS/Android) | ✅ Completo |

**PWA**: Instale como app no seu celular ou desktop (Chrome/Edge)

---

## 🎥 Tutoriais & Docs

### Começar
- [Guia Rápido](CLAUDE.md#-autenticação) — Primeiros passos
- [Vídeo Tutorial](#) — 5 min mostrando features

### Documentação
- [CLAUDE.md](CLAUDE.md) — Guidelines de código (frontend + backend)
- [FRONTEND_PLAN.md](FRONTEND_PLAN.md) — Roadmap de features
- [MAINTENANCE.md](MAINTENANCE.md) — Manutenção e próximos passos
- [CHANGELOG.md](CHANGELOG.md) — Histórico de releases

---

## 🚀 Deploy

### Frontend (GitHub Pages)

Automático via GitHub Actions. A cada push em `main`:

```
Push → GitHub Actions → Build → Deploy → Live em 1 minuto
```

URL: `https://maisondev.github.io/roadmap-web/`

### Backend (Railway)

```bash
# Railway detecta automaticamente Node.js
# Variáveis de ambiente:
DATABASE_URL=postgresql://...
JWT_SECRET=sua-chave-secreta
NODE_ENV=production
```

---

## 🔐 Segurança

✅ **Autenticação Segura**
- JWT com expiração (30 dias)
- Refresh token automático
- Logout limpa dados locais

✅ **Criptografia**
- Senhas: bcrypt (10 rounds)
- Transmissão: HTTPS em produção
- Tokens: Bearer em Authorization header

✅ **Privacidade**
- Dados apenas do usuário autenticado
- Sem tracking de terceiros
- Sem compartilhamento de dados

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

### Passos

1. **Fork** o repositório
2. **Clone** seu fork
3. **Crie branch** (`git checkout -b feature/xyz`)
4. **Commit** suas mudanças (`git commit -m "feat: descrição"`)
5. **Push** para seu fork (`git push origin feature/xyz`)
6. **Abra PR** com descrição clara

### Diretrizes

- Seguir padrão de código em [CLAUDE.md](CLAUDE.md)
- Adicionar/atualizar testes se relevante
- Dark mode deve funcionar
- TypeScript sem erros
- Componentes maximamente reutilizáveis

---

## 📊 Roadmap (2026)

### ✅ v1.0.0 (Maio 2026)
- [x] MVP completo
- [x] Autenticação JWT
- [x] CRUD de roadmaps
- [x] Offline-first
- [x] Dark mode
- [x] Landing page

### ⏳ v1.1.0 (Junho 2026)
- [ ] Sync completo (dailyLog + teacher)
- [ ] Vídeo tutorial
- [ ] Otimizações de performance
- [ ] WebSocket para real-time

### 🔮 v1.2.0+ (Futuro)
- [ ] Testes automatizados
- [ ] Compartilhamento de roadmaps
- [ ] Colaboração em tempo real
- [ ] Mobile app (React Native)
- [ ] API pública para integrações

Veja [FRONTEND_PLAN.md](FRONTEND_PLAN.md) para detalhes completos.

---

## 🐛 Issues & Bugs

Encontrou um bug? [Abra uma issue!](https://github.com/maisondev/roadmap-web/issues)

**Template:**
```markdown
## Descrição
[Descreva o problema]

## Passos para reproduzir
1. ...
2. ...

## Comportamento esperado
[O que deveria acontecer]

## Comportamento atual
[O que está acontecendo]

## Ambiente
- Browser: Chrome 120
- OS: Windows 11
- App version: v1.0.0
```

---

## 💬 Feedback & Sugestões

Tem uma sugestão? [Abre uma discussão!](https://github.com/maisondev/roadmap-web/discussions)

---

## 📄 Licença

MIT © 2026 Maison Galvão

Veja [LICENSE](LICENSE) para detalhes.

---

## 📞 Contato

- **Email**: maisongalvao@outlook.com
- **GitHub**: [@maisondev](https://github.com/maisondev)
- **Issues**: [GitHub Issues](https://github.com/maisondev/roadmap-web/issues)

---

## 🙏 Agradecimentos

Inspirado por plataformas como:
- Khan Academy
- Coursera
- Notion
- Linear

Construído com ❤️ para estudantes e educadores.

---

<div align="center">

**[Acesse o app](https://maisondev.github.io/roadmap-web/)** • **[Veja o código](https://github.com/maisondev/roadmap-web)** • **[Reporte um bug](https://github.com/maisondev/roadmap-web/issues)**

Feito com Vue 3 + TypeScript + Tailwind CSS

</div>
