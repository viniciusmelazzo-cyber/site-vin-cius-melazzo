import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, PlusCircle, Landmark, Wallet, Upload, Settings, TrendingUp,
  CreditCard, FileDown, Camera, Target, BarChart3, Shield, HelpCircle, BookOpen,
  ChevronRight, CheckCircle2, AlertTriangle, Lightbulb,
} from "lucide-react";

const sections = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    subtitle: "Seu painel financeiro completo",
    color: "text-accent",
    content: [
      {
        heading: "Resumo Financeiro Mensal",
        text: "O dashboard exibe automaticamente os totais de Receitas, Despesas e Saldo do mês selecionado. Utilize as setas de navegação para consultar meses anteriores.",
      },
      {
        heading: "Visão Temporal (Gráfico de Evolução)",
        text: "No topo do dashboard, selecione o período de análise: Mês Atual, 3 meses, 6 meses, 12 meses ou Ano (YTD). O gráfico de área mostra a evolução de Receitas, Despesas e Resultado ao longo do tempo, com comparação percentual versus o período anterior.",
      },
      {
        heading: "Gráfico de Despesas por Categoria",
        text: "O gráfico de barras agrupa automaticamente suas despesas por categoria (Alimentação, Transporte, Moradia, etc.), permitindo identificar rapidamente onde o dinheiro está indo.",
      },
      {
        heading: "DRE — Demonstrativo de Resultados",
        text: "O DRE Pessoa Física oferece visões mensal, trimestral e anual. Ele separa despesas fixas, variáveis e outras, calculando o resultado operacional e líquido. Logo abaixo, 7 indicadores financeiros avaliam sua saúde financeira com status visual (verde, amarelo, vermelho).",
      },
      {
        heading: "Indicadores Financeiros",
        text: "• Comprometimento da Renda (ideal ≤ 70%)\n• Taxa de Poupança (ideal ≥ 15%)\n• Índice de Despesas Fixas (ideal ≤ 50%)\n• Índice de Despesas Variáveis (ideal ≤ 20%)\n• Cobertura de Emergência (ideal ≥ 6 meses)\n• Índice de Endividamento (ideal ≤ 30%)\n• Capacidade de Pagamento Mensal",
      },
      {
        heading: "Timeline de Evolução",
        text: "Acompanhe a evolução do seu Patrimônio Líquido e Health Score ao longo dos meses. Clique em 'Salvar Snapshot do Mês' para registrar uma fotografia do mês atual na timeline.",
      },
      {
        heading: "Exportar Relatório PDF",
        text: "O botão 'Exportar Relatório PDF' gera um documento profissional com a marca Melazzo contendo: capa personalizada, DRE completo, indicadores, patrimônio, orçamento, parcelamentos e evolução histórica.",
      },
    ],
  },
  {
    id: "lancamentos",
    icon: PlusCircle,
    title: "Lançamentos",
    subtitle: "Registre receitas e despesas",
    color: "text-finance-positive",
    content: [
      {
        heading: "Criar um Lançamento",
        text: "Clique em 'Novo Lançamento' e preencha: Tipo (Receita ou Despesa), Categoria, Descrição, Valor e Data. A data do lançamento é a data efetiva do gasto ou recebimento — use-a para registrar corretamente quando o evento financeiro ocorreu.",
      },
      {
        heading: "Lançamento Parcelado",
        text: "Ao criar um novo lançamento, ative o switch 'Parcelado?' e informe o número de parcelas (2 a 72). O sistema criará automaticamente um lançamento por mês, com descrição numerada (ex: 'Netflix (1/12)'). Todas as parcelas são vinculadas ao mesmo grupo.",
      },
      {
        heading: "Parcelamentos Ativos",
        text: "No topo da tela, um painel mostra todos os parcelamentos em andamento com barra de progresso, quantidade de parcelas pagas, parcelas restantes e valor total. Você pode excluir um parcelamento inteiro clicando no ícone de lixeira.",
      },
      {
        heading: "Editar e Excluir",
        text: "Na tabela de lançamentos, use o ícone de lápis para editar ou o ícone de lixeira para excluir. Ao editar um lançamento parcelado, apenas a parcela individual é alterada.",
      },
      {
        heading: "Categorias Disponíveis",
        text: "Salário, Freelance, Investimentos, Aluguel, Alimentação, Transporte, Saúde, Educação, Lazer, Moradia, Cartão de Crédito e Outros.",
      },
    ],
  },
  {
    id: "patrimonio",
    icon: Landmark,
    title: "Patrimônio",
    subtitle: "Balanço patrimonial pessoal",
    color: "text-primary",
    content: [
      {
        heading: "Patrimônio Líquido",
        text: "O patrimônio líquido é calculado automaticamente: Ativos (Liquidez + Imobilizado) menos Passivos (Dívidas). Um patrimônio positivo indica que seus bens superam suas dívidas.",
      },
      {
        heading: "Liquidez e Investimentos",
        text: "Inclui: Poupança, CDB/LCI/LCA, Tesouro Direto, Ações e Fundos, Previdência Privada, Criptomoedas, FGTS e Outros Investimentos. Estes valores vêm do seu onboarding e são atualizados automaticamente.",
      },
      {
        heading: "Ativos Imobilizados",
        text: "Bens de longo prazo: Imóvel Principal, Outros Imóveis, Veículos, Joias e Relógios, Equipamentos, Estoque, Gado e Outros Bens.",
      },
      {
        heading: "Passivos (Dívidas)",
        text: "Todas as obrigações financeiras: Financiamentos, Empréstimos, Consórcios, Dívidas em Atraso, Saldo de Financiamento Imobiliário e Dívidas Parceladas registradas.",
      },
      {
        heading: "Gráfico de Composição",
        text: "O gráfico donut mostra visualmente a proporção entre Liquidez, Imobilizado e Passivos, facilitando a análise da saúde patrimonial.",
      },
    ],
  },
  {
    id: "orcamento",
    icon: Wallet,
    title: "Orçamento Base Zero",
    subtitle: "Planeje cada real — método 50/30/20",
    color: "text-accent",
    content: [
      {
        heading: "O que é Orçamento Base Zero?",
        text: "O OBZ (Orçamento Base Zero) exige que cada real seja planejado antes de ser gasto. O método 50/30/20 distribui sua renda em: até 50% para Despesas Fixas, até 30% para Despesas Variáveis e no mínimo 20% para Investimentos/Poupança.",
      },
      {
        heading: "Criar um Orçamento",
        text: "Clique em 'Adicionar', escolha a Categoria, o Tipo (Fixa, Variável ou Investimento) e o Valor Planejado. O orçamento é vinculado ao mês selecionado.",
      },
      {
        heading: "Acompanhamento Gasto vs Planejado",
        text: "Cada item de orçamento mostra uma barra de progresso comparando o gasto real (dos seus lançamentos) com o valor planejado. As cores indicam: verde (≤ 75%), amarelo (75-100%) e vermelho (> 100% — orçamento estourado).",
      },
      {
        heading: "Copiar do Mês Anterior",
        text: "Se não há orçamentos no mês atual, o botão 'Copiar mês anterior' replica automaticamente a estrutura do mês passado, economizando tempo na configuração.",
      },
      {
        heading: "Sugestões Inteligentes",
        text: "O sistema analisa sua distribuição e gera dicas personalizadas. Exemplos: 'Despesas fixas em 62% (ideal ≤ 50%). Renegocie contratos.' ou 'Parabéns! Seu orçamento está equilibrado segundo a regra 50/30/20.'",
      },
    ],
  },
  {
    id: "documentos",
    icon: Upload,
    title: "Documentos",
    subtitle: "Envie e gerencie seus arquivos",
    color: "text-finance-warning",
    content: [
      {
        heading: "Enviar um Documento",
        text: "Clique em 'Enviar Documento', dê um nome descritivo (ex: 'Extrato Bancário Abr/2026') e selecione o arquivo. Formatos aceitos: PDF, imagens, planilhas e outros documentos.",
      },
      {
        heading: "Status do Documento",
        text: "Cada documento tem um status: Pendente (aguardando análise do consultor), Aprovado (documento validado) ou Rejeitado (necessita reenvio). O consultor atualiza o status durante a análise.",
      },
      {
        heading: "Download e Exclusão",
        text: "Use o ícone de download para baixar o documento enviado e o ícone de lixeira para removê-lo permanentemente.",
      },
    ],
  },
  {
    id: "configuracoes",
    icon: Settings,
    title: "Configurações",
    subtitle: "Perfil e segurança",
    color: "text-muted-foreground",
    content: [
      {
        heading: "Dados Pessoais",
        text: "Atualize seu Nome Completo, Telefone, CPF e nome da Empresa. Estas informações são usadas nos relatórios e na comunicação com o consultor.",
      },
      {
        heading: "Alterar Senha",
        text: "Informe uma nova senha com no mínimo 6 caracteres. Não é necessário informar a senha atual. A alteração é imediata.",
      },
    ],
  },
];

