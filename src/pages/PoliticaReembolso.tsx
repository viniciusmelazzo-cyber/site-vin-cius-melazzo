import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";

const PoliticaReembolso = () => {
  useEffect(() => {
    document.title = "Política de Reembolso | Melazzo Consultoria";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary border-b border-primary-foreground/10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo variant="light" size={36} />
            <span className="font-display text-sm text-primary-foreground font-semibold tracking-wide hidden sm:block">
              Melazzo Consultoria
            </span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 font-body text-xs text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Política de Reembolso
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-12">
          Última atualização: abril de 2026
        </p>

        <div className="space-y-10 font-body text-sm text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              1. Garantia de 7 dias
            </h2>
            <p>
              Conforme o <strong>art. 49 do Código de Defesa do Consumidor</strong>, você pode
              solicitar o cancelamento da assinatura ou do plano anual do Sistema Melazzo em até{" "}
              <strong>7 (sete) dias corridos</strong> após a confirmação do pagamento, com
              direito ao reembolso integral.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              2. Como solicitar
            </h2>
            <p className="mb-3">
              Envie um e-mail para{" "}
              <a href="mailto:contato@melazzo.co" className="text-accent hover:underline font-medium">
                contato@melazzo.co
              </a>{" "}
              com:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Assunto: <strong>"Solicitação de Reembolso — Sistema Melazzo"</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Nome completo, CPF e e-mail usados na compra
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Comprovante ou ID da transação
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              3. Prazo de processamento
            </h2>
            <p>
              Confirmado o pedido, o reembolso é processado em até <strong>5 dias úteis</strong>{" "}
              pela operadora do meio de pagamento utilizado:
            </p>
            <ul className="space-y-1.5 ml-4 mt-3">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Cartão de crédito:</strong> estorno na fatura em até 1 ou 2 ciclos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Pix:</strong> devolução na conta de origem em até 5 dias úteis.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              4. Cancelamento da assinatura mensal
            </h2>
            <p>
              A assinatura mensal pode ser cancelada a qualquer momento na área do cliente. O
              acesso permanece ativo até o fim do ciclo já pago — não há cobrança proporcional
              para meses não usados após o prazo de 7 dias.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              5. Reembolso após 7 dias
            </h2>
            <p>
              Após o prazo legal de 7 dias, não há mais direito a reembolso integral. Para o
              plano anual, casos excepcionais (problema técnico não solucionado pela equipe)
              podem ser avaliados individualmente, com possibilidade de reembolso proporcional
              dos meses não usados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              6. Contato
            </h2>
            <p>
              Em caso de dúvidas sobre esta política, entre em contato pelo e-mail{" "}
              <a href="mailto:contato@melazzo.co" className="text-accent hover:underline font-medium">
                contato@melazzo.co
              </a>{" "}
              ou pelo WhatsApp (34) 9 9228-2778.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-primary py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs text-primary-foreground/30">
            © 2026 Melazzo Consultoria — CNPJ 57.460.598/0001-19
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PoliticaReembolso;
