

## Plano: Extração e Aplicação da Logo Definitiva V+M

### Análise da imagem
A logo enviada (1024×1024) é um "poster" composto. Os elementos úteis são:
- **Monograma V+M**: M navy maciço (`#0a1f44`) com V sobreposto em grafite mais claro (`#3a4858`), criando efeito de transparência/camada
- **Detalhes premium**: respingos dourados nos cantos do bloco, arranhões finos dourados, textura grunge sutil de papel
- **Elementos a descartar**: texto "Dr. Vinícius Melazzo / OAB/SP 488.319" (rebranding consultoria), pinceladas navy nas bordas externas (ruído da geração), splatters distantes do monograma

### Estratégia de extração
Em vez de usar remoção automática de fundo (que apagaria a textura grunge dourada que dá personalidade), vou usar **crop + composição manual via Pillow**:

1. **Crop preciso** do monograma central (~px 350-720 horizontal, 280-630 vertical), preservando os splatters dourados próximos e a textura interna
2. **Remoção do texto inferior** "Dr. Vinícius Melazzo / OAB/SP 488.319" via crop (cortar antes da linha do texto)
3. **Conversão de fundo linen para transparente** com tolerância — manter respingos dourados e textura, descartar apenas o creme uniforme
4. **Refinamento de bordas** com leve feather para evitar serrilhado

### Assets a gerar (em `src/assets/`)
| Arquivo | Tamanho | Uso |
|---|---|---|
| `logo-vm-mark.webp` | 512×512 | Versão principal transparente, alta qualidade |
| `logo-vm-mark@2x.webp` | 1024×1024 | Retina/Hi-DPI |
| `logo-vm-mark-light.webp` | 512×512 | Versão clarificada para fundos navy escuros (boost de contraste do V grafite) |

Mantenho os atuais `logo-vm.webp` / `@2x` como fallback até validação.

### Atualização do componente Logo
`src/components/brand/Logo.tsx`:
- Trocar import para os novos assets `logo-vm-mark`
- `variant="onDark"` → carrega `logo-vm-mark-light.webp` (V grafite vira mais claro p/ ler em navy)
- `variant="onLight"` / `auto` → carrega `logo-vm-mark.webp` original
- Manter `srcSet` 1x/2x para retina
- Manter `drop-shadow` contextual (gold halo em fundos escuros, navy shadow em fundos claros)
- Aumentar tamanho default no Navbar de 40 → 48px para ganhar presença visual

### Atualização de favicons/PWA
Regenerar a partir do novo monograma limpo:
- `public/favicon.ico` (16/32/48)
- `public/favicon-16x16.png`, `favicon-32x32.png`
- `public/apple-touch-icon.png` (180×180)
- `public/icon-192.png`, `icon-512.png`
- `public/icon-maskable-512.png` (monograma centrado em fundo navy `#0a1f44` com safe area)

### QA visual
Após gerar, vou converter cada asset em PNG e inspecionar:
- Transparência limpa (sem halo creme ao redor)
- Textura grunge dourada preservada
- Legibilidade do V sobre o M
- Renderização nos fundos: navy (Hero), linen (Pilares), branco (Login)

### Arquivos editados
- ✏️ `src/components/brand/Logo.tsx` — novos imports + variantes
- ✨ `src/assets/logo-vm-mark.webp` (+ `@2x` + `-light`) — gerados
- ♻️ `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — regenerados

