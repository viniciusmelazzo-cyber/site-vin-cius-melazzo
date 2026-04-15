import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Copy, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminConvites = () => {
  const [invites, setInvites] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => { fetchInvites(); }, []);

  const fetchInvites = async () => {
    const { data } = await supabase.functions.invoke("admin-users", { body: { action: "list_invites" } });
    setInvites(data?.invites || []);
  };

  const handleCreateInvite = async () => {
    if (!inviteEmail) return;
    setInviteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "create_invite", email: inviteEmail } });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      const inviteUrl = `${window.location.origin}/cliente/login?invite=${data.invite.token}`;
      await navigator.clipboard.writeText(inviteUrl);
      toast({ title: "Convite criado!", description: "Link copiado para a área de transferência." });
      setInviteEmail("");
      setDialogOpen(false);
      fetchInvites();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setInviteLoading(false);
    }
  };

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/cliente/login?invite=${token}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!" });
  };

  const pendingInvites = invites.filter((i: any) => i.status === "pending").length;

  return (
    <ClientLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Convites</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">{pendingInvites} convite{pendingInvites !== 1 ? "s" : ""} pendente{pendingInvites !== 1 ? "s" : ""}</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                <Plus className="h-4 w-4" /> Convidar Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Convidar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="font-body text-sm">E-mail do Cliente</Label>
                  <Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="cliente@email.com" className="font-body" />
                </div>
                <p className="text-xs text-muted-foreground font-body">Um link de convite será gerado e copiado para sua área de transferência.</p>
                <Button onClick={handleCreateInvite} disabled={inviteLoading || !inviteEmail} className="w-full font-body bg-gradient-gold text-primary hover:opacity-90">
                  {inviteLoading ? "Criando..." : "Gerar Convite e Copiar Link"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">E-mail</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs">Criado em</TableHead>
                  <TableHead className="font-body text-xs">Expira em</TableHead>
                  <TableHead className="font-body text-xs w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-body text-sm">{inv.email}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "accepted" ? "default" : inv.status === "expired" ? "destructive" : "secondary"} className="font-body text-[10px] capitalize">
                        {inv.status === "pending" ? "Pendente" : inv.status === "accepted" ? "Aceito" : "Expirado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">{new Date(inv.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell className="font-body text-xs text-muted-foreground">{new Date(inv.expires_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      {inv.status === "pending" && (
                        <Button variant="ghost" size="icon" onClick={() => copyInviteLink(inv.token)}><Copy className="h-4 w-4" /></Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {invites.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-body text-sm">Nenhum convite enviado ainda</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default AdminConvites;
