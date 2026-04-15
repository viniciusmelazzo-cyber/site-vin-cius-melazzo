import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Phone, Mail, MapPin, DollarSign, Clock, Plus, Trash2, ExternalLink } from "lucide-react";
import { usePjRecebimentos, usePjHistorico } from "@/hooks/usePjClientes";
import PjRecebimentoForm from "./PjRecebimentoForm";
import type { ClientePj } from "@/lib/pj-constants";
import { formatCurrency, formatDate, getStatusConfig, getRecebimentoStatusConfig, HISTORICO_TIPO_OPTIONS } from "@/lib/pj-constants";

interface Props {
  open: boolean;
  onClose: () => void;
  cliente: ClientePj | null;
  onEdit: () => void;
}

const PjClienteDetail = ({ open, onClose, cliente, onEdit }: Props) => {
  const { recebimentos, addRecebimento, deleteRecebimento } = usePjRecebimentos(cliente?.id || null);
  const { historico, addHistorico } = usePjHistorico(cliente?.id || null);
  const [recebimentoFormOpen, setRecebimentoFormOpen] = useState(false);
  const [novoTipo, setNovoTipo] = useState("nota");
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novoDescricao, setNovoDescricao] = useState("");

  if (!cliente) return null;
  const statusCfg = getStatusConfig(cliente.status);

  const totalRecebimentos = recebimentos.filter(r => r.status === 'pendente' || r.status === 'pago')
    .reduce((s, r) => s + Number(r.valor), 0);

  const handleAddHistorico = async () => {
    if (!novoTitulo.trim()) return;
    await addHistorico({ tipo: novoTipo, titulo: novoTitulo, descricao: novoDescricao || undefined });
    setNovoTitulo("");
    setNovoDescricao("");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="font-display text-lg">{cliente.nome}</SheetTitle>
                {cliente.razao_social && <p className="text-xs text-muted-foreground font-body">{cliente.razao_social}</p>}
              </div>
              <Badge className={`${statusCfg.bg} ${statusCfg.color} border-0 text-[10px] font-body`}>{statusCfg.label}</Badge>
            </div>
          </SheetHeader>

          <Tabs defaultValue="info" className="mt-2">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="info" className="text-xs font-body">Dados</TabsTrigger>
              <TabsTrigger value="recebimentos" className="text-xs font-body">Recebimentos</TabsTrigger>
              <TabsTrigger value="historico" className="text-xs font-body">Histórico</TabsTrigger>
            </TabsList>

            {/* INFO */}
            <TabsContent value="info" className="mt-4 space-y-4">
              <div className="space-y-3 text-sm font-body">
                {cliente.cnpj && <div className="flex gap-2"><Building2 className="h-4 w-4 text-muted-foreground shrink-0" /><span>{cliente.cnpj}</span></div>}
                {cliente.responsavel && <div className="flex gap-2"><span className="text-muted-foreground">Responsável:</span><span>{cliente.responsavel}</span></div>}
                {cliente.telefone && <div className="flex gap-2"><Phone className="h-4 w-4 text-muted-foreground shrink-0" /><span>{cliente.telefone}</span></div>}
                {cliente.email && <div className="flex gap-2"><Mail className="h-4 w-4 text-muted-foreground shrink-0" /><span>{cliente.email}</span></div>}
                {(cliente.endereco || cliente.cidade) && (
                  <div className="flex gap-2"><MapPin className="h-4 w-4 text-muted-foreground shrink-0" /><span>{[cliente.endereco, cliente.cidade, cliente.estado].filter(Boolean).join(", ")}</span></div>
                )}
                {cliente.segmento && <div><span className="text-muted-foreground">Segmento:</span> {cliente.segmento}</div>}
                {cliente.atividade && <div><span className="text-muted-foreground">Atividade:</span> {cliente.atividade}</div>}
                {cliente.observacoes && (
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground mb-1">Observações</p>
                    <p className="text-sm">{cliente.observacoes}</p>
                  </div>
                )}
                {cliente.google_drive_url && (
                  <a href={cliente.google_drive_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-accent hover:underline">
                    <ExternalLink className="h-4 w-4" /> Pasta Google Drive
                  </a>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={onEdit} className="font-body w-full">Editar Dados</Button>
            </TabsContent>

            {/* RECEBIMENTOS */}
            <TabsContent value="recebimentos" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-body">Total provisionado</p>
                  <p className="text-lg font-display font-bold text-foreground">{formatCurrency(totalRecebimentos)}</p>
                </div>
                <Button size="sm" onClick={() => setRecebimentoFormOpen(true)} className="font-body gap-1.5 bg-gradient-gold text-primary hover:opacity-90">
                  <Plus className="h-3.5 w-3.5" /> Recebimento
                </Button>
              </div>

              <div className="space-y-2">
                {recebimentos.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum recebimento cadastrado</p>}
                {recebimentos.map(r => {
                  const rStatus = getRecebimentoStatusConfig(r.status as any);
                  return (
                    <Card key={r.id} className="border-border">
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3.5 w-3.5 text-accent" />
                            <span className="text-sm font-body font-medium">{formatCurrency(r.valor)}</span>
                            <Badge className={`${rStatus.bg} ${rStatus.color} border-0 text-[9px] font-body`}>{rStatus.label}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground font-body">
                            {r.descricao || r.tipo} {r.recorrente ? `• ${r.frequencia}` : "• único"}
                            {r.parcelas_total ? ` • ${r.parcelas_pagas}/${r.parcelas_total} parcelas` : ""}
                          </p>
                          {r.data_vencimento && <p className="text-[10px] text-muted-foreground font-body">Venc: {formatDate(r.data_vencimento)}</p>}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteRecebimento(r.id)} className="h-7 w-7">
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* HISTORICO */}
            <TabsContent value="historico" className="mt-4 space-y-4">
              <div className="space-y-3 p-3 rounded-lg bg-secondary">
                <div className="grid grid-cols-2 gap-2">
                  <Select value={novoTipo} onValueChange={setNovoTipo}>
                    <SelectTrigger className="font-body text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {HISTORICO_TIPO_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Input value={novoTitulo} onChange={e => setNovoTitulo(e.target.value)} placeholder="Título" className="font-body text-xs" />
                </div>
                <Textarea value={novoDescricao} onChange={e => setNovoDescricao(e.target.value)} placeholder="Descrição (opcional)" className="font-body text-xs min-h-[60px]" />
                <Button size="sm" onClick={handleAddHistorico} disabled={!novoTitulo.trim()} className="font-body text-xs w-full gap-1.5 bg-gradient-gold text-primary hover:opacity-90">
                  <Plus className="h-3.5 w-3.5" /> Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {historico.length === 0 && <p className="text-sm text-muted-foreground font-body text-center py-4">Nenhum registro no histórico</p>}
                {historico.map(h => (
                  <div key={h.id} className="flex gap-3 text-sm font-body">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2" />
                      <div className="w-px flex-1 bg-border" />
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] font-body capitalize">{h.tipo}</Badge>
                        <span className="text-[10px] text-muted-foreground">{formatDate(h.created_at)}</span>
                      </div>
                      <p className="font-medium mt-1">{h.titulo}</p>
                      {h.descricao && <p className="text-xs text-muted-foreground mt-0.5">{h.descricao}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <PjRecebimentoForm open={recebimentoFormOpen} onClose={() => setRecebimentoFormOpen(false)} onSave={addRecebimento} />
    </>
  );
};

export default PjClienteDetail;
