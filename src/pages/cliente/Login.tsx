import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Shield, TrendingUp, FileText, ArrowLeft } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const Login = () => {
  const navigate = useNavigate();
  const { profile, isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [mode, setMode] = useState<"login" | "register">(inviteToken ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectAfterAuth = (roles: any[] | null, onboardingDone?: boolean) => {
    const admin = roles?.some((r: any) => r.role === "admin");
    if (admin) {
      navigate("/cliente/admin", { replace: true });
    } else if (onboardingDone) {
      navigate("/cliente/dashboard", { replace: true });
    } else {
      navigate("/cliente/onboarding", { replace: true });
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        throw result.error;
      }

      if (result.redirected) {
        return;
      }

      // After OAuth callback, check if email is in client_invites or user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("Erro ao obter dados do usuário.");

      const [rolesRes, inviteRes] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase.from("client_invites").select("id").eq("email", user.email).limit(1),
      ]);

      const isAdminUser = rolesRes.data?.some((r: any) => r.role === "admin");

      if (!isAdminUser && (!inviteRes.data || inviteRes.data.length === 0)) {
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Seu e-mail não possui convite ativo. Entre em contato com seu consultor.",
          variant: "destructive",
        });
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      redirectAfterAuth(rolesRes.data, profileData?.onboarding_completed ?? false);
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Erro ao entrar com Google", variant: "destructive" });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const [rolesRes, profileRes] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", user.id),
          supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single(),
        ]);
        redirectAfterAuth(rolesRes.data, profileRes.data?.onboarding_completed ?? false);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterWithInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken) return;
    setLoading(true);
    try {
      // 1. Create account via edge function
      const res = await supabase.functions.invoke("admin-users", {
        body: {
          action: "register_with_invite",
          invite_token: inviteToken,
          password,
          full_name: fullName,
          email,
        },
      });

      if (res.error || res.data?.error) {
        throw new Error(res.data?.error || res.error?.message || "Erro ao registrar");
      }

      // 2. Auto-login with the email from the invite
      const loginEmail = res.data?.email || email;
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (loginError) throw loginError;

      toast({ title: "Conta criada com sucesso!", description: "Vamos iniciar seu cadastro." });
      navigate("/cliente/onboarding", { replace: true });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-navy flex-col justify-between p-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <ArrowLeft className="h-4 w-4 text-gold opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-gold/60 font-body text-xs tracking-wider uppercase group-hover:text-gold transition-colors">
              Voltar ao site
            </span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <img src={logoVM} alt="" className="w-10 h-10 object-contain" />
            <h1 className="font-display text-3xl font-bold text-primary-foreground">
              Melazzo Consultoria
            </h1>
          </div>
          <p className="text-primary-foreground/50 mt-1 font-body text-sm tracking-wider uppercase">
            Área do Cliente
          </p>
        </div>

        <div className="space-y-8">
          {[
            { icon: Shield, title: "Segurança Total", desc: "Seus dados financeiros protegidos com criptografia de ponta." },
            { icon: TrendingUp, title: "Gestão Estratégica", desc: "Transforme dados em decisões inteligentes com a teia de informações." },
            { icon: FileText, title: "Captação de Crédito", desc: "Construa seu lastro patrimonial e comprove capacidade de pagamento." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h3 className="text-primary-foreground font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-primary-foreground/60 font-body text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-primary-foreground/30 font-body text-xs">
          © 2026 Melazzo Consultoria. Todos os direitos reservados.
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-linen-texture">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="lg:hidden mb-4 flex items-center justify-center gap-3">
              <img src={logoVM} alt="" className="w-8 h-8 object-contain" />
              <div>
                <h1 className="text-xl font-display font-bold text-primary">Melazzo</h1>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase font-body">
                  Área do Cliente
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-display font-semibold text-foreground">
              {mode === "login" ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-muted-foreground font-body text-sm">
              {mode === "login"
                ? "Acesse sua plataforma de gestão financeira"
                : "Você recebeu um convite para a plataforma"}
            </p>
          </CardHeader>
          <CardContent className="pt-4">
            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-body text-sm font-medium">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="font-body"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-body bg-gradient-gold text-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Carregando..." : "Entrar"}
                </Button>
                <div className="text-right">
                  <Link to="/cliente/forgot-password" className="text-xs text-muted-foreground font-body hover:underline">
                    Esqueceu sua senha?
                  </Link>
                </div>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-body">ou</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full font-body"
                  disabled={googleLoading}
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {googleLoading ? "Entrando..." : "Entrar com Google"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleRegisterWithInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="font-body text-sm font-medium">Nome Completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                    className="font-body"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword" className="font-body text-sm font-medium">Crie uma Senha</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="font-body"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full font-body bg-gradient-gold text-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "Criar Conta"}
                </Button>
              </form>
            )}

            {!inviteToken && (
              <p className="mt-6 text-center text-xs text-muted-foreground font-body">
                Acesso apenas por convite do consultor.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
