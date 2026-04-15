import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PIPELINE_STATUSES, CONSULTORIA_STATUSES, PRODUTO_OPTIONS, SUBPRODUTO_MAP,
  ESTADO_CIVIL_OPTIONS, PERFIL_RENDA_OPTIONS, FORMALIZACAO_RENDA_OPTIONS,
  COMISSAO_TIPO_OPTIONS, ESTADOS_BR, type CrmCliente, type CrmPipelineStatus,
} from "@/lib/crm-constants";

interface ClienteFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<CrmCliente>) => void;
  initialData?: CrmCliente | null;
}

const empty: Partial<CrmCliente> = {
  nome: "", cpf: "", rg: "", profissao: "", telefones: "", email: "",
  endereco: "", cidade: "", estado: "", data_nascimento: "",
  estado_civil: "", regime_casamento: "",
  conjuge_nome: "", conjuge_cpf: "", conjuge_data_nascimento: "",
  conjuge_telefone: "", conjuge_email: "", conjuge_endereco: "",
  conjuge_cidade: "", conjuge_estado: "",
  perfil_renda: "", formalizacao_renda: "",
  produto: "", subproduto: "", banco: "", valor: 0,
  status: "prospeccao" as CrmPipelineStatus,
  comissao_tipo: "", comissao_percentual: 0, honorarios_iniciais: 0,
  data_entrada: "", data_indicacao: "", indicacao: "", comissao_indicador: "",
  google_drive_url: "", observacoes: "",
};

const ClienteForm = ({ open, onClose, onSave, initialData }: ClienteFormProps) => {
  const [form, setForm] = useState<Partial<CrmCliente>>(empty);
  const isEdit = !!initialData;

  useEffect(() => {
    setForm(initialData ? { ...initialData } : { ...empty });
  }, [initialData, open]);

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    if (!form.nome?.trim()) return;
    onSave(form);
    onClose();
  };

  const allStatuses = [...PIPELINE_STATUSES, ...CONSULTORIA_STATUSES.filter(s => !PIPELINE_STATUSES.some(p => p.value === s.value))];
  const subprodutos = form.produto ? SUBPRODUTO_MAP[form.produto] || [] : [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="font-display">{isEdit ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <Tabs defaultValue="pessoal" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="pessoal">Pessoal</TabsTrigger>
              <TabsTrigger value="conjuge">Cônjuge</TabsTrigger>
              <TabsTrigger value="produto">Produto</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="pessoal" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome *</Label>
                  <Input value={form.nome || ""} onChange={(e) => set("nome", e.target.value)} />
                </div>
                <div>
                  <Label>CPF</Label>
                  <Input value={form.cpf || ""} onChange={(e) => set("cpf", e.target.value)} />
                </div>
                <div>
                  <Label>RG</Label>
                  <Input value={form.rg || ""} onChange={(e) => set("rg", e.target.value)} />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={form.data_nascimento || ""} onChange={(e) => set("data_nascimento", e.target.value)} />
                </div>
                <div>
                  <Label>Telefones</Label>
                  <Input value={form.telefones || ""} onChange={(e) => set("telefones", e.target.value)} />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div>
                  <Label>Profissão</Label>
                  <Input value={form.profissao || ""} onChange={(e) => set("profissao", e.target.value)} />
                </div>
                <div>
                  <Label>Estado Civil</Label>
                  <Select value={form.estado_civil || ""} onValueChange={(v) => set("estado_civil", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {ESTADO_CIVIL_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input value={form.endereco || ""} onChange={(e) => set("endereco", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.cidade || ""} onChange={(e) => set("cidade", e.target.value)} />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={form.estado || ""} onValueChange={(v) => set("estado", v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Perfil de Renda</Label>
                  <Select value={form.perfil_renda || ""} onValueChange={(v) => set("perfil_renda", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {PERFIL_RENDA_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Formalização</Label>
                  <Select value={form.formalizacao_renda || ""} onValueChange={(v) => set("formalizacao_renda", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {FORMALIZACAO_RENDA_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="conjuge" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Cônjuge</Label>
                  <Input value={form.conjuge_nome || ""} onChange={(e) => set("conjuge_nome", e.target.value)} />
                </div>
                <div>
                  <Label>CPF do Cônjuge</Label>
                  <Input value={form.conjuge_cpf || ""} onChange={(e) => set("conjuge_cpf", e.target.value)} />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={form.conjuge_data_nascimento || ""} onChange={(e) => set("conjuge_data_nascimento", e.target.value)} />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input value={form.conjuge_telefone || ""} onChange={(e) => set("conjuge_telefone", e.target.value)} />
                </div>
                <div>
                  <Label>E-mail</Label>
                  <Input type="email" value={form.conjuge_email || ""} onChange={(e) => set("conjuge_email", e.target.value)} />
                </div>
                <div>
                  <Label>Regime de Casamento</Label>
                  <Input value={form.regime_casamento || ""} onChange={(e) => set("regime_casamento", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input value={form.conjuge_endereco || ""} onChange={(e) => set("conjuge_endereco", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cidade</Label>
                  <Input value={form.conjuge_cidade || ""} onChange={(e) => set("conjuge_cidade", e.target.value)} />
                </div>
                <div>
                  <Label>Estado</Label>
                  <Select value={form.conjuge_estado || ""} onValueChange={(v) => set("conjuge_estado", v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="produto" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Produto</Label>
                  <Select value={form.produto || ""} onValueChange={(v) => { set("produto", v); set("subproduto", ""); }}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {PRODUTO_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subproduto</Label>
                  <Select value={form.subproduto || ""} onValueChange={(v) => set("subproduto", v)} disabled={subprodutos.length === 0}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {subprodutos.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Banco</Label>
                  <Input value={form.banco || ""} onChange={(e) => set("banco", e.target.value)} />
                </div>
                <div>
                  <Label>Valor (R$)</Label>
                  <Input type="number" value={form.valor || 0} onChange={(e) => set("valor", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status || "prospeccao"} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allStatuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data de Entrada</Label>
                  <Input type="date" value={form.data_entrada || ""} onChange={(e) => set("data_entrada", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Indicação</Label>
                <Input value={form.indicacao || ""} onChange={(e) => set("indicacao", e.target.value)} />
              </div>
              <div>
                <Label>Google Drive URL</Label>
                <Input value={form.google_drive_url || ""} onChange={(e) => set("google_drive_url", e.target.value)} />
              </div>
              <div>
                <Label>Observações</Label>
                <Textarea value={form.observacoes || ""} onChange={(e) => set("observacoes", e.target.value)} rows={3} />
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Comissão</Label>
                  <Select value={form.comissao_tipo || ""} onValueChange={(v) => set("comissao_tipo", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {COMISSAO_TIPO_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Comissão (%)</Label>
                  <Input type="number" step="0.1" value={form.comissao_percentual || 0} onChange={(e) => set("comissao_percentual", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Honorários Iniciais (R$)</Label>
                  <Input type="number" value={form.honorarios_iniciais || 0} onChange={(e) => set("honorarios_iniciais", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Comissão Indicador</Label>
                  <Input value={form.comissao_indicador || ""} onChange={(e) => set("comissao_indicador", e.target.value)} />
                </div>
                <div>
                  <Label>Data da Indicação</Label>
                  <Input type="date" value={form.data_indicacao || ""} onChange={(e) => set("data_indicacao", e.target.value)} />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-gradient-gold text-primary hover:opacity-90">
              {isEdit ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;
