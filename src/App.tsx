import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DrillDownProvider } from "@/hooks/use-drill-down";
import { DrillDownSheet } from "@/components/drill/DrillDownSheet";
import Index from "./pages/Index.tsx";
import Empresarial from "./pages/Empresarial.tsx";
import Rural from "./pages/Rural.tsx";
import PessoaFisica from "./pages/PessoaFisica.tsx";
import ManualCreditoRural from "./pages/ManualCreditoRural.tsx";
import Privacidade from "./pages/Privacidade.tsx";
import Termos from "./pages/Termos.tsx";
import PoliticaReembolso from "./pages/PoliticaReembolso.tsx";
import Planilha from "./pages/Planilha.tsx";
import Obrigado from "./pages/Obrigado.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/cliente/Login.tsx";
import RestrictedLogin from "./pages/cliente/RestrictedLogin.tsx";
import ForgotPassword from "./pages/cliente/ForgotPassword.tsx";
import ResetPassword from "./pages/cliente/ResetPassword.tsx";
import Onboarding from "./pages/cliente/Onboarding.tsx";
import ClientDashboard from "./pages/cliente/ClientDashboard.tsx";
import Lancamentos from "./pages/cliente/Lancamentos.tsx";
import Documentos from "./pages/cliente/Documentos.tsx";
import Configuracoes from "./pages/cliente/Configuracoes.tsx";
import Patrimonio from "./pages/cliente/Patrimonio.tsx";
import Orcamento from "./pages/cliente/Orcamento.tsx";
import AdminDashboard from "./pages/cliente/AdminDashboard.tsx";
import AdminClientDetail from "./pages/cliente/AdminClientDetail.tsx";
import AdminCRM from "./pages/cliente/AdminCRM.tsx";
import AdminPJ from "./pages/cliente/AdminPJ.tsx";
import AdminPF from "./pages/cliente/AdminPF.tsx";
import AdminConvites from "./pages/cliente/AdminConvites.tsx";
import AdminLeads from "./pages/cliente/AdminLeads.tsx";
import GuiaDeUso from "./pages/cliente/GuiaDeUso.tsx";
import DemoHubRoutes from "./demo-hub/DemoHubRoutes.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <DrillDownProvider>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/empresarial" element={<Empresarial />} />
            <Route path="/rural" element={<Rural />} />
            <Route path="/pessoa-fisica" element={<PessoaFisica />} />
            <Route path="/manual-credito-rural-2026" element={<ManualCreditoRural />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/termos-de-uso" element={<Termos />} />
            <Route path="/politica-reembolso" element={<PoliticaReembolso />} />
            <Route path="/planilha" element={<Planilha />} />
            <Route path="/obrigado" element={<Obrigado />} />
            <Route path="/cliente/login" element={<Login />} />
            <Route path="/restrito/login" element={<RestrictedLogin />} />
            <Route path="/cliente/forgot-password" element={<ForgotPassword />} />
            <Route path="/cliente/reset-password" element={<ResetPassword />} />
            <Route path="/cliente/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/cliente/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/cliente/lancamentos" element={<ProtectedRoute><Lancamentos /></ProtectedRoute>} />
            <Route path="/cliente/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
            <Route path="/cliente/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route path="/cliente/patrimonio" element={<ProtectedRoute><Patrimonio /></ProtectedRoute>} />
            <Route path="/cliente/orcamento" element={<ProtectedRoute><Orcamento /></ProtectedRoute>} />
            <Route path="/cliente/guia" element={<ProtectedRoute><GuiaDeUso /></ProtectedRoute>} />
            <Route path="/cliente/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/cliente/admin/pf" element={<ProtectedRoute requireAdmin><AdminPF /></ProtectedRoute>} />
            <Route path="/cliente/admin/pj" element={<ProtectedRoute requireAdmin><AdminPJ /></ProtectedRoute>} />
            <Route path="/cliente/admin/crm" element={<ProtectedRoute requireAdmin><AdminCRM /></ProtectedRoute>} />
            <Route path="/cliente/admin/convites" element={<ProtectedRoute requireAdmin><AdminConvites /></ProtectedRoute>} />
            <Route path="/cliente/admin/leads" element={<ProtectedRoute requireAdmin><AdminLeads /></ProtectedRoute>} />
            <Route path="/cliente/admin/config" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/cliente/admin/cliente/:clientId" element={<ProtectedRoute requireAdmin><AdminClientDetail /></ProtectedRoute>} />
            <Route path="/restrito/demonstracoes/*" element={<ProtectedRoute requireAdmin><DemoHubRoutes /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            <DrillDownSheet />
          </DrillDownProvider>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
