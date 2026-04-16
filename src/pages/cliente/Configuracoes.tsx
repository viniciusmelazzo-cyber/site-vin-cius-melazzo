import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, User, Lock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import WhatsAppConnect from "@/components/cliente/WhatsAppConnect";

const Configuracoes = () => {
  const { user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (data) {
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setCpf(data.cpf || "");
        setCompanyName(data.company_name || "");
      }
    });
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        phone,
        cpf,
        company_name: companyName,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast({ title: "Perfil atualizado com sucesso!" });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "A nova senha deve ter no mínimo 6 caracteres", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast({ title: "Senha alterada com sucesso!" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <ClientLayout role="client">
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">Gerencie seu perfil e segurança</p>
        </div>

        {/* Profile */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <User className="h-5 w-5 text-accent" /> Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-body text-sm">Nome Completo</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="font-body" />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Telefone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="font-body" placeholder="(00) 00000-0000" />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">CPF</Label>
                <Input value={cpf} onChange={(e) => setCpf(e.target.value)} className="font-body" placeholder="000.000.000-00" />
              </div>
              <div className="space-y-2">
                <Label className="font-body text-sm">Empresa</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="font-body" />
              </div>
            </div>
            <Button onClick={handleSaveProfile} disabled={saving} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </CardContent>
        </Card>

        {/* WhatsApp */}
        <WhatsAppConnect />

        {/* Password */}
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Lock className="h-5 w-5 text-accent" /> Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body text-sm">Nova Senha</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="font-body" placeholder="Mínimo 6 caracteres" />
            </div>
            <Button onClick={handleChangePassword} disabled={changingPassword} variant="outline" className="font-body gap-2">
              <Lock className="h-4 w-4" /> {changingPassword ? "Alterando..." : "Alterar Senha"}
            </Button>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground font-body">
          E-mail da conta: {user?.email}
        </p>
      </div>
    </ClientLayout>
  );
};

export default Configuracoes;
