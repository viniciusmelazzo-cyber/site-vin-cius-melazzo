Plano para corrigir o login restrito e o redirecionamento

1. Reestruturar o fluxo da página `/restrito/login`
- Transformar a tela em um login administrativo com escolha clara de destino:
  - Central de Demonstrações
  - CRM Interno
  - Painel Administrativo
- Remover a dependência confusa apenas do parâmetro `?next=...` como única forma de decisão.
- Permitir que o usuário escolha o destino antes de entrar, mantendo compatibilidade com links existentes como `/restrito/login?next=crm` e `/restrito/login?next=demos`.

2. Corrigir o bug de redirecionamento após login
- Hoje o login restrito faz `signInWithPassword`, consulta a role manualmente e navega imediatamente.
- Ao mesmo tempo, o `AuthProvider` também está atualizando sessão/role de forma assíncrona, o que pode gerar corrida entre autenticação, carregamento de role e redirecionamento.
- Vou ajustar para que o redirecionamento só aconteça depois da confirmação segura de que o usuário tem role `admin`.
- Se o usuário não for admin, será deslogado e ficará bloqueado, sem cair em telas restritas.

3. Blindar o `ProtectedRoute` para rotas restritas
- Manter `/restrito/demonstracoes/*` protegido por ADMIN.
- Ajustar o redirecionamento de usuários sem sessão para preservar o destino original, por exemplo:
  - acesso direto a `/restrito/demonstracoes` leva para `/restrito/login?next=demos`
  - acesso ao CRM interno leva para `/restrito/login?next=crm`
- Evitar redirecionar cedo demais enquanto perfil/roles ainda estão carregando.

4. Melhorar a experiência de seleção pós-login
- Após login ADMIN, enviar o usuário exatamente para a plataforma escolhida.
- Se já estiver logado como ADMIN e entrar em `/restrito/login`, mostrar/usar a escolha de plataforma sem gerar loop estranho.
- Se estiver logado como cliente comum, bloquear acesso restrito com mensagem clara e redirecionar para a área do cliente.

5. Corrigir avisos que aparecem na Central de Demonstrações
- Os logs mostram warnings de `ref` em `CountUp` e `ShowroomFooter` usados por componentes animados.
- Vou revisar esses componentes e aplicar `React.forwardRef` onde necessário, para evitar ruído e possíveis instabilidades visuais.

6. Testes que vou executar após implementar
- Build do projeto.
- Fluxos manuais no preview:
  - abrir `/restrito/login`
  - escolher Central de Demonstrações e logar como ADMIN
  - acessar `/restrito/demonstracoes` diretamente
  - escolher CRM Interno e confirmar ida para `/cliente/admin/crm`
  - tentar rota restrita sem sessão e validar redirecionamento para login
  - validar que usuário sem ADMIN não acessa a central restrita
- Verificar console e rede para identificar erro real de login/redirecionamento, se ainda aparecer.

Detalhes técnicos
- Arquivos principais a alterar:
  - `src/pages/cliente/RestrictedLogin.tsx`
  - `src/components/ProtectedRoute.tsx`
  - possivelmente `src/hooks/useAuth.tsx`, se for necessário separar melhor carregamento de sessão e carregamento de roles
  - `src/components/ui/count-up.tsx`
  - `src/components/showroom/ShowroomFooter.tsx`, se confirmado o problema de ref
- Não será necessário alterar as regras do banco neste momento, pois a tabela `user_roles` já existe e a proteção ADMIN já usa role separada, como recomendado.