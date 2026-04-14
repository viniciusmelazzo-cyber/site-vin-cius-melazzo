import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index.tsx";
import ManualCreditoRural from "./pages/ManualCreditoRural.tsx";
import Privacidade from "./pages/Privacidade.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/cliente/Login.tsx";
import ForgotPassword from "./pages/cliente/ForgotPassword.tsx";
import ResetPassword from "./pages/cliente/ResetPassword.tsx";
import Onboarding from "./pages/cliente/Onboarding.tsx";
import ClientDashboard from "./pages/cliente/ClientDashboard.tsx";
import Lancamentos from "./pages/cliente/Lancamentos.tsx";
import Documentos from "./pages/cliente/Documentos.tsx";
import Configuracoes from "./pages/cliente/Configuracoes.tsx";
import AdminDashboard from "./pages/cliente/AdminDashboard.tsx";
import AdminClientDetail from "./pages/cliente/AdminClientDetail.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/manual-credito-rural-2026" element={<ManualCreditoRural />} />
            <Route path="/privacidade" element={<Privacidade />} />
            <Route path="/cliente/login" element={<Login />} />
            <Route path="/cliente/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/cliente/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/cliente/lancamentos" element={<ProtectedRoute><Lancamentos /></ProtectedRoute>} />
            <Route path="/cliente/documentos" element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
            <Route path="/cliente/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
            <Route path="/cliente/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            <Route path="/cliente/admin/cliente/:clientId" element={<ProtectedRoute requireAdmin><AdminClientDetail /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
