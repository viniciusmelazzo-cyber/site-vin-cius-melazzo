import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, CheckCircle2, Loader2, Unlink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type WaLink = {
  id: string;
  phone_e164: string;
  verified: boolean;
  verified_at: string | null;
  created_at: string;
};

const formatPhoneBR = (raw: string) => {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const WhatsAppConnect = () => {
  const { user } = useAuth();
  const [link, setLink] = useState<WaLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [pollTick, setPollTick] = useState(0);

  const loadLink = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("whatsapp_links")
      .select("id, phone_e164, verified, verified_at, created_at")
      .eq("user_id", user.id)
      .maybeSingle();
    setLink(data ?? null);
    setLoading(false);
  };

  useEffect(() => {
    loadLink();
  }, [user]);

  // While there's an unverified link, poll every 5s to detect verification from WhatsApp
  useEffect(() => {
    if (!link || link.verified) return;
    const t = setInterval(() => setPollTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, [link?.id, link?.verified]);

  useEffect(() => {
    if (pollTick > 0) loadLink();
  }, [pollTick]);

  const handleSendCode = async () => {
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10 && digits.length !== 11) {
      toast({ title: "Número inválido", description: "Use o formato (34) 99999-8888.", variant: "destructive" });
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("whatsapp-link", {
        body: { phone: digits },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Código enviado!", description: "Responda no WhatsApp com o código de 6 dígitos para confirmar." });
      await loadLink();
    } catch (err: any) {
      toast({
        title: "Não foi possível enviar",
        description: err?.message || "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleUnlink = async () => {
    if (!user || !link) return;
    if (!confirm("Desvincular este número? Você precisará reenviar o código para reconectar.")) return;
    setUnlinking(true);
    try {
      const { error } = await supabase.from("whatsapp_links").delete().eq("user_id", user.id);
      if (error) throw error;
      setLink(null);
      setPhone("");
      toast({ title: "WhatsApp desvinculado." });
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setUnlinking(false);
    }
  };

  const prettyPhone = (e164: string) => {
    // +5534999998888 → (34) 99999-8888
    const d = e164.replace(/\D/g, "");
    if (d.length === 13 && d.startsWith("55")) {
      return `(${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
    }
    return e164;
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-display flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-accent" /> Conectar WhatsApp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-body">
            <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
          </div>
        ) : link?.verified ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-finance-positive hover:bg-finance-positive text-primary-foreground gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Conectado
              </Badge>
              <span className="font-body text-sm text-foreground">{prettyPhone(link.phone_e164)}</span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Envie mensagens (texto, foto de cupom ou áudio) para o WhatsApp da Melazzo e o lançamento entra
              automaticamente na sua conta. Pergunte também: <em>"quanto gastei essa semana?"</em>
            </p>
            <Button
              onClick={handleUnlink}
              disabled={unlinking}
              variant="outline"
              size="sm"
              className="font-body gap-2 text-destructive hover:text-destructive"
            >
              <Unlink className="h-4 w-4" /> {unlinking ? "Desvinculando..." : "Desvincular"}
            </Button>
          </div>
        ) : link && !link.verified ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-accent text-accent gap-1">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Aguardando código
              </Badge>
              <span className="font-body text-sm text-foreground">{prettyPhone(link.phone_e164)}</span>
            </div>
            <div className="rounded-md border border-accent/30 bg-accent/5 p-3 text-sm font-body text-foreground">
              Enviamos um <strong>código de 6 dígitos</strong> para o seu WhatsApp. Responda a mensagem com o código
              para confirmar. Esta página atualiza sozinha quando confirmarmos.
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSendCode}
                disabled={sending}
                variant="outline"
                size="sm"
                className="font-body"
              >
                {sending ? "Reenviando..." : "Reenviar código"}
              </Button>
              <Button
                onClick={handleUnlink}
                disabled={unlinking}
                variant="ghost"
                size="sm"
                className="font-body text-muted-foreground"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              Vincule seu número para lançar gastos pelo WhatsApp em segundos. A Melazzo envia um código de 6 dígitos
              e você responde no WhatsApp para confirmar que o número é seu.
            </p>
            <div className="space-y-2">
              <Label className="font-body text-sm">Seu WhatsApp</Label>
              <div className="flex gap-2">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(formatPhoneBR(e.target.value))}
                  placeholder="(34) 99999-8888"
                  className="font-body"
                  inputMode="tel"
                  maxLength={16}
                />
                <Button
                  onClick={handleSendCode}
                  disabled={sending || phone.replace(/\D/g, "").length < 10}
                  className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                  {sending ? "Enviando..." : "Enviar código"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground font-body">
                Use seu DDD + número. Apenas números brasileiros são aceitos.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppConnect;
