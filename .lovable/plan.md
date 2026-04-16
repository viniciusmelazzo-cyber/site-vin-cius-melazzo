

## Plano: Site pronto para anúncios + venda da Solução-Planilha (acesso à Área do Cliente)

Dois blocos de trabalho que se complementam: **(A) Tracking & SEO** para rodar Meta + Google + TikTok com mensuração real, e **(B) Checkout em 1 clique** que vende o acesso à plataforma (Pix + Cartão) e libera login automaticamente.

### A. Pronto para anunciar (tracking, SEO, conversão)

1. **Tracking unificado (cookie consent + IDs)**
   - Banner LGPD discreto (rodapé) com "Aceitar / Recusar". Sem consentimento, **nenhum pixel dispara** (Consent Mode v2 do Google).
   - Instala 4 tags via `<script>` no `index.html` controladas por consentimento:
     - **Meta Pixel** (Instagram + Facebook)
     - **Google Tag (gtag.js)** com Google Ads + GA4
     - **TikTok Pixel**
     - **Google Tag Manager** (opcional, container único — recomendado para escalar)
   - Helper `src/lib/analytics.ts` com função `trackEvent(name, params)` que dispara para os 4 pixels de uma vez (`Lead`, `InitiateCheckout`, `Purchase`, etc.).

2. **Eventos de conversão padronizados**
   - `Lead` → submit dos formulários de contato e do Manual de Crédito Rural.
   - `InitiateCheckout` → clique em "Comprar planilha".
   - `Purchase` (com valor + currency BRL) → confirmação de pagamento (server-side via webhook + client-side fallback).
   - **Conversão server-side** via Meta CAPI e Google Enhanced Conversions a partir do webhook do Stripe — essencial pós iOS 17/ad-blockers, dobra a precisão do otimizador de campanha.

3. **SEO técnico + compartilhamento**
   - `sitemap.xml` e `robots.txt` revisados (já existe robots, falta sitemap).
   - **JSON-LD Schema.org** em `index.html`: `LocalBusiness` + `Person` (Vinícius) com `sameAs` apontando Instagram/LinkedIn/TikTok — melhora Knowledge Panel do Google.
   - Verifica meta tags Open Graph/Twitter por página (Empresarial, Rural, PF, Manual) — hoje só a home tem completas.
   - Cria `og-image` específica para a página da planilha.

4. **Páginas legais obrigatórias para anunciar**
   - `/privacidade` já existe ✓
   - **Cria `/termos-de-uso`** (exigido por Google Ads e Meta para aprovar a conta).
   - **Cria `/politica-reembolso`** (obrigatório para venda de produto digital — Stripe e Procon exigem).
   - Adiciona CNPJ + endereço no rodapé (Meta exige para anúncios de finanças).

5. **Performance & UX para pontuação de anúncios**
   - `<link rel="preload" as="image" type="image/avif">` da skyline NYC no `index.html` → melhora LCP (impacta Quality Score do Google Ads).
   - Verificar Web Vitals na home (LCP, CLS, INP).

### B. Carrinho/Checkout da Solução-Planilha (acesso ao sistema)

**Recomendação de provedor**: rodar `recommend_payment_provider` primeiro. Para venda de SaaS/acesso a plataforma no Brasil com Pix + Cartão, o caminho mais provável é **Stripe (built-in Lovable Payments)**, que suporta Pix e cartão BRL nativamente. Paddle não cobre Pix bem para o público BR — só confirmamos depois do recommend.

**Fluxo desenhado:**

```text
[ Landing /planilha ] -- Comprar --> [ Stripe Checkout (Pix+Cartão) ]
                                              |
                                       paga ✓ |
                                              v
                                  [ Webhook Stripe -> Edge Function ]
                                              |
                                              v
                            1. Cria registro em `purchases`
                            2. Gera `client_invites` token único
                            3. Resend envia e-mail: "Acesse seu sistema"
                            4. Dispara Meta CAPI + Google Conversion
                                              |
                                              v
                          [ /cliente/aceitar-convite?token=xxx ]
                          → cria conta, faz login, vai para /cliente/onboarding
```

**Implementação:**

1. **Habilitar Lovable Payments** (Stripe built-in, não BYOK).
2. **Criar 1 produto** "Sistema Melazzo - Acesso Vitalício" (ou mensal — definir preço com você).
3. **Página `/planilha`** (landing dedicada): demo da plataforma, screenshots do dashboard, CTA único "Quero acesso", preço destacado, garantia 7 dias, depoimentos, FAQ.
4. **Nova tabela `purchases`**: `id, email, stripe_session_id, amount, status, invite_token, created_at, paid_at`. RLS deny-all (só edge function service_role mexe).
5. **Edge Function `create-checkout`**: cria sessão Stripe Checkout com Pix+Cartão habilitados, success_url=`/obrigado?session={CHECKOUT_SESSION_ID}`.
6. **Edge Function `stripe-webhook`** (verify_jwt=false): valida assinatura, cria `purchase` + `client_invite`, dispara Resend com link, envia evento server-side para Meta CAPI e Google.
7. **Página `/obrigado`**: confirma pagamento, mostra "verifique seu e-mail", incentiva seguir Instagram (mais conversão social).
8. **Reutiliza** o fluxo de aceitação de convite que já existe em `client_invites` — não precisa criar onboarding novo.

### Estrutura de entrega (ordem de execução, ~3 etapas)

| Etapa | Entregáveis | Tempo |
|---|---|---|
| **1. Foundation legal + SEO** | /termos, /reembolso, sitemap, JSON-LD, CNPJ no footer, meta tags por página | Curto |
| **2. Tracking + LGPD** | Banner consent, 4 pixels, helper analytics, eventos Lead | Médio |
| **3. Checkout Stripe** | Recommend provider → enable → /planilha → tabela → 2 edge functions → /obrigado → eventos Purchase server-side | Maior |

### Decisões que preciso de você antes de codar (responda em texto livre se quiser):

1. **Preço da planilha/acesso**: R$ ___ (à vista) e/ou R$ ___ /mês?
2. **Modelo**: pagamento único (acesso vitalício) ou assinatura mensal/anual?
3. **CNPJ + endereço completo da Melazzo** para colocar no rodapé e nos termos.
4. **IDs de pixel**: você já tem conta Meta Business, Google Ads, TikTok Ads criadas? Se sim, vou pedir os IDs (Meta Pixel ID, GA4 Measurement ID, Google Ads Conversion ID, TikTok Pixel ID) na hora de instalar.

Após sua aprovação, executo nesta ordem: **Etapa 1 → Etapa 2 → recommend_payment_provider → Etapa 3**.

