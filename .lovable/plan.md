

# Plano: Plataforma de Gestão Financeira — Lançamentos sem fricção (WhatsApp + Foto + IA)

## Diagnóstico atual (o que vi)

Olhei a plataforma interna (`/cliente/dashboard`, `/cliente/lancamentos`, `ClientLayout`, `financial_entries`, `budgets`, `client_debts`, `onboarding_data`) e o gargalo é claro:

**O cliente só lança quando senta no computador.** Como toda planilha tradicional, ele esquece, acumula 15 dias de comprovantes e abandona. Esse é o motivo nº 1 de churn em SaaS financeiro pessoal — confirmado por benchmarks (Mobills, Organizze).

Pra justificar **R$ 39,90/mês ou R$ 450/ano**, a plataforma precisa de **3 atalhos de entrada de dado** que custem menos de 10 segundos:

1. **WhatsApp** ("Almoço 35" → categorizado em "Alimentação")
2. **Foto de recibo/cupom** (OCR + IA)
3. **PWA mobile** com botão flutuante "+ Lançar" em qualquer tela

---

## Resposta direta às suas perguntas

### 1. WhatsApp — sim, dá pra fazer (e bem feito)
**Não usamos a API oficial do WhatsApp Business** (cara, lenta de aprovar, exige Facebook Business verificado). Em vez disso, usamos **Twilio WhatsApp Sandbox → Twilio WhatsApp Business** (~US$ 0,005/msg, ativa em 1 dia, sem dor de cabeça regulatória).

**Fluxo:**
```text
Cliente envia: "Mercado 127,50"
   ↓
Twilio webhook → Edge Function (process-whatsapp)
   ↓
1. Identifica usuário pelo número de celular (campo phone em profiles)
2. Lovable AI (gemini-flash) interpreta: tipo, valor, categoria, data
3. Insere em financial_entries
4. Responde no WhatsApp: "✓ R$ 127,50 em Alimentação registrado. Saldo do mês: R$ 1.840"
```

Aceita também: foto do cupom, áudio ("anota aí, paguei 50 reais de uber"), múltiplos lançamentos numa msg só.

### 2. Foto de recibo/cupom — sim, com IA multimodal
Usamos **Gemini 2.5 Flash** (multimodal nativo, já incluído no Lovable AI, custo ~R$ 0,003 por foto). Ele lê o cupom, extrai estabelecimento + valor + data, e a IA decide a categoria baseada no histórico do cliente.

**Funciona em 2 lugares:**
- App web (botão "Tirar foto" em `/cliente/lancamentos`)
- WhatsApp (mandar a foto direto)

### 3. Bonus: comandos de voz e SMS-like
A mesma edge function que processa texto do WhatsApp processa qualquer entrada — então um "campo rápido" no dashboard ("digite: jantar 80") usa a mesma IA.

---

## Pacote de melhorias UX (4 pilares)

### Pilar 1 — Entrada de dados sem fricção (o coração)

| Ferramenta | Onde | Custo IA | Tempo do usuário |
|---|---|---|---|
| **Bot WhatsApp** | Twilio + edge function | ~R$ 0,005/msg | 5 segundos |
| **Foto de recibo** | Mobile + web | ~R$ 0,003/foto | 8 segundos |
| **Quick entry bar** | Dashboard ("uber 25") | ~R$ 0,001/req | 4 segundos |
| **Importar extrato CSV** | Banco do Brasil/Itaú/Nubank | grátis | 30 seg pra mês inteiro |
| **Lançamentos recorrentes** | Aluguel, Netflix, salário | grátis | 1x e nunca mais |

### Pilar 2 — Mobile first (PWA)

A plataforma hoje funciona em mobile mas **não está instalável**. Vamos:
- Transformar em **PWA instalável** (ícone na home do celular, abre fullscreen)
- **Botão flutuante "+"** em todas as telas (gesto de dedão, igual Nubank)
- Notificações push: "Você não lança há 3 dias. Tudo ok?" (opt-in)

