import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EntryConfirmCard, { type ParsedEntry } from "./EntryConfirmCard";

/**
 * Quick entry bar embedded in the dashboard header — single input that lets the user
 * type natural language ("almoço 35") and the IA extracts + categorizes.
 */
const QuickEntryBar = ({ onCreated }: { onCreated?: () => void }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedEntry | null>(null);

  const handleParse = async () => {
    if (!text.trim() || !user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("parse-expense", { body: { text } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setParsed(data as ParsedEntry);
    } catch (e: any) {
      toast({ title: "Não consegui interpretar", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (entry: ParsedEntry) => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("financial_entries").insert({
      user_id: user.id,
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      date: entry.date,
      source: "web",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Lançamento criado!", description: `${entry.description} · ${entry.category}` });
    setText("");
    setParsed(null);
    onCreated?.();
  };

  return (
    <>
      <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/30 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-xs font-body uppercase tracking-wider text-muted-foreground">
            Lançamento rápido por IA
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) handleParse(); }}
            placeholder='Ex: "almoço 35,90" ou "uber 22 ontem"'
            className="font-body text-base flex-1"
            disabled={loading}
          />
          <Button
            onClick={handleParse}
            disabled={loading || !text.trim()}
            className="font-body bg-gradient-gold text-primary hover:opacity-90 shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lançar"}
          </Button>
        </div>
        <p className="mt-2 text-[10px] font-body text-muted-foreground">
          A IA categoriza automaticamente. Você confere antes de salvar.
        </p>
      </div>

      <Dialog open={!!parsed} onOpenChange={(v) => !v && setParsed(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Confirmar lançamento</DialogTitle>
          </DialogHeader>
          {parsed && (
            <EntryConfirmCard
              initial={parsed}
              onConfirm={handleConfirm}
              onCancel={() => setParsed(null)}
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickEntryBar;
