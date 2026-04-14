import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pin, PinOff, Pencil, Trash2, MessageSquare, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CATEGORIES = [
  { value: "reuniao", label: "Reunião", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "observacao", label: "Observação", color: "bg-secondary text-secondary-foreground" },
  { value: "acao", label: "Ação", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  { value: "lembrete", label: "Lembrete", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
];

interface Note {
  id: string;
  content: string;
  category: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface ConsultantNotesProps {
  clientId: string;
}

const ConsultantNotes = ({ clientId }: ConsultantNotesProps) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ content: "", category: "observacao" });
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("consultant_notes")
      .select("*")
      .eq("client_id", clientId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    setNotes((data as Note[]) || []);
  };

  useEffect(() => { fetchNotes(); }, [clientId]);

  const handleSave = async () => {
    if (!user || !form.content.trim()) {
      toast({ title: "Escreva o conteúdo da nota", variant: "destructive" });
      return;
    }
    setLoading(true);

    if (editingId) {
      await supabase.from("consultant_notes").update({
        content: form.content,
        category: form.category,
        updated_at: new Date().toISOString(),
      }).eq("id", editingId);
    } else {
      await supabase.from("consultant_notes").insert({
        client_id: clientId,
        author_id: user.id,
        content: form.content,
        category: form.category,
      });
    }

    setForm({ content: "", category: "observacao" });
    setEditingId(null);
    setDialogOpen(false);
    setLoading(false);
    fetchNotes();
    toast({ title: editingId ? "Nota atualizada" : "Nota criada" });
  };

  const handleEdit = (n: Note) => {
    setForm({ content: n.content, category: n.category });
    setEditingId(n.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("consultant_notes").delete().eq("id", id);
    fetchNotes();
    toast({ title: "Nota removida" });
  };

  const togglePin = async (n: Note) => {
    await supabase.from("consultant_notes").update({ is_pinned: !n.is_pinned }).eq("id", n.id);
    fetchNotes();
  };

  const getCategoryInfo = (cat: string) => CATEGORIES.find((c) => c.value === cat) || CATEGORIES[1];

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent" />
          Notas do Consultor ({notes.length})
        </h3>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setForm({ content: "", category: "observacao" }); setEditingId(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="font-body gap-2">
              <PlusCircle className="h-4 w-4" /> Nova Nota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? "Editar" : "Nova"} Nota</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="font-body">Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-body">Conteúdo</Label>
                <Textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Escreva suas observações sobre o cliente..."
                  rows={5}
                />
              </div>
              <Button onClick={handleSave} disabled={loading} className="w-full font-body">
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card className="border border-dashed border-border">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-body text-muted-foreground">
              Nenhuma nota registrada para este cliente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const catInfo = getCategoryInfo(note.category);
            return (
              <Card key={note.id} className={`border ${note.is_pinned ? "border-accent/40 bg-accent/5" : "border-border"}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.is_pinned && <Pin className="h-3.5 w-3.5 text-accent" />}
                      <Badge className={`text-[10px] font-body ${catInfo.color}`}>
                        {catInfo.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-body flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(note.created_at)}
                      </span>
                      {note.updated_at !== note.created_at && (
                        <span className="text-[10px] text-muted-foreground/60 font-body italic">
                          (editada)
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => togglePin(note)} title={note.is_pinned ? "Desafixar" : "Fixar"}>
                        {note.is_pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(note)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-finance-negative" onClick={() => handleDelete(note.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-body text-foreground whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsultantNotes;
