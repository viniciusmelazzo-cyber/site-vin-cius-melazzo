import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, KeyRound } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("type") === "recovery") {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Erro", description: "As senhas não coincidem.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Erro", description: "A senha deve ter pelo menos 6 caracteres.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Senha atualizada!", description: "Você será redirecionado para o login." });
      await supabase.auth.signOut();
      navigate("/cliente/login", { replace: true });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linen-texture p-6">
        <Card className="w-full max-w-md border-border shadow-lg">
          <CardContent className="pt-8 text-center space-y-4">
            <KeyRound className="h-12 w-12 text-muted-foreground mx-auto" />
            <h2 className="text-xl font-display font-semibold">Link inválido ou expirado</h2>
            <p className="text-muted-foreground font-body text-sm">
              Este link de recuperação não é válido. Solicite um novo na tela de login.
            </p>
            <Link to="/cliente/login">
              <Button variant="outline" className="mt-4 font-body">
                <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linen-texture p-6">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logoVM} alt="" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-display font-bold text-primary">Melazzo</h1>
          </div>
          <h2 className="text-2xl font-display font-semibold text-foreground">Nova Senha</h2>
          <p className="text-muted-foreground font-body text-sm">
            Defina sua nova senha abaixo
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="font-body text-sm font-medium">Nova Senha</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-body text-sm font-medium">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Salvando..." : "Salvar Nova Senha"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
