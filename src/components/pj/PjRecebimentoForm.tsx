import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Save } from "lucide-react";
import { RECEBIMENTO_TIPO_OPTIONS, RECEBIMENTO_FREQUENCIA_OPTIONS, RECEBIMENTO_STATUS_OPTIONS } from "@/lib/pj-constants";
import type { PjRecebimento } from "@/lib/pj-constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<PjRecebimento>) => Promise<void>;
}

const PjRecebimentoForm = ({ open, onClose, onSave }: Props) => {
  const [form, setForm] = useState<Partial<PjRecebimento>>({
    tipo: 'mensalidade',
    valor: 0,
    recorrente: true,
    frequencia: 'mensal',
    status: 'pendente',
  });
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setForm({ tipo: 'mensalidade', valor: 0, recorrente: true, frequencia: 'mensal', status: 'pendente' });
    onClose();
  };

  const showParcelas = form.tipo === 'honorarios_iniciais';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" /> Novo Recebimento
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body text-sm">Tipo</Label>
            <Select value={form.tipo || "mensalidade"} onValueChange={v => set("tipo", v)}>
              <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RECEBIMENTO_TIPO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-body text-sm">Descrição</Label>
            <Input value={form.descricao || ""} onChange={e => set("descricao", e.target.value)} placeholder="Ex: Mensalidade consultoria" className="font-body" />
          </div>

          <div>
            <Label className="font-body text-sm">Valor (R$)</Label>
            <Input type="number" step="0.01" value={form.valor || ""} onChange={e => set("valor", parseFloat(e.target.value) || 0)} placeholder="0,00" className="font-body" />
          </div>

          <div className="flex items-center justify-between">
            <Label className="font-body text-sm">Recorrente</Label>
            <Switch checked={form.recorrente || false} onCheckedChange={v => set("recorrente", v)} />
          </div>

          {form.recorrente && (
            <div>
              <Label className="font-body text-sm">Frequência</Label>
              <Select value={form.frequencia || "mensal"} onValueChange={v => set("frequencia", v)}>
                <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {RECEBIMENTO_FREQUENCIA_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}

          {showParcelas && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Total de Parcelas</Label>
                <Input type="number" value={form.parcelas_total || ""} onChange={e => set("parcelas_total", parseInt(e.target.value) || null)} className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Parcelas Pagas</Label>
                <Input type="number" value={form.parcelas_pagas || 0} onChange={e => set("parcelas_pagas", parseInt(e.target.value) || 0)} className="font-body" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Data Início</Label>
              <Input type="date" value={form.data_inicio || ""} onChange={e => set("data_inicio", e.target.value)} className="font-body" />
            </div>
            <div>
              <Label className="font-body text-sm">Data Vencimento</Label>
              <Input type="date" value={form.data_vencimento || ""} onChange={e => set("data_vencimento", e.target.value)} className="font-body" />
            </div>
          </div>

          <div>
            <Label className="font-body text-sm">Status</Label>
            <Select value={form.status || "pendente"} onValueChange={v => set("status", v)}>
              <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                {RECEBIMENTO_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-body">Cancelar</Button>
            <Button type="submit" disabled={saving} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PjRecebimentoForm;
