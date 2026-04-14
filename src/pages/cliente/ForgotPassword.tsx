import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";
import logoVM from "@/assets/logo-vm.webp";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/cliente/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast({ title: "E-mail enviado!", description: "Verifique sua caixa de entrada." });
    } catch (error: any) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linen-texture p-6">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center space-y-2 pb-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logoVM} alt="" className="w-8 h-8 object-contain" />
            <h1 className="text-xl font-display font-bold text-primary">Melazzo</h1>
          </div>
          <h2 className="text-2xl font-display font-semibold text-foreground">
            Recuperar Senha
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            {sent
              ? "Enviamos um link de recuperação para o seu e-mail"
              : "Informe seu e-mail para receber o link de recuperação"}
          </p>
        </CardHeader>
        <CardContent className="pt-4">
          {sent ? (
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 text-accent mx-auto" />
              <p className="text-sm font-body text-muted-foreground">
                Verifique sua caixa de entrada e spam. O link expira em 1 hora.
              </p>
              <Link to="/cliente/login">
                <Button variant="outline" className="font-body">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Voltar ao login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button
                type="submit"
                className="w-full font-body bg-gradient-gold text-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar Link de Recuperação"}
              </Button>
              <div className="text-center">
                <Link to="/cliente/login" className="text-xs text-muted-foreground font-body hover:underline">
                  <ArrowLeft className="h-3 w-3 inline mr-1" />
                  Voltar ao login
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
