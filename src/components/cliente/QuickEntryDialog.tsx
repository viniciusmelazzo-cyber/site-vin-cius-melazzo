import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import EntryConfirmCard, { type ParsedEntry } from "./EntryConfirmCard";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const examples = ['"Almoço 35,90"', '"Recebi 1500 freelance"', '"Uber 22 ontem"', '"Mercado 187"'];

const QuickEntryDialog = ({ open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedEntry | null>(null);

  const reset = () => { setText(""); setParsed(null); setLoading(false); };

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
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Lançamento por IA
          </DialogTitle>
          <DialogDescription className="font-body text-sm">
            Digite em linguagem natural — a IA categoriza pra você.
          </DialogDescription>
        </DialogHeader>

        {!parsed ? (
          <div className="space-y-3 pt-2">
            <Input
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) handleParse(); }}
              placeholder="Ex: almoço 35,90"
              className="font-body text-base"
              disabled={loading}
            />
            <div className="flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setText(ex.replace(/"/g, ""))}
                  className="text-xs font-body px-2 py-1 rounded bg-secondary text-muted-foreground hover:bg-accent/10"
                  disabled={loading}
                >
                  {ex}
                </button>
              ))}
            </div>
            <Button
              onClick={handleParse}
              disabled={loading || !text.trim()}
              className="w-full font-body bg-gradient-gold text-primary hover:opacity-90"
            >
              {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Analisando…</> : "Interpretar"}
            </Button>
          </div>
        ) : (
          <EntryConfirmCard
            initial={parsed}
            onConfirm={handleConfirm}
            onCancel={() => setParsed(null)}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickEntryDialog;
