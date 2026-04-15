import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Phone, Mail, MapPin, Building2 } from "lucide-react";
import type { ClientePj } from "@/lib/pj-constants";
import { getStatusConfig, formatDate } from "@/lib/pj-constants";

interface Props {
  cliente: ClientePj;
  onView: (c: ClientePj) => void;
  onEdit: (c: ClientePj) => void;
}

const PjClienteCard = ({ cliente, onView, onEdit }: Props) => {
  const statusCfg = getStatusConfig(cliente.status);

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-foreground text-base">{cliente.nome}</h3>
            {cliente.razao_social && (
              <p className="text-xs text-muted-foreground font-body">{cliente.razao_social}</p>
            )}
          </div>
          <Badge className={`${statusCfg.bg} ${statusCfg.color} border-0 text-[10px] font-body`}>
            {statusCfg.label}
          </Badge>
        </div>

        <div className="space-y-2 text-sm font-body text-muted-foreground">
          {cliente.cnpj && (
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5" />
              <span>{cliente.cnpj}</span>
            </div>
          )}
          {cliente.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5" />
              <span>{cliente.telefone}</span>
            </div>
          )}
          {cliente.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate">{cliente.email}</span>
            </div>
          )}
          {(cliente.cidade || cliente.estado) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              <span>{[cliente.cidade, cliente.estado].filter(Boolean).join(" - ")}</span>
            </div>
          )}
        </div>

        {cliente.segmento && (
          <Badge variant="outline" className="text-[10px] font-body">{cliente.segmento}</Badge>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs font-body gap-1.5" onClick={() => onView(cliente)}>
            <Eye className="h-3.5 w-3.5" /> Detalhes
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs font-body gap-1.5" onClick={() => onEdit(cliente)}>
            <Edit className="h-3.5 w-3.5" /> Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PjClienteCard;