const tips = [
  {
    icon: CheckCircle2,
    title: "Registre lançamentos regularmente",
    text: "Quanto mais atualizado o sistema, mais precisos serão os indicadores e relatórios.",
  },
  {
    icon: Camera,
    title: "Salve snapshots mensais",
    text: "No dashboard, clique em 'Salvar Snapshot do Mês' para registrar a evolução patrimonial e do Health Score.",
  },
  {
    icon: Target,
    title: "Configure o orçamento",
    text: "Defina metas para cada categoria e acompanhe o progresso ao longo do mês. Use a regra 50/30/20 como referência.",
  },
  {
    icon: FileDown,
    title: "Exporte o PDF antes das reuniões",
    text: "O relatório consolidado é ideal para levar às sessões com o consultor.",
  },
  {
    icon: AlertTriangle,
    title: "Atenção aos indicadores vermelhos",
    text: "Indicadores em vermelho indicam áreas que precisam de ação imediata. Discuta-os com seu consultor.",
  },
];

const GuiaDeUso = () => {
  return (
    <ClientLayout role="client">
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-xs font-body font-medium text-accent uppercase tracking-wider">Guia da Plataforma</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Manual de Uso
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-xl mx-auto">
            Conheça todas as ferramentas disponíveis na sua área financeira. 
            Cada módulo foi pensado para oferecer uma visão completa da sua saúde financeira.
          </p>
        </div>

        {/* Quick Navigation */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-4">
            <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-wider mb-3">Navegação Rápida</p>
            <div className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-sm font-body hover:border-accent/40 transition-colors"
                >
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                  {s.title}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        {sections.map((section) => (
          <Card key={section.id} id={section.id} className="border-border shadow-sm scroll-mt-6">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl bg-secondary ${section.color}`}>
                  <section.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-display">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground font-body">{section.subtitle}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {section.content.map((item, idx) => (
                  <AccordionItem key={idx} value={`${section.id}-${idx}`} className="border-border/50">
                    <AccordionTrigger className="text-sm font-body font-medium hover:text-accent py-3">
                      <span className="flex items-center gap-2">
                        <ChevronRight className="h-3.5 w-3.5 text-accent shrink-0" />
                        {item.heading}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm font-body text-muted-foreground leading-relaxed pl-6 whitespace-pre-line">
                      {item.text}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}

        {/* Tips Section */}
        <Card className="border-accent/20 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <CardTitle className="text-lg font-display">Dicas para Melhor Aproveitamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-secondary/50">
                  <tip.icon className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-body font-semibold text-foreground">{tip.title}</p>
                    <p className="text-xs font-body text-muted-foreground mt-0.5">{tip.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 text-center space-y-2">
            <HelpCircle className="h-8 w-8 text-accent mx-auto" />
            <p className="text-sm font-body font-semibold text-foreground">Precisa de ajuda?</p>
            <p className="text-xs font-body text-muted-foreground max-w-md mx-auto">
              Entre em contato com seu consultor Melazzo para dúvidas sobre a plataforma ou sobre sua estratégia financeira. 
              Estamos aqui para ajudar você a alcançar seus objetivos.
            </p>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default GuiaDeUso;
