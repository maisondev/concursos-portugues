
# 📊 BACKLOG PRIORITÁRIO - SINAPSES

**Data**: 16/05/2026  
**Contexto**: Sistema educacional PWA com foco em neuroaprendizagem e formação de hábitos  
**Abordagem**: Senior Architect & Educational Systems Analyst

---

## 🎯 VISÃO ESTRATÉGICA

Sinapses é um **sistema de retenção de hábitos educacionais**. Diferente de LMS tradicionais, sua proposição é:
- Criar rotinas diárias de estudo
- Gamificar progresso (dopamina)
- Feedback visual contínuo (neuroaprendizagem)
- Comunidade (teacher ranking)

**O maior risco hoje**: Usuário cria roadmap, estuda 2x, abandona. **Sem dashboard/streak visível = sem razão para voltar.**

---

## 📈 MATRIZ DE IMPACTO

| Prioridade | Impacto | Esforço | ROI | Sequência |
|-----------|---------|--------|-----|-----------|
| 🔴 P0 | Muito Alto | Médio | 9/10 | 1º Sprint |
| 🟡 P1 | Alto | Médio | 7/10 | 2º Sprint |
| 🟢 P2 | Médio | Baixo | 5/10 | 3º Sprint |

---

## 🔴 PRIORIDADE CRÍTICA (P0) - SPRINT AMANHÃ

### 1. **Dashboard Home com Visualização de Progresso** ⭐⭐⭐
**Por quê**: Neuroaprendizagem = feedback visual constante. Sem ver progresso = abandono em 3 dias.

**O que entregar**:
- Cards mostrando:
  - ✅ Dias consecutivos (STREAK) com visual impactante
  - 📊 Progresso semanal (% de metas cumpridas)
  - 🎯 Meta de hoje (tempo/questões) vs realizado
  - 📚 Próximo bloco/tópico a estudar (CTA claro)
- Motivação visual (cores vibrantes, ícones, animações)
- Responsivo mobile (será testado amanhã!)

**Acurácia**: Puxar dados de `dailyLog` + `settings` (dailyGoalMinutes, dailyGoalQuestoes)

**Estimativa**: 3-4h

---

### 2. **Mobile-First Otimização Completa** ⭐⭐⭐
**Por quê**: PWA deve funcionar MELHOR no mobile. Usuário estuda em qualquer lugar.

**Checklist**:
- [ ] Header/navbar responsivo (sem cutoff de texto)
- [ ] Breadcrumb em 4+ ramificações (já há issue)
- [ ] Modals com altura controlada (não preencher 100% da tela)
- [ ] Inputs com font-size ≥16px (evita zoom automático em iOS)
- [ ] Botões com padding adequado (hit target ≥44x44px)
- [ ] Scroll horizontal de tabs/abas (não quebra layout)
- [ ] Teste em iPhone 12, Samsung A50 (minion de riqueza)

**Estimativa**: 2-3h

---

### 3. **Notificações: UX Melhorado** ⭐⭐
**Por quê**: Há issue: notificações cortam texto em 2 linhas. Mensagens devem caber + ser legíveis.

**O que entregar**:
- Expandir altura de notificações no dropdown
- Página de notificações com mensagem COMPLETA (já existe, otimizar)
- Badge de notificações não lida (já está, validar)
- Espaçamento e legibilidade (dark mode + light mode)

**Estimativa**: 1-2h

---

## 🟡 PRIORIDADE ALTA (P1) - PRÓXIMA SEMANA

### 4. **Sistema de Streaks com Visualização** ⭐⭐⭐
**Por quê**: Hábito = neuroaprendizagem clássica. Streak visível = motivação.

**O que entregar**:
- Contador de dias consecutivos na navbar (ex: "🔥 7 dias")
- Breaking streak = notificação (reengagement)
- Histórico visual (últimos 30 dias com heatmap)
- Integrado ao `dailyLog` (já existe infraestrutura)

**Estimativa**: 2h

---