### Pilar 3 — Inteligência preditiva

- **Auto-categorização aprendendo**: se "Uber" virou "Transporte" 3 vezes, na 4ª já vem certo sem perguntar
- **Detecção de duplicidade**: "Você já lançou R$ 35 no almoço hoje, é outro?"
- **Alertas inteligentes**: "Você está 80% do orçamento de Alimentação e ainda faltam 12 dias do mês"

### Pilar 4 — Engajamento (retenção mensal)

- **Resumo semanal por WhatsApp** (sexta 18h): "Esta semana: R$ 340 em Alimentação, R$ 120 a mais que a meta. Saldo: +R$ 850"
- **Streak de dias lançando** (gamification leve, igual Duolingo)
- **Insight do mês**: card no dashboard com 1 frase do Vinícius (gerada por IA): "Seus gastos com delivery cresceram 40% — vale revisar"

---

## Implementação (3 fases)

### Fase 1 — Quick wins de UX (1 sprint, sem custos novos)
- Quick entry bar no dashboard: campo único "digite seu gasto"
- Botão flutuante "+ Lançar" em mobile (todas as telas)
- Lançamentos recorrentes (template salvo, gera automaticamente todo mês)
- PWA básico (manifest + service worker, instalável)
- Auto-categorização por histórico (sem IA ainda, regra simples)

### Fase 2 — IA + Foto de recibo (1 sprint, usa Lovable AI)
- Edge function `parse-expense` (texto OU imagem → JSON estruturado)
- Botão "📷 Foto do recibo" no `/cliente/lancamentos` mobile
- Tela de confirmação rápida ("É isso? [Sim] [Editar]")
- Aprende categoria por estabelecimento por usuário

### Fase 3 — WhatsApp Bot + Resumos (1 sprint, exige Twilio)
- Cadastro Twilio WhatsApp (ajudo no passo a passo)
- Edge function `whatsapp-webhook` (recebe mensagens, valida número, processa)
- Tela de configuração: "Conectar meu WhatsApp" (vincula phone do profile)
- Resumo semanal automático (cron edge function)
- Notificações push opt-in para inatividade

---

## Decisões técnicas (resumo rápido)

- **IA**: Lovable AI (`google/gemini-3-flash-preview` para texto, `google/gemini-2.5-pro` para imagens) — sem API key extra
- **WhatsApp**: Twilio (~R$ 30/mês de uso médio por 100 usuários ativos) — secret `TWILIO_AUTH_TOKEN` será pedido na Fase 3
- **OCR**: Gemini multimodal direto (não precisa Tesseract/Google Vision separado)
- **PWA**: Vite PWA Plugin (`vite-plugin-pwa`)
- **Sem mudança de schema** na Fase 1. Fase 2 adiciona coluna `source` em `financial_entries` (`web|whatsapp|photo|voice`). Fase 3 adiciona tabela `whatsapp_links` (vincula número → user_id).

---

## Decisões que preciso de você antes de começar

1. **Por onde começamos?**
   - **A)** Fase 1 inteira (quick wins UX, sem custo novo) → entrega valor já, sem dependências externas
   - **B)** Pular direto pra Fase 2 (foto de recibo + IA) → "uau effect" mais rápido pro marketing
   - **C)** Tudo de uma vez (Fases 1+2+3) → 2-3x mais demorado, mas plataforma fica completa pra divulgar

2. **WhatsApp — qual nível de ambição?**
   - Bot **só recebe** lançamentos (mais simples)
   - Bot **conversa** ("quanto gastei essa semana?", "qual minha categoria que mais cresceu?") → vira mini-assistente financeiro

3. **Você topa pagar ~US$1 do Twilio Sandbox** (grátis pra testes, aí sim US$5-30/mês quando virar produção) ou prefere começar **só com foto + quick entry** e adicionar WhatsApp depois?

Após sua resposta, abro a Fase escolhida em tasks atômicas e codo.

