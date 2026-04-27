import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Briefcase, Check, GalleryHorizontalEnd, LayoutDashboard, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/brand/Logo";

type DestinationKey = "demos" | "crm" | "admin";

const destinationOptions: Record<DestinationKey, { label: string; description: string; path: string; icon: typeof GalleryHorizontalEnd }> = {
  demos: {
    label: "Central de Demonstrações",
    description: "Showroom dos produtos Melazzo",
    path: "/restrito/demonstracoes",
    icon: GalleryHorizontalEnd,
  },
  crm: {
    label: "CRM Interno",
    description: "Operações, clientes e pipeline",
    path: "/cliente/admin/crm",
    icon: Briefcase,
  },
  admin: {
    label: "Painel Administrativo",
    description: "Visão geral da operação interna",
    path: "/cliente/admin",
    icon: LayoutDashboard,
  },
};

const getDestinationKey = (value: string | null): DestinationKey => {
  if (value === "crm" || value === "admin") return value;
  return "demos";
};

const RestrictedLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<DestinationKey>(() => getDestinationKey(searchParams.get("next")));
  const destination = destinationOptions[selectedDestination];

  useEffect(() => {
    setSelectedDestination(getDestinationKey(searchParams.get("next")));
  }, [searchParams]);

  useEffect(() => {
    if (authLoading || !user) return;
    if (isAdmin) {
      navigate(destination.path, { replace: true });
      return;
    }

    toast({
      title: "Acesso restrito",
      description: "Esta área é exclusiva para usuários com perfil ADMIN.",
      variant: "destructive",
    });
    navigate("/cliente/dashboard", { replace: true });
  }, [authLoading, user, isAdmin, navigate, destination.path]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const { data: authData } = await supabase.auth.getUser();
      const uid = authData.user?.id;
      if (!uid) throw new Error("Não foi possível validar o usuário.");

      const { data: roles, error: rolesError } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      if (rolesError) throw rolesError;

      const admin = roles?.some((role: any) => role.role === "admin");
      if (!admin) {
        await supabase.auth.signOut();
        toast({ title: "Acesso restrito", description: "Este acesso é exclusivo para perfil ADMIN.", variant: "destructive" });
        return;
      }

      navigate(destination.path, { replace: true });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Não foi possível acessar a área restrita.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-linen-texture">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-navy flex-col justify-between p-12">
        <div>
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <ArrowLeft className="h-4 w-4 text-gold opacity-60 group-hover:opacity-100 transition-opacity" />
            <span className="text-gold/60 font-body text-xs tracking-wider uppercase group-hover:text-gold transition-colors">Voltar ao site</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Logo variant="light" size={44} />
            <h1 className="font-display text-3xl font-bold text-primary-foreground">Melazzo Consultoria</h1>
          </div>
          <p className="text-primary-foreground/50 mt-1 font-body text-sm tracking-wider uppercase">Área Restrita</p>
        </div>

        <div className="space-y-8">
          {[
            { icon: Shield, title: "Acesso ADMIN", desc: "Entrada exclusiva para gestão interna e ambientes demonstrativos." },
            { icon: GalleryHorizontalEnd, title: "Central de Demonstrações", desc: "Produtos Melazzo em versão showroom, com dados fictícios." },
            { icon: Briefcase, title: "CRM Interno", desc: "Operação comercial, clientes, leads e gestão consultiva." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-accent/20"><item.icon className="h-6 w-6 text-gold" /></div>
              <div>
                <h3 className="text-primary-foreground font-display text-lg font-semibold">{item.title}</h3>
                <p className="text-primary-foreground/60 font-body text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-primary-foreground/30 font-body text-xs">© 2026 Melazzo Consultoria. Todos os direitos reservados.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardHeader className="text-center space-y-2 pb-2">
            <div className="lg:hidden mb-4 flex items-center justify-center gap-3">
              <Logo variant="navy" size={36} />
              <div>
                <h1 className="text-xl font-display font-bold text-primary">Melazzo</h1>
                <p className="text-muted-foreground text-[10px] tracking-wider uppercase font-body">Área Restrita</p>
              </div>
            </div>
            <h2 className="text-2xl font-display font-semibold text-foreground">Acesso administrativo</h2>
            <p className="text-muted-foreground font-body text-sm">Escolha a plataforma restrita e entre com perfil ADMIN.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-5 grid gap-2" aria-label="Escolha da plataforma restrita">
              {(Object.entries(destinationOptions) as [DestinationKey, typeof destination][]).map(([key, option]) => {
                const Icon = option.icon;
                const active = selectedDestination === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedDestination(key)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${active ? "border-gold bg-gold/10" : "border-border bg-card hover:border-gold/50"}`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${active ? "bg-gold text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-sm font-semibold text-foreground">{option.label}</span>
                      <span className="block font-body text-xs text-muted-foreground">{option.description}</span>
                    </span>
                    {active && <Check className="h-4 w-4 text-gold" />}
                  </button>
                );
              })}
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@melazzo.co" required className="font-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-sm font-medium">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="font-body" />
              </div>
              <Button type="submit" className="w-full font-body bg-gradient-gold text-primary hover:opacity-90" disabled={loading || authLoading}>{loading || authLoading ? "Validando..." : `Entrar em ${destination.label}`}</Button>
            </form>
            <div className="mt-5 text-center">
              <Link to="/cliente/login" className="text-xs text-muted-foreground font-body hover:underline">Ir para Área do Cliente</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestrictedLogin;
