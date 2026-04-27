import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AgroLayout } from "@/components/layout/AgroLayout";
import { CobrancaLayout } from "@/components/layout/CobrancaLayout";
import Showroom from "@/demo-hub/pages/Showroom";
import NotFound from "@/pages/NotFound";

const PanoramaGeral = lazy(() => import("@/demo-hub/pages/empresarial/PanoramaGeral"));
const FaturamentoGerencial = lazy(() => import("@/demo-hub/pages/empresarial/FaturamentoGerencial"));
const FluxoCaixa = lazy(() => import("@/demo-hub/pages/empresarial/FluxoCaixa"));
const Custos = lazy(() => import("@/demo-hub/pages/empresarial/Custos"));
const Endividamento = lazy(() => import("@/demo-hub/pages/empresarial/Endividamento"));
const Pipeline = lazy(() => import("@/demo-hub/pages/empresarial/Pipeline"));
const Estoque = lazy(() => import("@/demo-hub/pages/empresarial/Estoque"));
const Calendario = lazy(() => import("@/demo-hub/pages/empresarial/Calendario"));
const Patrimonio = lazy(() => import("@/demo-hub/pages/empresarial/Patrimonio"));
const Score = lazy(() => import("@/demo-hub/pages/empresarial/Score"));
const Inteligencia = lazy(() => import("@/demo-hub/pages/empresarial/Inteligencia"));
const SimuladorCenarios = lazy(() => import("@/demo-hub/pages/empresarial/SimuladorCenarios"));
const PlanoBTS = lazy(() => import("@/demo-hub/pages/empresarial/PlanoBTS"));
const OKRs = lazy(() => import("@/demo-hub/pages/empresarial/OKRs"));
const Timeline = lazy(() => import("@/demo-hub/pages/empresarial/Timeline"));
const Checkup = lazy(() => import("@/demo-hub/pages/empresarial/Checkup"));
const Inconsistencias = lazy(() => import("@/demo-hub/pages/empresarial/Inconsistencias"));
const RastreioContratos = lazy(() => import("@/demo-hub/pages/empresarial/RastreioContratos"));

const VisaoExecutiva = lazy(() => import("@/demo-hub/pages/agro/VisaoExecutiva"));
const LastroPatrimonial = lazy(() => import("@/demo-hub/pages/agro/LastroPatrimonial"));
const EndividamentoAgro = lazy(() => import("@/demo-hub/pages/agro/Endividamento"));
const CapacidadePagamento = lazy(() => import("@/demo-hub/pages/agro/CapacidadePagamento"));
const CusteioSafra = lazy(() => import("@/demo-hub/pages/agro/CusteioSafra"));
const Pecuaria = lazy(() => import("@/demo-hub/pages/agro/Pecuaria"));
const MercadoCotacoes = lazy(() => import("@/demo-hub/pages/agro/MercadoCotacoes"));
const RiscoCredito = lazy(() => import("@/demo-hub/pages/agro/RiscoCredito"));
const FluxoProjetado = lazy(() => import("@/demo-hub/pages/agro/FluxoProjetado"));
const Dossie = lazy(() => import("@/demo-hub/pages/agro/Dossie"));
const SimuladorEngorda = lazy(() => import("@/demo-hub/pages/agro/SimuladorEngorda"));
const EstruturaSocietaria = lazy(() => import("@/demo-hub/pages/agro/EstruturaSocietaria"));
const Fazendas = lazy(() => import("@/demo-hub/pages/agro/Fazendas"));
const CentralFinanceira = lazy(() => import("@/demo-hub/pages/agro/CentralFinanceira"));

