import { useEffect, useMemo, useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MessageCircle,
  Search,
  CheckCheck,
  Inbox,
  ExternalLink,
} from "lucide-react";

type Lead = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  propriedade: string | null;
  segmento: string | null;
  origem: string;
  mensagem: string | null;
  lido: boolean;
  page_path: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

const ORIGEM_LABELS: Record<string, string> = {
  "manual-rural": "Manual Rural",
  "reuniao-pf": "Reunião · PF",
  "reuniao-pj": "Reunião · PJ",
  "contato-geral": "Contato Geral",
};

const ORIGEM_BADGE_CLASSES: Record<string, string> = {
  "manual-rural": "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  "reuniao-pf": "bg-accent/20 text-accent-foreground border-accent/40",
  "reuniao-pj": "bg-navy/15 text-navy border-navy/30",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterOrigem, setFilterOrigem] = useState<string>("todos");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [selected, setSelected] = useState<Lead | null>(null);

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    setLeads((data as Lead[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const marcarComoLido = async (lead: Lead, lido: boolean) => {
    const { error } = await supabase
      .from("leads")
      .update({ lido })
      .eq("id", lead.id);
    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, lido } : l))
    );
    if (selected?.id === lead.id) setSelected({ ...selected, lido });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (filterOrigem !== "todos" && l.origem !== filterOrigem) return false;
      if (filterStatus === "novos" && l.lido) return false;
      if (filterStatus === "lidos" && !l.lido) return false;
      if (!q) return true;
      return (
        l.nome.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.telefone.toLowerCase().includes(q) ||
        (l.mensagem || "").toLowerCase().includes(q)
      );
    });
  }, [leads, search, filterOrigem, filterStatus]);

  const novosCount = leads.filter((l) => !l.lido).length;
  const reuniaoPfCount = leads.filter((l) => l.origem === "reuniao-pf").length;
  const manualRuralCount = leads.filter(
    (l) => l.origem === "manual-rural"
  ).length;

  return (
    <ClientLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              Leads recebidos
            </h1>
            <p className="mt-1 text-sm font-body text-muted-foreground">
              Captação dos formulários do site (Pessoa Física, Manual Rural,
              etc).
            </p>
          </div>
          <Button
            variant="outline"
            onClick={loadLeads}
            className="font-body"
            disabled={loading}
          >
            Atualizar
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: String(leads.length), icon: Inbox },
            { label: "Não lidos", value: String(novosCount), icon: Mail },
            {
              label: "Reuniões PF",
              value: String(reuniaoPfCount),
              icon: MessageCircle,
            },
            {
              label: "Manual Rural",
              value: String(manualRuralCount),
              icon: ExternalLink,
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="rounded-xl bg-secondary p-3">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs font-body text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="font-display text-base">
              Inbox de leads
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, e-mail, telefone ou mensagem…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 font-body"
                />
              </div>
              <Select value={filterOrigem} onValueChange={setFilterOrigem}>
                <SelectTrigger className="w-full md:w-56 font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as origens</SelectItem>
                  <SelectItem value="reuniao-pf">Reunião · PF</SelectItem>
                  <SelectItem value="manual-rural">Manual Rural</SelectItem>
                  <SelectItem value="reuniao-pj">Reunião · PJ</SelectItem>
                  <SelectItem value="contato-geral">Contato Geral</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-44 font-body">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="novos">Não lidos</SelectItem>
                  <SelectItem value="lidos">Lidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="flex h-48 items-center justify-center">
                <div className="h-7 w-7 animate-spin rounded-full border-b-2 border-accent" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]"></TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Recebido</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className={!lead.lido ? "bg-accent/5" : ""}
                    >
                      <TableCell>
                        <span
                          className={`inline-block w-2 h-2 rounded-full ${
                            lead.lido ? "bg-muted" : "bg-accent"
                          }`}
                          aria-label={lead.lido ? "Lido" : "Não lido"}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`font-body ${
                            ORIGEM_BADGE_CLASSES[lead.origem] || ""
                          }`}
                        >
                          {ORIGEM_LABELS[lead.origem] || lead.origem}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p
                            className={`font-body text-sm ${
                              !lead.lido
                                ? "font-semibold text-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {lead.nome}
                          </p>
                          <p className="text-xs font-body text-muted-foreground">
                            {lead.email} · {lead.telefone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[280px]">
                        <p className="text-xs font-body text-muted-foreground line-clamp-2">
                          {lead.mensagem || (
                            <span className="italic opacity-60">—</span>
                          )}
                        </p>
                      </TableCell>
                      <TableCell className="text-xs font-body text-muted-foreground whitespace-nowrap">
                        {formatDateTime(lead.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`https://wa.me/55${onlyDigits(lead.telefone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </a>
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                            title="E-mail"
                          >
                            <Mail className="h-4 w-4" />
                          </a>
                          <a
                            href={`tel:${onlyDigits(lead.telefone)}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-navy hover:bg-navy/10 transition-colors"
                            title="Ligar"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="ml-2 h-8 font-body text-xs"
                                onClick={() => {
                                  setSelected(lead);
                                  if (!lead.lido) marcarComoLido(lead, true);
                                }}
                              >
                                Detalhes
                              </Button>
                            </DialogTrigger>
                            {selected?.id === lead.id && (
                              <DialogContent className="max-w-lg">
                                <DialogHeader>
                                  <DialogTitle className="font-display">
                                    Lead — {selected.nome}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 font-body text-sm">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge
                                      variant="outline"
                                      className={
                                        ORIGEM_BADGE_CLASSES[selected.origem] ||
                                        ""
                                      }
                                    >
                                      {ORIGEM_LABELS[selected.origem] ||
                                        selected.origem}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDateTime(selected.created_at)}
                                    </span>
                                  </div>

                                  <dl className="grid grid-cols-3 gap-2 text-sm">
                                    <dt className="text-muted-foreground">
                                      E-mail
                                    </dt>
                                    <dd className="col-span-2">
                                      <a
                                        href={`mailto:${selected.email}`}
                                        className="text-accent hover:underline"
                                      >
                                        {selected.email}
                                      </a>
                                    </dd>
                                    <dt className="text-muted-foreground">
                                      Telefone
                                    </dt>
                                    <dd className="col-span-2">
                                      <a
                                        href={`https://wa.me/55${onlyDigits(
                                          selected.telefone
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline"
                                      >
                                        {selected.telefone}
                                      </a>
                                    </dd>
                                    {selected.propriedade && (
                                      <>
                                        <dt className="text-muted-foreground">
                                          Empresa
                                        </dt>
                                        <dd className="col-span-2">
                                          {selected.propriedade}
                                        </dd>
                                      </>
                                    )}
                                    {selected.segmento && (
                                      <>
                                        <dt className="text-muted-foreground">
                                          Segmento
                                        </dt>
                                        <dd className="col-span-2">
                                          {selected.segmento}
                                        </dd>
                                      </>
                                    )}
                                    {selected.page_path && (
                                      <>
                                        <dt className="text-muted-foreground">
                                          Página
                                        </dt>
                                        <dd className="col-span-2 text-xs text-muted-foreground">
                                          {selected.page_path}
                                        </dd>
                                      </>
                                    )}
                                    {(selected.utm_source ||
                                      selected.utm_campaign) && (
                                      <>
                                        <dt className="text-muted-foreground">
                                          UTM
                                        </dt>
                                        <dd className="col-span-2 text-xs text-muted-foreground">
                                          {selected.utm_source || "—"} ·{" "}
                                          {selected.utm_medium || "—"} ·{" "}
                                          {selected.utm_campaign || "—"}
                                        </dd>
                                      </>
                                    )}
                                  </dl>

                                  {selected.mensagem && (
                                    <div>
                                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                                        Mensagem
                                      </p>
                                      <p className="rounded-md border border-border bg-secondary/40 p-3 whitespace-pre-wrap leading-relaxed">
                                        {selected.mensagem}
                                      </p>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between gap-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        marcarComoLido(selected, !selected.lido)
                                      }
                                      className="font-body gap-2"
                                    >
                                      <CheckCheck className="h-4 w-4" />
                                      {selected.lido
                                        ? "Marcar como não lido"
                                        : "Marcar como lido"}
                                    </Button>
                                    <a
                                      href={`https://wa.me/55${onlyDigits(
                                        selected.telefone
                                      )}?text=${encodeURIComponent(
                                        `Olá ${selected.nome}, aqui é da Melazzo Consultoria. Recebemos seu contato pelo site.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md text-xs font-semibold hover:bg-emerald-700 transition-colors"
                                    >
                                      <MessageCircle className="h-4 w-4" />
                                      Responder no WhatsApp
                                    </a>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-sm font-body text-muted-foreground"
                      >
                        Nenhum lead encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default AdminLeads;
