import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Building2, Phone, MapPin, Briefcase, Save } from "lucide-react";
import { PJ_STATUS_OPTIONS, SEGMENTO_OPTIONS, ESTADOS_BR } from "@/lib/pj-constants";
import type { ClientePj } from "@/lib/pj-constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ClientePj>) => Promise<void>;
  initialData?: ClientePj | null;
}

const PjClienteForm = ({ open, onClose, onSave, initialData }: Props) => {
  const [form, setForm] = useState<Partial<ClientePj>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...initialData } : { status: 'ativo' });
    }
  }, [open, initialData]);

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome?.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{initialData ? "Editar Cliente PJ" : "Novo Cliente PJ"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Empresariais */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-display font-semibold text-accent">Dados Empresariais</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="font-body text-sm">Nome / Fantasia *</Label>
                <Input value={form.nome || ""} onChange={e => set("nome", e.target.value)} placeholder="Nome da empresa" required className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Razão Social</Label>
                <Input value={form.razao_social || ""} onChange={e => set("razao_social", e.target.value)} placeholder="Razão social completa" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">CNPJ</Label>
                <Input value={form.cnpj || ""} onChange={e => set("cnpj", e.target.value)} placeholder="00.000.000/0000-00" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Responsável</Label>
                <Input value={form.responsavel || ""} onChange={e => set("responsavel", e.target.value)} placeholder="Nome do responsável" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Status</Label>
                <Select value={form.status || "ativo"} onValueChange={v => set("status", v)}>
                  <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PJ_STATUS_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contato */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Phone className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-display font-semibold text-accent">Contato</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Telefone</Label>
                <Input value={form.telefone || ""} onChange={e => set("telefone", e.target.value)} placeholder="(00) 0 0000-0000" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">E-mail</Label>
                <Input value={form.email || ""} onChange={e => set("email", e.target.value)} placeholder="email@empresa.com" type="email" className="font-body" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Endereço */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-display font-semibold text-accent">Endereço</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label className="font-body text-sm">Endereço</Label>
                <Input value={form.endereco || ""} onChange={e => set("endereco", e.target.value)} placeholder="Rua, número, bairro" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Cidade</Label>
                <Input value={form.cidade || ""} onChange={e => set("cidade", e.target.value)} placeholder="Cidade" className="font-body" />
              </div>
              <div>
                <Label className="font-body text-sm">Estado</Label>
                <Select value={form.estado || ""} onValueChange={v => set("estado", v)}>
                  <SelectTrigger className="font-body"><SelectValue placeholder="UF" /></SelectTrigger>
                  <SelectContent>
                    {ESTADOS_BR.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Segmento */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-display font-semibold text-accent">Segmento</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-body text-sm">Segmento</Label>
                <Select value={form.segmento || ""} onValueChange={v => set("segmento", v)}>
                  <SelectTrigger className="font-body"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {SEGMENTO_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body text-sm">Atividade</Label>
                <Input value={form.atividade || ""} onChange={e => set("atividade", e.target.value)} placeholder="Atividade principal" className="font-body" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Google Drive + Observações */}
          <div className="space-y-4">
            <div>
              <Label className="font-body text-sm">Link da Pasta Google Drive</Label>
              <Input value={form.google_drive_url || ""} onChange={e => set("google_drive_url", e.target.value)} placeholder="https://drive.google.com/drive/folders/..." className="font-body" />
            </div>
            <div>
              <Label className="font-body text-sm">Observações</Label>
              <Textarea value={form.observacoes || ""} onChange={e => set("observacoes", e.target.value)} placeholder="Observações sobre o cliente..." className="font-body min-h-[80px]" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="font-body">Cancelar</Button>
            <Button type="submit" disabled={saving} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
              <Save className="h-4 w-4" /> {saving ? "Salvando..." : initialData ? "Salvar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PjClienteForm;