const VisaoGeralCobranca = lazy(() => import("@/demo-hub/pages/cobranca/VisaoGeral"));
const CarteiraAging = lazy(() => import("@/demo-hub/pages/cobranca/CarteiraAging"));
const TopDevedores = lazy(() => import("@/demo-hub/pages/cobranca/TopDevedores"));
const KanbanAcordos = lazy(() => import("@/demo-hub/pages/cobranca/KanbanAcordos"));
const ReguaCobranca = lazy(() => import("@/demo-hub/pages/cobranca/ReguaCobranca"));
const SimuladorAcordo = lazy(() => import("@/demo-hub/pages/cobranca/SimuladorAcordo"));
const Acordos = lazy(() => import("@/demo-hub/pages/cobranca/Acordos"));
const Performance = lazy(() => import("@/demo-hub/pages/cobranca/Performance"));
const Juridico = lazy(() => import("@/demo-hub/pages/cobranca/Juridico"));
const DossieCobranca = lazy(() => import("@/demo-hub/pages/cobranca/Dossie"));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Carregando módulo</p>
    </div>
  </div>
);

export default function DemoHubRoutes() {
  return (
    <Routes>
      <Route index element={<Showroom />} />
      <Route path="empresarial/*" element={<DashboardLayout><Suspense fallback={<PageFallback />}><Routes>
        <Route index element={<Navigate to="panorama" replace />} />
        <Route path="panorama" element={<PanoramaGeral />} />
        <Route path="faturamento" element={<FaturamentoGerencial />} />
        <Route path="fluxo-caixa" element={<FluxoCaixa />} />
        <Route path="custos" element={<Custos />} />
        <Route path="endividamento" element={<Endividamento />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="estoque" element={<Estoque />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="patrimonio" element={<Patrimonio />} />
        <Route path="score" element={<Score />} />
        <Route path="inteligencia" element={<Inteligencia />} />
        <Route path="simulador-cenarios" element={<SimuladorCenarios />} />
        <Route path="plano-bts" element={<PlanoBTS />} />
        <Route path="okrs" element={<OKRs />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="checkup" element={<Checkup />} />
        <Route path="inconsistencias" element={<Inconsistencias />} />
        <Route path="rastreio-contratos" element={<RastreioContratos />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></DashboardLayout>} />
      <Route path="agro/*" element={<AgroLayout><Suspense fallback={<PageFallback />}><Routes>
        <Route index element={<Navigate to="visao-executiva" replace />} />
        <Route path="visao-executiva" element={<VisaoExecutiva />} />
        <Route path="lastro-patrimonial" element={<LastroPatrimonial />} />
        <Route path="endividamento" element={<EndividamentoAgro />} />
        <Route path="capacidade-pagamento" element={<CapacidadePagamento />} />
        <Route path="custeio-safra" element={<CusteioSafra />} />
        <Route path="pecuaria" element={<Pecuaria />} />
        <Route path="mercado-cotacoes" element={<MercadoCotacoes />} />
        <Route path="risco-credito" element={<RiscoCredito />} />
        <Route path="fluxo-projetado" element={<FluxoProjetado />} />
        <Route path="dossie" element={<Dossie />} />
        <Route path="simulador-engorda" element={<SimuladorEngorda />} />
        <Route path="estrutura-societaria" element={<EstruturaSocietaria />} />
        <Route path="fazendas" element={<Fazendas />} />
        <Route path="central-financeira" element={<CentralFinanceira />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></AgroLayout>} />
      <Route path="cobranca/*" element={<CobrancaLayout><Suspense fallback={<PageFallback />}><Routes>
        <Route index element={<Navigate to="visao-geral" replace />} />
        <Route path="visao-geral" element={<VisaoGeralCobranca />} />
        <Route path="carteira-aging" element={<CarteiraAging />} />
        <Route path="top-devedores" element={<TopDevedores />} />
        <Route path="kanban-acordos" element={<KanbanAcordos />} />
        <Route path="regua-cobranca" element={<ReguaCobranca />} />
        <Route path="simulador-acordo" element={<SimuladorAcordo />} />
        <Route path="acordos" element={<Acordos />} />
        <Route path="performance" element={<Performance />} />
        <Route path="juridico" element={<Juridico />} />
        <Route path="dossie" element={<DossieCobranca />} />
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></CobrancaLayout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
