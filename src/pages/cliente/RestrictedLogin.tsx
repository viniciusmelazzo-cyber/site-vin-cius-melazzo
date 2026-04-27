import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Briefcase, GalleryHorizontalEnd, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/brand/Logo";

const destinations = {
  demos: "/restrito/demonstracoes",
  crm: "/cliente/admin/crm",
  admin: "/cliente/admin",
};

const RestrictedLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nextKey = searchParams.get("next") === "crm" ? "crm" : searchParams.get("next") === "admin" ? "admin" : "demos";
  const next = destinations[nextKey];

  useEffect(() => {
    if (authLoading || !user) return;
    if (isAdmin) {
      navigate(next, { replace: true });
      return;
    }

    toast({
      title: "Acesso restrito",
      description: "Esta área é exclusiva para usuários com perfil ADMIN.",
      variant: "destructive",
    });
    navigate("/cliente/dashboard", { replace: true });
  }, [authLoading, user, isAdmin, navigate, next]);

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

      navigate(next, { replace: true });
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
            <p className="text-muted-foreground font-body text-sm">Entre com o perfil ADMIN para acessar {nextKey === "crm" ? "o CRM interno" : "a Central de Demonstrações"}.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-body text-sm font-medium">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@melazzo.co" required className="font-body" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-body text-sm font-medium">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="font-body" />
              </div>
              <Button type="submit" className="w-full font-body bg-gradient-gold text-primary hover:opacity-90" disabled={loading}>{loading ? "Validando..." : "Entrar na Área Restrita"}</Button>
            </form>
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" className="flex-1 font-body" onClick={() => navigate("/restrito/login?next=demos")}>Demonstrações</Button>
              <Button type="button" variant="outline" className="flex-1 font-body" onClick={() => navigate("/restrito/login?next=crm")}>CRM Interno</Button>
            </div>
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
