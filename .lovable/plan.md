Plano de reestruturação

Objetivo
Integrar o projeto “Melazzo Demo Hub” dentro deste site, mantendo o hub de demonstrações como uma área restrita para ADMIN, e separar claramente os dois acessos existentes:

```text
Site público
├─ Botão principal: Área do Cliente
│  └─ /cliente/login → clientes comuns → dashboard/onboarding do cliente
│
└─ Rodapé: Central de Demonstrações + Área Restrita
   └─ /restrito/login → apenas ADMIN
      ├─ Central de Demonstrações → /restrito/demonstracoes
      └─ CRM interno Melazzo → /cliente/admin ou /cliente/admin/crm
```

O que será feito

1. Trazer o Melazzo Demo Hub para dentro deste projeto
- Copiar a estrutura principal do projeto “Melazzo Demo Hub”: páginas, componentes, dados mockados, hooks, imagens e layouts.
- Preservar a experiência visual e funcional do hub: showroom, demos Empresarial, Agro/Pecuária e Inadimplência/Cobrança.
- Isolar os arquivos copiados em um namespace próprio, por exemplo `src/demo-hub`, para evitar conflito com componentes e páginas já existentes neste site.
- Copiar os assets necessários do projeto Demo Hub, como imagens hero e logos, para uma pasta própria.

2. Ajustar as rotas do Demo Hub dentro do site atual
- O Demo Hub não ficará mais na raiz `/`, porque a raiz já é o site institucional.
- As rotas serão montadas sob uma base restrita:
  - `/restrito/demonstracoes` → showroom/central de demonstrações
  - `/restrito/demonstracoes/empresarial/*`
  - `/restrito/demonstracoes/agro/*`
  - `/restrito/demonstracoes/cobranca/*`
- As rotas internas do hub serão ajustadas para apontar para esse novo prefixo, sem quebrar a navegação entre showroom e módulos.

3. Proteger a Central de Demonstrações com login ADMIN real
- Remover ou ignorar o login fake/localStorage do projeto Demo Hub.
- Usar o sistema de autenticação já existente neste site, que consulta a sessão real e a tabela de papéis do usuário.
- A Central de Demonstrações será protegida com `ProtectedRoute requireAdmin`.
- Se o usuário não estiver logado, irá para a nova entrada restrita.
- Se estiver logado mas não for ADMIN, será redirecionado para a área do cliente, sem acesso ao hub.

4. Separar acesso do cliente e acesso restrito/admin
- Manter no topo do site o botão “Área do Cliente”, apontando para `/cliente/login`.
- Criar uma entrada separada para área restrita, apontando para algo como `/restrito/login`.
- Essa nova entrada usará o mesmo backend de autenticação, mas com intenção e textos próprios:
  - “Área Restrita”
  - “Acesso administrativo Melazzo”
  - “Central de Demonstrações e CRM interno”
- Ao logar por `/restrito/login`:
  - se for ADMIN, direcionar para uma tela de escolha/admin hub ou direto para `/restrito/demonstracoes` conforme a entrada clicada;
  - se não for ADMIN, bloquear com mensagem de acesso negado.

5. Atualizar o rodapé
- No rodapé atual, onde hoje existe “Área do Cliente”, criar uma seção mais clara de acessos.
- Incluir botão/link “Central de Demonstrações” apontando para `/restrito/demonstracoes`.
- Incluir botão/link “Área Restrita” apontando para `/restrito/login`, com destino administrativo/CRM interno.
- Manter o botão “Área do Cliente” no topo/site inicial como acesso do cliente.

6. Integrar o CRM interno Melazzo na área restrita
- O CRM já existe nas rotas admin atuais:
  - `/cliente/admin`
  - `/cliente/admin/crm`
  - `/cliente/admin/pf`
  - `/cliente/admin/pj`
  - etc.
- Vamos manter essas rotas protegidas por ADMIN.
- A nova “Área Restrita” funcionará como uma porta de entrada administrativa para esse CRM interno.
- Opcionalmente, dentro do layout admin, poderemos adicionar um item de menu “Central de Demonstrações” para alternar entre CRM e demos sem voltar ao site público.

7. Preservar o site institucional atual
- Não alterar a homepage institucional, páginas Empresarial/Rural/Pessoa Física, políticas, funil de leads ou área do cliente comum além dos links de acesso.
- A arquitetura pública continua intacta.
- O Demo Hub entra como novo módulo restrito, não substitui nenhuma página pública.

Detalhes técnicos

- O projeto atual já possui autenticação real e papéis em `user_roles`; isso será reaproveitado.
- Não será necessário criar novas tabelas no banco para essa etapa.
- Não armazenaremos permissão ADMIN em localStorage, nem usaremos senha hardcoded no frontend.
- O Demo Hub original usa `BrowserRouter`, `AuthProvider` fake e rotas na raiz. Na integração, isso será adaptado para rodar dentro do `BrowserRouter` atual.
- Componentes duplicados de UI serão avaliados caso a caso:
  - quando forem iguais aos atuais, reutilizar os existentes;
  - quando forem específicos do Demo Hub, manter em namespace próprio para preservar o visual.
- A biblioteca de gráficos merece atenção: o projeto atual usa `recharts` v2 e o Demo Hub usa v3. Antes de finalizar, será verificado se os gráficos do hub funcionam com a versão atual; se necessário, atualizar a dependência e testar os gráficos existentes do cliente para evitar regressão.
- Ajustar importações absolutas do Demo Hub de `@/...` para o novo namespace quando necessário.
- Copiar as classes/tokens visuais específicos do hub que ainda não existem no `index.css`, como tokens de `cobranca`, `agro-light`, `gold-dark`, `bg-linen-paper`, `melazzo-card`, `kpi-value`, etc., cuidando para não quebrar a identidade visual atual.

Arquitetura proposta de rotas

```text
Rotas públicas atuais
/                         Site institucional
/empresarial              Página pública empresarial
/rural                    Página pública rural
/pessoa-fisica            Página pública pessoa física
/cliente/login            Login e cadastro de clientes

Área do cliente
/cliente/dashboard
/cliente/lancamentos
/cliente/documentos
/cliente/configuracoes
...

Área admin/CRM atual
/cliente/admin
/cliente/admin/crm
/cliente/admin/pf
/cliente/admin/pj
/cliente/admin/leads
...

Nova área restrita
/restrito/login
/restrito/demonstracoes
/restrito/demonstracoes/empresarial/panorama
/restrito/demonstracoes/empresarial/faturamento
/restrito/demonstracoes/agro/visao-executiva
/restrito/demonstracoes/cobranca/visao-geral
...
```

Validação após implementação

- Verificar se o site público continua abrindo normalmente.
- Verificar se “Área do Cliente” leva ao login/fluxo de cliente.
- Verificar se “Central de Demonstrações” exige ADMIN.
- Verificar se usuário cliente comum não acessa a central restrita.
- Verificar se ADMIN acessa a central e o CRM interno.
- Verificar navegação interna dos três produtos do Demo Hub.
- Rodar build/testes para capturar erros de importação, rotas e dependências.