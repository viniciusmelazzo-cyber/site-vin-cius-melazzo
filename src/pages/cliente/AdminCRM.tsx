import { useState } from "react";
import ClientLayout from "@/components/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Kanban, FileCheck, HeartHandshake, CheckCircle } from "lucide-react";
import { useCrmClientes } from "@/hooks/useCrmClientes";
import CrmDashboard from "@/components/crm/CrmDashboard";
import ClientesList from "@/components/crm/ClientesList";
import KanbanBoard from "@/components/crm/KanbanBoard";
import ContratosAssinados from "@/components/crm/ContratosAssinados";
import ConsultoriaFinanceira from "@/components/crm/ConsultoriaFinanceira";
import Finalizados from "@/components/crm/Finalizados";
import ClienteForm from "@/components/crm/ClienteForm";
import ClienteDetail from "@/components/crm/ClienteDetail";
import type { CrmCliente } from "@/lib/crm-constants";

const AdminCRM = () => {
  const { clientes, loading, createCliente, updateCliente, updateStatus, deleteCliente } = useCrmClientes();
  const [formOpen, setFormOpen] = useState(false);
  const [editCliente, setEditCliente] = useState<CrmCliente | null>(null);
  const [detailCliente, setDetailCliente] = useState<CrmCliente | null>(null);

  const handleNew = () => { setEditCliente(null); setFormOpen(true); };
  const handleView = (c: CrmCliente) => setDetailCliente(c);
  const handleEdit = () => {
    if (detailCliente) {
      setEditCliente(detailCliente);
      setDetailCliente(null);
      setFormOpen(true);
    }
  };

  const handleSave = async (data: Partial<CrmCliente>) => {
    if (editCliente) {
      await updateCliente(editCliente.id, data);
    } else {
      await createCliente(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await deleteCliente(id);
    }
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
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">CRM Crédito</h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            Gerencie seu pipeline de crédito e consultoria financeira
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="flex flex-wrap gap-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="clientes" className="gap-2">
              <Users className="h-4 w-4" /> Clientes
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="gap-2">
              <Kanban className="h-4 w-4" /> Pipeline
            </TabsTrigger>
            <TabsTrigger value="contratos" className="gap-2">
              <FileCheck className="h-4 w-4" /> Contratos
            </TabsTrigger>
            <TabsTrigger value="consultoria" className="gap-2">
              <HeartHandshake className="h-4 w-4" /> Consultoria
            </TabsTrigger>
            <TabsTrigger value="finalizados" className="gap-2">
              <CheckCircle className="h-4 w-4" /> Finalizados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <CrmDashboard clientes={clientes} />
          </TabsContent>
          <TabsContent value="clientes" className="mt-6">
            <ClientesList clientes={clientes} onNew={handleNew} onView={handleView} onDelete={handleDelete} />
          </TabsContent>
          <TabsContent value="pipeline" className="mt-6">
            <KanbanBoard clientes={clientes} onStatusChange={updateStatus} onView={handleView} />
          </TabsContent>
          <TabsContent value="contratos" className="mt-6">
            <ContratosAssinados clientes={clientes} onView={handleView} />
          </TabsContent>
          <TabsContent value="consultoria" className="mt-6">
            <ConsultoriaFinanceira clientes={clientes} onStatusChange={updateStatus} onView={handleView} />
          </TabsContent>
          <TabsContent value="finalizados" className="mt-6">
            <Finalizados clientes={clientes} onView={handleView} />
          </TabsContent>
        </Tabs>
      </div>

      <ClienteForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialData={editCliente}
      />

      <ClienteDetail
        open={!!detailCliente}
        onClose={() => setDetailCliente(null)}
        cliente={detailCliente}
        onEdit={handleEdit}
      />
    </ClientLayout>
  );
};

export default AdminCRM;
