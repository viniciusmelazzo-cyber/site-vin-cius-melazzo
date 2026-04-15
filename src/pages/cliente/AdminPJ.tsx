import { useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { usePjClientes } from "@/hooks/usePjClientes";
import PjClienteCard from "@/components/pj/PjClienteCard";
import PjClienteForm from "@/components/pj/PjClienteForm";
import PjClienteDetail from "@/components/pj/PjClienteDetail";
import type { ClientePj } from "@/lib/pj-constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/lib/pj-constants";
import { Eye, Edit, Trash2 } from "lucide-react";

const AdminPJ = () => {
  const { clientes, loading, createCliente, updateCliente, deleteCliente } = usePjClientes();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<ClientePj | null>(null);
  const [detailCliente, setDetailCliente] = useState<ClientePj | null>(null);

  const filtered = clientes.filter(c =>
    (c.nome || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.cnpj || "").includes(search) ||
    (c.segmento || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleNew = () => { setEditCliente(null); setFormOpen(true); };
  const handleView = (c: ClientePj) => setDetailCliente(c);
  const handleEdit = (c: ClientePj) => { setEditCliente(c); setFormOpen(true); };
  const handleEditFromDetail = () => {
    if (detailCliente) { setEditCliente(detailCliente); setDetailCliente(null); setFormOpen(true); }
  };

  const handleSave = async (data: Partial<ClientePj>) => {
    if (editCliente) { await updateCliente(editCliente.id, data); }
    else { await createCliente(data); }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente PJ?")) await deleteCliente(id);
  };

  if (loading) {
    return (
      <ClientLayout role="admin">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Clientes PJ</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">
              {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} cadastrado{clientes.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={handleNew} className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
            <Plus className="h-4 w-4" /> Novo Cliente PJ
          </Button>
        </div>

        {/* Search + view toggle */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, CNPJ ou segmento..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 font-body text-sm" />
          </div>
          <div className="flex gap-1 border border-border rounded-lg p-0.5">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(c => (
              <PjClienteCard key={c.id} cliente={c} onView={handleView} onEdit={handleEdit} />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground font-body">
                Nenhum cliente encontrado
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Nome</TableHead>
                  <TableHead className="font-body text-xs">CNPJ</TableHead>
                  <TableHead className="font-body text-xs">Segmento</TableHead>
                  <TableHead className="font-body text-xs">Cidade</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => {
                  const statusCfg = getStatusConfig(c.status);
                  return (
                    <TableRow key={c.id} className="cursor-pointer hover:bg-secondary/50">
                      <TableCell className="font-body text-sm font-medium">{c.nome}</TableCell>
                      <TableCell className="font-body text-sm">{c.cnpj || "—"}</TableCell>
                      <TableCell className="font-body text-sm">{c.segmento || "—"}</TableCell>
                      <TableCell className="font-body text-sm">{c.cidade || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`${statusCfg.bg} ${statusCfg.color} border-0 text-[10px] font-body`}>{statusCfg.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleView(c)}><Eye className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(c)}><Edit className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(c.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground font-body text-sm">Nenhum cliente encontrado</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <PjClienteForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} initialData={editCliente} />
      <PjClienteDetail open={!!detailCliente} onClose={() => setDetailCliente(null)} cliente={detailCliente} onEdit={handleEditFromDetail} />
    </ClientLayout>
  );
};

export default AdminPJ;