### 5. **Badges & Achievements Básico** ⭐⭐
**Por quê**: Gamification é FUNDAMENTAL em educação. Dopamina > razão pura.

**MVP**:
- 🏅 "Primeira aula" (ao criar 1º roadmap)
- 🔥 "Semana completa" (7 dias seguidos)
- 📚 "Bibliófilo" (adicionar 10 recursos)
- 🎯 "Meta master" (cumprir meta 5x seguidas)

**Banco**: Nova tabela `badges` + relação com User

**Estimativa**: 3-4h

---

### 6. **Analytics Básico para Admin** ⭐⭐
**Por quê**: SEM dados = sem melhoria. Admin precisa saber: rotatividade, taxa de abandono, features usadas.

**O que entregar**:
- Gráfico: novos usuários por dia
- Gráfico: usuários ativos (fizeram algo essa semana)
- Taxa de abandono (cadastrou, nunca voltou)
- Features mais usadas (que tipo de roadmap?)

**Estimativa**: 3-4h

---

## 🟢 PRIORIDADE MÉDIA (P2) - BACKLOG ESTENDIDO

### 7. **Recomendações Personalizadas**
- Sugerir próximo tópico baseado em histórico
- "Usuários como você estudam também..."

### 8. **Settings Reorganização (já há plano)**
- Sidebar + tabs (implementar plano pendente)

### 9. **Offline-First Melhoria**
- Retry automático melhorado
- Indicador visual de sync status (já existe, validar)

### 10. **Dark Mode Completo**
- Auditar todos os componentes (há inconsistências)

---

## 🚀 SEQUÊNCIA RECOMENDADA (AMANHÃ - 16/05)

### Morning (4-5h)
1. **Dashboard Home** ✅ Prioridade máxima
   - Cards de progresso
   - Streak display
   - Próximo tópico sugerido
   
2. **Mobile Otimization** ✅ Testar em paralelo
   - Ajustes de responsividade
   - Inputs e botões
   
### Afternoon (2-3h)
3. **Notificações UX** ✅ Quick win
   - Expandir cards
   - Validar dark mode

---

## 📋 CHECKLIST DE DECISÃO

- [ ] Dashboard é mais importante que badges? **SIM** - feedback visual > gamification
- [ ] Mobile test drive amanhã? **SIM** - é PWA, deve funcionar perfeito
- [ ] Streaming notificações já funciona? **SIM** - só precisa UX
- [ ] Dados de dailyLog estão sendo preenchidos? **VERIFICAR** - crítico para dashboard
- [ ] Meta diária é configurável no settings? **SIM** - usar esses valores

---

## ⚠️ DEPENDÊNCIAS & RISCOS

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| dailyLog vazio (ninguém usa) | Crítico | Testar: criar log manual em dev tools |
| Mobile quebrado (layout) | Alto | Teste com device real amanhã |
| Performance dashboard | Médio | Paginação/lazy load se houver muitos logs |
| Dark mode inconsistente | Médio | Auditar variáveis Tailwind |

---

## 🎓 LIÇÃO DE NEUROAPRENDIZAGEM

**Estrutura do Backlog segue princípios neuroeducacionais**:

1. **Visibilidade de Progresso** (dopamina) → Dashboard P0
2. **Hábitos** (neuroplasticidade) → Streaks P1
3. **Recompensa** (sistema de reforço) → Badges P1
4. **Social** (aprendizado colaborativo) → Ranking (já existe)
5. **Dados** (melhoria contínua) → Analytics P1

**Ordem importa**: Sem ver progresso, usuário não forma hábito. Sem hábito, badges são decoração.

---

**Próximas Ações**:
1. ✅ Testes mobile amanhã
2. ✅ Dashboard + mobile fixes (18h)
3. 📅 Streaks + badges (próxima semana)
4. 📅 Analytics (semana seguinte)

---

*Análise feita por: Claude (Senior Architecture Review)*  
*Contexto: MVP educacional com foco em retenção via neuroaprendizagem*
