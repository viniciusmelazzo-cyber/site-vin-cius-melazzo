import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ClientLayout from "@/components/ClientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Download, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Doc {
  id: string;
  doc_name: string;
  file_path: string;
  status: string;
  created_at: string;
}

const Documentos = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchDocs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("client_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setDocs(data || []);
  };

  useEffect(() => { fetchDocs(); }, [user]);

  const handleUpload = async () => {
    if (!user || !file || !docName) {
      toast({ title: "Preencha o nome e selecione um arquivo", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("client-documents").upload(path, file);
      if (uploadErr) throw uploadErr;

      const { error: insertErr } = await supabase.from("client_documents").insert({
        user_id: user.id,
        doc_name: docName,
        file_path: path,
      });
      if (insertErr) throw insertErr;

      toast({ title: "Documento enviado com sucesso!" });
      setDocName("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setDialogOpen(false);
      fetchDocs();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (filePath: string, name: string) => {
    const { data, error } = await supabase.storage.from("client-documents").download(filePath);
    if (error || !data) {
      toast({ title: "Erro ao baixar", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (doc: Doc) => {
    await supabase.storage.from("client-documents").remove([doc.file_path]);
    const { error } = await supabase.from("client_documents").delete().eq("id", doc.id).eq("user_id", user!.id);
    if (error) {
      toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Documento excluído" });
      fetchDocs();
    }
  };

  const statusLabel: Record<string, string> = {
    pendente: "Pendente",
    aprovado: "Aprovado",
    rejeitado: "Rejeitado",
  };

  return (
    <ClientLayout role="client">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Documentos</h1>
            <p className="text-muted-foreground font-body text-sm mt-1">Envie e gerencie seus documentos</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-body gap-2 bg-gradient-gold text-primary hover:opacity-90">
                <Upload className="h-4 w-4" /> Enviar Documento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">Enviar Documento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label className="font-body text-sm">Nome do Documento</Label>
                  <Input value={docName} onChange={(e) => setDocName(e.target.value)} className="font-body" placeholder="Ex: Extrato Bancário Jan/2026" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Arquivo</Label>
                  <Input ref={fileRef} type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="font-body" />
                </div>
                <Button onClick={handleUpload} disabled={uploading} className="w-full font-body bg-gradient-gold text-primary hover:opacity-90">
                  {uploading ? "Enviando..." : "Enviar"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body text-xs">Documento</TableHead>
                  <TableHead className="font-body text-xs">Data de Envio</TableHead>
                  <TableHead className="font-body text-xs">Status</TableHead>
                  <TableHead className="font-body text-xs w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-body text-sm">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent" />
                        {doc.doc_name}
                      </div>
                    </TableCell>
                    <TableCell className="font-body text-sm">{new Date(doc.created_at).toLocaleDateString("pt-BR")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={doc.status === "aprovado" ? "default" : doc.status === "rejeitado" ? "destructive" : "secondary"}
                        className="font-body text-[10px] capitalize"
                      >
                        {statusLabel[doc.status] || doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.file_path, doc.doc_name)}>
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc)}>
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {docs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground font-body text-sm">
                      Nenhum documento enviado. Clique em "Enviar Documento" para começar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default Documentos;
