import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, Pencil, Loader2 } from "lucide-react";

export interface ParsedEntry {
  type: "receita" | "despesa";
  amount: number;
  category: string;
  description: string;
  date: string;
  confidence: number;
  notes?: string;
}

const CATEGORIES = [
  "Salário", "Freelance", "Investimentos", "Aluguel", "Alimentação",
  "Transporte", "Saúde", "Educação", "Lazer", "Moradia", "Cartão de Crédito", "Outros",
];

interface Props {
  initial: ParsedEntry;
  onConfirm: (entry: ParsedEntry) => void;
  onCancel: () => void;
  loading: boolean;
}

const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const EntryConfirmCard = ({ initial, onConfirm, onCancel, loading }: Props) => {
  const [editing, setEditing] = useState(false);
  const [entry, setEntry] = useState<ParsedEntry>(initial);

  const confidenceLabel = entry.confidence >= 0.8 ? "Alta" : entry.confidence >= 0.5 ? "Média" : "Baixa";
  const confidenceVariant = entry.confidence >= 0.8 ? "default" : entry.confidence >= 0.5 ? "secondary" : "destructive";

  if (!editing) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide">
              {entry.type === "receita" ? "Receita" : "Despesa"}
            </p>
            <p className="text-2xl font-display font-bold text-foreground">
              {entry.type === "receita" ? "+" : "−"} {fmtBRL(entry.amount)}
            </p>
          </div>
          <Badge variant={confidenceVariant as any} className="font-body text-[10px]">
            Confiança: {confidenceLabel}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="font-body text-sm font-medium">{entry.description}</p>
          <p className="text-xs font-body text-muted-foreground">
            {entry.category} · {new Date(entry.date + "T12:00:00").toLocaleDateString("pt-BR")}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
            disabled={loading}
            className="font-body gap-2"
          >
            <Pencil className="h-4 w-4" /> Editar
          </Button>
          <Button
            onClick={() => onConfirm(entry)}
            disabled={loading}
            className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Confirmar
          </Button>
        </div>
        <button onClick={onCancel} className="w-full text-xs font-body text-muted-foreground hover:text-foreground" disabled={loading}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="font-body text-xs">Tipo</Label>
          <Select value={entry.type} onValueChange={(v) => setEntry((p) => ({ ...p, type: v as any }))}>
            <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="receita">Receita</SelectItem>
              <SelectItem value="despesa">Despesa</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs">Categoria</Label>
          <Select value={entry.category} onValueChange={(v) => setEntry((p) => ({ ...p, category: v }))}>
            <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="font-body text-xs">Descrição</Label>
        <Input value={entry.description} onChange={(e) => setEntry((p) => ({ ...p, description: e.target.value }))} className="font-body" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="font-body text-xs">Valor (R$)</Label>
          <Input type="number" step="0.01" value={entry.amount} onChange={(e) => setEntry((p) => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="font-body text-xs">Data</Label>
          <Input type="date" value={entry.date} onChange={(e) => setEntry((p) => ({ ...p, date: e.target.value }))} className="font-body" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button variant="outline" onClick={() => setEditing(false)} disabled={loading} className="font-body">
          Voltar
        </Button>
        <Button onClick={() => onConfirm(entry)} disabled={loading} className="font-body bg-gradient-gold text-primary hover:opacity-90">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
        </Button>
      </div>
    </div>
  );
};

export default EntryConfirmCard;
