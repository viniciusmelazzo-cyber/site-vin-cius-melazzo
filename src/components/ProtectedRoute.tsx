import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, profile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-body text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const loginPath = location.pathname.startsWith("/restrito")
      ? "/restrito/login?next=demos"
      : "/cliente/login";
    return <Navigate to={loginPath} replace />;
  }
  if (requireAdmin && !isAdmin) return <Navigate to="/cliente/dashboard" replace />;

  // Redirect to onboarding if not completed (unless already on onboarding page)
  if (
    !isAdmin &&
    profile &&
    !profile.onboarding_completed &&
    location.pathname !== "/cliente/onboarding"
  ) {
    return <Navigate to="/cliente/onboarding" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
