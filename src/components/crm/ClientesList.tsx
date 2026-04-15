import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Eye, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate, type CrmCliente } from "@/lib/crm-constants";

interface ClientesListProps {
  clientes: CrmCliente[];
  onNew: () => void;
  onView: (c: CrmCliente) => void;
  onDelete: (id: string) => void;
}

const ClientesList = ({ clientes, onNew, onView, onDelete }: ClientesListProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.cpf?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.telefones?.includes(q) ||
        c.produto?.toLowerCase().includes(q)
    );
  }, [clientes, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onNew} className="bg-gradient-gold text-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" /> Novo Cliente
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Produto</TableHead>
              <TableHead className="hidden lg:table-cell">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Atualizado</TableHead>
              <TableHead className="w-24">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onView(c)}>
                  <TableCell className="font-medium">{c.nome}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{c.produto || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatCurrency(c.valor)}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{formatDate(c.updated_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onView(c); }}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientesList;
