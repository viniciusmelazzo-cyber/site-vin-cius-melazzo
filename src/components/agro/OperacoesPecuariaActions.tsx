import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Beef, Scale, Receipt, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

type Action = null | "lote" | "pesagem" | "custo" | "venda";

export function OperacoesPecuariaActions() {
  const [open, setOpen] = useState<Action>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setOpen("lote")}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo Lote
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen("pesagem")}>
          <Scale className="h-3.5 w-3.5 mr-1.5" /> Nova Pesagem
        </Button>
        <Button size="sm" variant="outline" onClick={() => setOpen("custo")}>
          <Receipt className="h-3.5 w-3.5 mr-1.5" /> Novo Custo
        </Button>
        <Button size="sm" className="bg-gold hover:bg-gold-dark text-navy" onClick={() => setOpen("venda")}>
          <ShoppingCart className="h-3.5 w-3.5 mr-1.5" /> Registrar Venda
        </Button>
      </div>

      <NovoLoteDialog open={open === "lote"} onClose={() => setOpen(null)} />
      <NovaPesagemDialog open={open === "pesagem"} onClose={() => setOpen(null)} />
      <NovoCustoDialog open={open === "custo"} onClose={() => setOpen(null)} />
      <NovaVendaDialog open={open === "venda"} onClose={() => setOpen(null)} />
    </>
  );
}

function NovoLoteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [codigo, setCodigo] = useState("");
  const [raca, setRaca] = useState("Nelore");
  const [qtde, setQtde] = useState("");
  const [pesoEntrada, setPesoEntrada] = useState("");
  const [precoCab, setPrecoCab] = useState("");
  const [area, setArea] = useState("");

  const submit = () => {
    if (!codigo || !qtde || !pesoEntrada) { toast.error("Código, quantidade e peso são obrigatórios"); return; }
    toast.success(`Lote ${codigo} criado · ${qtde} cab · ${pesoEntrada} kg médios (modo demo)`);
    setCodigo(""); setQtde(""); setPesoEntrada(""); setPrecoCab(""); setArea("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Beef className="h-5 w-5 text-gold" /> Novo Lote</SheetTitle>
          <SheetDescription>Cadastre um lote de animais. A compra gera automaticamente um lançamento PJ na Central Financeira.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Código do lote *</Label><Input value={codigo} onChange={(e) => setCodigo(e.target.value)} placeholder="Ex: L-2025-04" /></div>
          <div><Label>Raça</Label>
            <Select value={raca} onValueChange={setRaca}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Nelore">Nelore</SelectItem>
                <SelectItem value="Angus">Angus</SelectItem>
                <SelectItem value="Nelore × Angus">Nelore × Angus</SelectItem>
                <SelectItem value="Nelore × Brahman">Nelore × Brahman</SelectItem>
                <SelectItem value="Brangus">Brangus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Quantidade *</Label><Input type="number" value={qtde} onChange={(e) => setQtde(e.target.value)} /></div>
            <div><Label>Peso médio entrada (kg) *</Label><Input type="number" value={pesoEntrada} onChange={(e) => setPesoEntrada(e.target.value)} /></div>
          </div>
          <div><Label>Preço médio por cabeça (R$)</Label><Input type="number" value={precoCab} onChange={(e) => setPrecoCab(e.target.value)} /></div>
          <div><Label>Área de alocação</Label><Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Ex: Pasto Norte 1" /></div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Criar lote</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NovaPesagemDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lote, setLote] = useState("L-2024-08");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [pesoMedio, setPesoMedio] = useState("");

  const submit = () => {
    if (!pesoMedio) { toast.error("Informe o peso médio"); return; }
    toast.success(`Pesagem ${lote} registrada · ${pesoMedio} kg em ${data} (modo demo)`);
    setPesoMedio("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Scale className="h-5 w-5 text-gold" /> Nova Pesagem</SheetTitle>
          <SheetDescription>Atualize o peso médio de um lote para acompanhar o GMD.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Lote</Label>
            <Select value={lote} onValueChange={setLote}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="L-2024-05">L-2024-05 · Angus · 60 cab</SelectItem>
                <SelectItem value="L-2024-08">L-2024-08 · Nelore · 120 cab</SelectItem>
                <SelectItem value="L-2024-09">L-2024-09 · Nelore × Angus · 95 cab</SelectItem>
                <SelectItem value="L-2024-11">L-2024-11 · Nelore · 140 cab</SelectItem>
                <SelectItem value="L-2025-01">L-2025-01 · Nelore × Brahman · 85 cab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Data da pesagem</Label><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
          <div><Label>Peso médio (kg) *</Label><Input type="number" value={pesoMedio} onChange={(e) => setPesoMedio(e.target.value)} placeholder="Ex: 380" /></div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Registrar pesagem</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NovoCustoDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [categoria, setCategoria] = useState("Sanitário");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);

  const submit = () => {
    if (!descricao || !valor) { toast.error("Descrição e valor são obrigatórios"); return; }
    toast.success(`Custo de R$ ${valor} registrado · ${categoria} (modo demo · espelhado em lançamento PJ)`);
    setDescricao(""); setValor("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-gold" /> Novo Custo da Fazenda</SheetTitle>
          <SheetDescription>Registre custos operacionais. Eles aparecem automaticamente como despesa na Central Financeira PJ.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Categoria</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Sanitário">Sanitário (vacina, vermífugo)</SelectItem>
                <SelectItem value="Alimentação">Alimentação (ração, sal mineral)</SelectItem>
                <SelectItem value="Mão de Obra">Mão de Obra</SelectItem>
                <SelectItem value="Manutenção">Manutenção (cercas, currais)</SelectItem>
                <SelectItem value="Combustível">Combustível</SelectItem>
                <SelectItem value="Arrendamento">Arrendamento</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Descrição *</Label><Input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Ex: Vacinação aftosa rebanho" /></div>
          <div><Label>Valor (R$) *</Label><Input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} /></div>
          <div><Label>Data</Label><Input type="date" value={data} onChange={(e) => setData(e.target.value)} /></div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Registrar custo</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function NovaVendaDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lote, setLote] = useState("L-2024-05");
  const [qtde, setQtde] = useState("");
  const [pesoMedio, setPesoMedio] = useState("");
  const [precoArroba, setPrecoArroba] = useState("248");
  const [comprador, setComprador] = useState("");

  const arrobas = (Number(qtde) * Number(pesoMedio) * 0.54) / 15;
  const receita = arrobas * Number(precoArroba);

  const submit = () => {
    if (!qtde || !pesoMedio) { toast.error("Quantidade e peso são obrigatórios"); return; }
    toast.success(`Venda registrada · ${qtde} cab · R$ ${receita.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} (modo demo)`);
    setQtde(""); setPesoMedio(""); setComprador("");
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-gold" /> Registrar Venda de Lote</SheetTitle>
          <SheetDescription>Comercialização de animais. Gera automaticamente uma receita na Central Financeira PJ.</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div><Label>Lote</Label>
            <Select value={lote} onValueChange={setLote}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="L-2024-05">L-2024-05 · Angus · 60 cab · pronto</SelectItem>
                <SelectItem value="L-2024-08">L-2024-08 · Nelore · 120 cab</SelectItem>
                <SelectItem value="L-2024-09">L-2024-09 · Nelore × Angus · 95 cab</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Cabeças *</Label><Input type="number" value={qtde} onChange={(e) => setQtde(e.target.value)} /></div>
            <div><Label>Peso médio (kg) *</Label><Input type="number" value={pesoMedio} onChange={(e) => setPesoMedio(e.target.value)} /></div>
          </div>
          <div><Label>Preço da arroba (R$/@)</Label><Input type="number" step="0.01" value={precoArroba} onChange={(e) => setPrecoArroba(e.target.value)} /></div>
          <div><Label>Comprador / Frigorífico</Label><Input value={comprador} onChange={(e) => setComprador(e.target.value)} placeholder="Ex: JBS Sorriso" /></div>
          {arrobas > 0 && (
            <div className="bg-gold/10 border border-gold/30 rounded p-3 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-gold-dark">Prévia (rendimento 54%)</p>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Arrobas estimadas</span>
                <span className="tabular font-semibold text-navy">{arrobas.toFixed(1)} @</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Receita bruta</span>
                <span className="tabular font-bold text-navy">R$ {receita.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          )}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} className="bg-gold hover:bg-gold-dark text-navy">Confirmar venda</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
