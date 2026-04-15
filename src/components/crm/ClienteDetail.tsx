import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Plus, MessageSquare, ArrowRightLeft } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, type CrmCliente, type CrmHistorico } from "@/lib/crm-constants";
import { useCrmHistorico } from "@/hooks/useCrmClientes";

interface ClienteDetailProps {
  open: boolean;
  onClose: () => void;
  cliente: CrmCliente | null;
  onEdit: () => void;
}

const ClienteDetail = ({ open, onClose, cliente, onEdit }: ClienteDetailProps) => {
  const { historico, addHistorico } = useCrmHistorico(cliente?.id || null);
  const [notaTitulo, setNotaTitulo] = useState("");
  const [notaDescricao, setNotaDescricao] = useState("");

  if (!cliente) return null;

  const handleAddNota = async () => {
    if (!notaTitulo.trim()) return;
    await addHistorico({ tipo: "nota", titulo: notaTitulo, descricao: notaDescricao || undefined });
    setNotaTitulo("");
    setNotaDescricao("");
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%]">{value || "—"}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <div>
              <DialogTitle className="font-display">{cliente.nome}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={cliente.status} />
                {cliente.produto && <span className="text-xs text-muted-foreground">{cliente.produto}</span>}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onEdit}>Editar</Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-4 space-y-4">
              <Card className="border-border">
                <CardContent className="pt-4">
                  <h4 className="text-sm font-semibold mb-2">Dados Pessoais</h4>
                  <InfoRow label="CPF" value={cliente.cpf} />
                  <InfoRow label="RG" value={cliente.rg} />
                  <InfoRow label="Nascimento" value={formatDate(cliente.data_nascimento)} />
                  <InfoRow label="Profissão" value={cliente.profissao} />
                  <InfoRow label="Telefones" value={cliente.telefones} />
                  <InfoRow label="E-mail" value={cliente.email} />
                  <InfoRow label="Endereço" value={cliente.endereco} />
                  <InfoRow label="Cidade/UF" value={`${cliente.cidade || "—"} / ${cliente.estado || "—"}`} />
                  <InfoRow label="Estado Civil" value={cliente.estado_civil} />
                  <InfoRow label="Perfil de Renda" value={cliente.perfil_renda} />
                  <InfoRow label="Formalização" value={cliente.formalizacao_renda} />
                </CardContent>
              </Card>

              {cliente.conjuge_nome && (
                <Card className="border-border">
                  <CardContent className="pt-4">
                    <h4 className="text-sm font-semibold mb-2">Cônjuge</h4>
                    <InfoRow label="Nome" value={cliente.conjuge_nome} />
                    <InfoRow label="CPF" value={cliente.conjuge_cpf} />
                    <InfoRow label="Telefone" value={cliente.conjuge_telefone} />
                    <InfoRow label="E-mail" value={cliente.conjuge_email} />
                  </CardContent>
                </Card>
              )}

              {cliente.google_drive_url && (
                <a href={cliente.google_drive_url} target="_blank" rel="noopener noreferrer"
                   className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <ExternalLink className="h-4 w-4" /> Abrir Google Drive
                </a>
              )}

              {cliente.observacoes && (
                <Card className="border-border">
                  <CardContent className="pt-4">
                    <h4 className="text-sm font-semibold mb-2">Observações</h4>
                    <p className="text-sm whitespace-pre-wrap">{cliente.observacoes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="financeiro" className="mt-4">
              <Card className="border-border">
                <CardContent className="pt-4">
                  <InfoRow label="Produto" value={cliente.produto} />
                  <InfoRow label="Subproduto" value={cliente.subproduto} />
                  <InfoRow label="Banco" value={cliente.banco} />
                  <InfoRow label="Valor" value={formatCurrency(cliente.valor)} />
                  <InfoRow label="Data de Entrada" value={formatDate(cliente.data_entrada)} />
                  <InfoRow label="Indicação" value={cliente.indicacao} />
                  <InfoRow label="Comissão Tipo" value={cliente.comissao_tipo} />
                  <InfoRow label="Comissão %" value={cliente.comissao_percentual ? `${cliente.comissao_percentual}%` : null} />
                  <InfoRow label="Honorários Iniciais" value={formatCurrency(cliente.honorarios_iniciais)} />
                  <InfoRow label="Comissão Indicador" value={cliente.comissao_indicador} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="historico" className="mt-4 space-y-4">
              {/* Add note form */}
              <Card className="border-border">
                <CardContent className="pt-4 space-y-3">
                  <h4 className="text-sm font-semibold">Adicionar Nota</h4>
                  <Input
                    placeholder="Título da nota..."
                    value={notaTitulo}
                    onChange={(e) => setNotaTitulo(e.target.value)}
                  />
                  <Textarea
                    placeholder="Descrição (opcional)..."
                    value={notaDescricao}
                    onChange={(e) => setNotaDescricao(e.target.value)}
                    rows={2}
                  />
                  <Button size="sm" onClick={handleAddNota} disabled={!notaTitulo.trim()}
                    className="bg-gradient-gold text-primary hover:opacity-90">
                    <Plus className="h-4 w-4 mr-1" /> Adicionar
                  </Button>
                </CardContent>
              </Card>

              {/* Timeline */}
              <div className="space-y-3">
                {historico.map((h) => (
                  <Card key={h.id} className="border-border">
                    <CardContent className="py-3 flex items-start gap-3">
                      {h.tipo === "status" ? (
                        <ArrowRightLeft className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{h.titulo}</p>
                        {h.descricao && <p className="text-xs text-muted-foreground mt-0.5">{h.descricao}</p>}
                        {h.status_anterior && h.status_novo && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {h.status_anterior} → {h.status_novo}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(h.created_at)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {historico.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-4">Nenhum registro no histórico.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteDetail;
