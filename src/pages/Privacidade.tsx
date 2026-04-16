import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/brand/Logo";

const Privacidade = () => {
  useEffect(() => {
    document.title = "Política de Privacidade | Melazzo Consultoria";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
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

      {/* Content */}
      <main className="container mx-auto px-6 lg:px-12 py-16 lg:py-24 max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
          Política de Privacidade
        </h1>
        <p className="font-body text-sm text-muted-foreground mb-12">
          Última atualização: março de 2026
        </p>

        <div className="space-y-10 font-body text-sm text-foreground/80 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              1. Quem somos
            </h2>
            <p>
              A <strong>Melazzo Consultoria</strong> (Estratégia & Performance Empresarial),
              com atuação em Uberaba e Uberlândia — MG, é responsável pelo tratamento dos
              dados pessoais coletados neste site.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              2. Quais dados coletamos
            </h2>
            <p className="mb-3">Ao preencher nossos formulários, podemos coletar:</p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Nome completo</strong> — para identificação e personalização do contato.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>E-mail</strong> — para envio do material solicitado e eventuais comunicações.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Telefone</strong> — para contato comercial, se autorizado.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span><strong>Propriedade / Empresa e Segmento</strong> — para entender melhor o seu perfil e personalizar o atendimento.</span>
              </li>
            </ul>
            <p className="mt-3 text-muted-foreground text-xs">
              Também registramos dados técnicos anônimos (hash de IP) para proteção contra abuso.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              3. Finalidade do tratamento
            </h2>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Enviar o material solicitado (Manual de Crédito Rural 2026, checklists, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Entrar em contato para oferecer consultoria e serviços relacionados
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Melhorar nossos conteúdos e serviços com base em dados agregados
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              4. Base legal
            </h2>
            <p>
              O tratamento dos seus dados é baseado no seu <strong>consentimento</strong> (art. 7º, I da LGPD),
              concedido ao marcar a caixa de concordância no formulário. Você pode revogar esse
              consentimento a qualquer momento.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              5. Compartilhamento
            </h2>
            <p>
              Seus dados <strong>não são vendidos, alugados ou compartilhados</strong> com terceiros
              para fins de marketing. Utilizamos apenas serviços técnicos (hospedagem, envio de e-mail)
              necessários para a operação do site, com os quais mantemos contratos de proteção de dados.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              6. Retenção dos dados
            </h2>
            <p>
              Seus dados são mantidos pelo período necessário para cumprir as finalidades descritas acima.
              Em regra, mantemos os dados por até <strong>24 meses</strong> após a última interação.
              Após esse período, os dados são anonimizados ou excluídos.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              7. Seus direitos
            </h2>
            <p className="mb-3">
              Conforme a LGPD, você tem direito a:
            </p>
            <ul className="space-y-1.5 ml-4">
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Confirmar a existência de tratamento dos seus dados
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Acessar, corrigir ou solicitar a exclusão dos seus dados
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Revogar o consentimento a qualquer momento
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0" />
                Solicitar a portabilidade dos dados
              </li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              8. Como exercer seus direitos
            </h2>
            <p>
              Para qualquer solicitação relacionada aos seus dados pessoais, entre em contato pelo e-mail:
            </p>
            <p className="mt-3">
              <a
                href="mailto:vinicius@melazzo.co"
                className="text-accent hover:underline font-medium"
              >
                vinicius@melazzo.co
              </a>
            </p>
            <p className="mt-3 text-muted-foreground text-xs">
              Responderemos em até 15 dias úteis, conforme previsto na legislação.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground mb-3">
              9. Alterações nesta política
            </h2>
            <p>
              Esta política pode ser atualizada periodicamente. A data da última atualização
              está no topo desta página. Recomendamos consultá-la regularmente.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs text-primary-foreground/30">
            © 2026 Melazzo Consultoria — Estratégia & Performance Empresarial
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Privacidade;
