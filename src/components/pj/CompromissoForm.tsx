import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Save } from "lucide-react";
import { COMPROMISSO_TIPO_OPTIONS } from "@/lib/pj-constants";
import type { Compromisso, ClientePj } from "@/lib/pj-constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Compromisso>) => Promise<any>;
  clientes?: ClientePj[];
}

const CompromissoForm = ({ open, onClose, onSave, clientes = [] }: Props) => {
  const [form, setForm] = useState<Partial<Compromisso>>({
    tipo: 'reuniao',
    status: 'pendente',
    duracao_minutos: 60,
  });
  const [saving, setSaving] = useState(false);

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo?.trim() || !form.data_hora) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    setForm({ tipo: 'reuniao', status: 'pendente', duracao_minutos: 60 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" /> Novo Compromisso
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body text-sm">Título *</Label>
            <Input value={form.titulo || ""} onChange={e => set("titulo", e.target.value)} placeholder="Reunião com cliente..." required className="font-body" />
          </div>
          <div>
            <Label className="font-body text-sm">Data e Hora *</Label>
            <Input type="datetime-local" value={form.data_hora || ""} onChange={e => set("data_hora", e.target.value)} required className="font-body" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-body text-sm">Tipo</Label>
              <Select value={form.tipo || "reuniao"} onValueChange={v => set("tipo", v)}>
                <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COMPROMISSO_TIPO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-body text-sm">Duração (min)</Label>
              <Input type="number" value={form.duracao_minutos || 60} onChange={e => set("duracao_minutos", parseInt(e.target.value) || 60)} className="font-body" />
            </div>
          </div>
          {clientes.length > 0 && (
            <div>
              <Label className="font-body text-sm">Vincular a cliente (opcional)</Label>
              <Select value={form.cliente_pj_id || "none"} onValueChange={v => set("cliente_pj_id", v === "none" ? null : v)}>
                <SelectTrigger className="font-body"><SelectValue placeholder="Nenhum" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>
            <Label className="font-body text-sm">Descrição</Label>
            <Textarea value={form.descricao || ""} onChange={e => set("descricao", e.target.value)} placeholder="Detalhes do compromisso..." className="font-body min-h-[60px]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-body">Cancelar</Button>
            <Button type="submit" disabled={saving} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompromissoForm;
