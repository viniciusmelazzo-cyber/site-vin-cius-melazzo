import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";

const Termos = () => {
  useEffect(() => {
    document.title = "Termos de Uso | Melazzo Consultoria";
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
          Termos de Uso
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-12">
          Última atualização: abril de 2026
        </p>

        <div className="space-y-10 font-body text-sm text-foreground/80 leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              1. Identificação do prestador
            </h2>
            <p>
              <strong>Melazzo Consultoria</strong> — Estratégia & Performance Empresarial.<br />
              CNPJ: <strong>57.460.598/0001-19</strong>.<br />
              Endereço: Av. Bélgica, 375 — Uberlândia/MG.<br />
              Contato: contato@melazzo.co · (34) 9 9228-2778.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              2. Aceitação dos termos
            </h2>
            <p>
              Ao acessar este site ou contratar qualquer produto digital ou serviço da Melazzo
              Consultoria, você declara ter lido, compreendido e aceitado integralmente estes
              Termos de Uso, bem como a nossa{" "}
              <Link to="/privacidade" className="text-accent hover:underline">
                Política de Privacidade
              </Link>{" "}
              e a nossa{" "}
              <Link to="/politica-reembolso" className="text-accent hover:underline">
                Política de Reembolso
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              3. Objeto
            </h2>
            <p>
              A Melazzo Consultoria oferece (i) conteúdos informativos, (ii) consultoria
              estratégica e financeira para empresas, produtores rurais e pessoas físicas e
              (iii) acesso a uma plataforma digital própria de gestão financeira pessoal
              ("Sistema Melazzo"), comercializado mediante assinatura ou pagamento único anual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              4. Cadastro e área restrita
            </h2>
            <p>
              O acesso à Área do Cliente exige cadastro prévio mediante convite ou compra. O
              usuário é o único responsável pela guarda das suas credenciais e por todas as
              ações realizadas a partir da sua conta. É vedado compartilhar login com terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              5. Planos, preços e pagamento
            </h2>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Plano Mensal:</strong> R$ 39,90/mês, com renovação automática.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Plano Anual:</strong> R$ 450,00 à vista, garantindo 12 meses de acesso ao Sistema Melazzo.</span>
              </li>
            </ul>
            <p className="mt-3">
              Os pagamentos são processados via gateway autorizado (Stripe), com aceite de
              cartão de crédito e Pix. Os preços podem ser reajustados mediante aviso prévio
              de 30 dias.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              6. Direito de arrependimento e reembolso
            </h2>
            <p>
              Conforme o art. 49 do Código de Defesa do Consumidor, o usuário pode solicitar o
              cancelamento da contratação em até <strong>7 (sete) dias corridos</strong> após
              o pagamento, com reembolso integral. Detalhes em nossa{" "}
              <Link to="/politica-reembolso" className="text-accent hover:underline">
                Política de Reembolso
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              7. Uso aceitável
            </h2>
            <p>
              É proibido (i) reproduzir, redistribuir ou revender qualquer conteúdo da
              plataforma; (ii) realizar engenharia reversa do sistema; (iii) usar a plataforma
              para fins ilícitos ou contrários à boa-fé. O descumprimento autoriza o
              encerramento imediato do acesso, sem reembolso.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              8. Propriedade intelectual
            </h2>
            <p>
              Todos os textos, marcas, layouts, software, materiais e metodologias deste site
              e do Sistema Melazzo são de titularidade exclusiva da Melazzo Consultoria,
              protegidos pela legislação brasileira de propriedade intelectual.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              9. Limitação de responsabilidade
            </h2>
            <p>
              O conteúdo deste site e da plataforma tem caráter informativo e consultivo. As
              decisões financeiras tomadas pelo usuário são de sua exclusiva responsabilidade.
              A Melazzo Consultoria não garante resultados financeiros específicos e não se
              responsabiliza por perdas decorrentes de decisões do usuário.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              10. Alterações dos termos
            </h2>
            <p>
              Estes termos podem ser atualizados a qualquer momento. A versão vigente será
              sempre a publicada nesta página, com a respectiva data de atualização.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              11. Foro
            </h2>
            <p>
              Fica eleito o foro da comarca de <strong>Uberlândia/MG</strong> para dirimir
              qualquer controvérsia oriunda destes Termos, com renúncia a qualquer outro, por
              mais privilegiado que seja.
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

export default Termos;
