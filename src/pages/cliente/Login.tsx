import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Shield, TrendingUp, FileText, ArrowLeft } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite");

  // If invite token present, show registration form
  const [mode, setMode] = useState<"login" | "register">(inviteToken ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Check role to redirect appropriately
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
        const isAdmin = roles?.some((r: any) => r.role === "admin");
        navigate(isAdmin ? "/cliente/admin" : "/cliente/dashboard");
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
      const res = await supabase.functions.invoke("admin-users", {
        body: {
          action: "register_with_invite",
          invite_token: inviteToken,
          password,
          full_name: fullName,
        },
      });

      if (res.error || res.data?.error) {
        throw new Error(res.data?.error || res.error?.message || "Erro ao registrar");
      }

      toast({ title: "Conta criada com sucesso!", description: "Faça login para continuar." });
      setMode("login");
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
              </form>
            ) : (
              <form onSubmit={handleRegisterWithInvite} className="space-y-4">
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
                  <Label htmlFor="password" className="font-body text-sm font-medium">Crie uma Senha</Label>
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
                  {loading ? "Criando conta..." : "Criar Conta e Acessar"}
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
