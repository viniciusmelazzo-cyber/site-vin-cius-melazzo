import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import EntryConfirmCard, { type ParsedEntry } from "./EntryConfirmCard";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

// Compress image to keep payload small (max 1280px on the longest side)
async function fileToCompressedBase64(file: File, maxSize = 1280, quality = 0.78): Promise<{ base64: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result as string; };
    reader.onerror = () => reject(new Error("Falha ao ler imagem"));
    img.onload = () => {
      let { width, height } = img;
      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width); width = maxSize;
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height); height = maxSize;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas não disponível"));
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64: dataUrl, mime: "image/jpeg" });
    };
    img.onerror = () => reject(new Error("Imagem inválida"));
    reader.readAsDataURL(file);
  });
}

const ReceiptCaptureDialog = ({ open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedEntry | null>(null);

  const reset = () => { setPreviewUrl(null); setParsed(null); setLoading(false); };

  const handleFile = async (file: File) => {
    if (!user) return;
    setLoading(true);
    try {
      const { base64, mime } = await fileToCompressedBase64(file);
      setPreviewUrl(base64);
      const { data, error } = await supabase.functions.invoke("parse-expense", {
        body: { image_base64: base64, image_mime: mime },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setParsed(data as ParsedEntry);
    } catch (e: any) {
      toast({ title: "Não consegui ler o recibo", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (entry: ParsedEntry) => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("financial_entries").insert({
      user_id: user.id,
      type: entry.type,
      category: entry.category,
      description: entry.description,
      amount: entry.amount,
      date: entry.date,
      source: "photo",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Lançamento criado!", description: `${entry.description} · ${entry.category}` });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Camera className="h-5 w-5 text-accent" />
            Foto do recibo
          </DialogTitle>
          <DialogDescription className="font-body text-sm">
            Tire uma foto ou envie a imagem do cupom — a IA extrai valor e categoria.
          </DialogDescription>
        </DialogHeader>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {previewUrl && (
          <div className="relative rounded-lg overflow-hidden border border-border bg-secondary/30">
            <img src={previewUrl} alt="Recibo" className="w-full max-h-64 object-contain" />
            {loading && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" />
                  <p className="text-xs font-body text-muted-foreground mt-2">Lendo o recibo…</p>
                </div>
              </div>
            )}
            {!loading && (
              <button
                onClick={reset}
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center"
                aria-label="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {!previewUrl && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              onClick={() => cameraRef.current?.click()}
              className="font-body bg-gradient-gold text-primary hover:opacity-90 h-20 flex-col gap-1"
              disabled={loading}
            >
              <Camera className="h-5 w-5" />
              Tirar foto
            </Button>
            <Button
              variant="outline"
              onClick={() => fileRef.current?.click()}
              className="font-body h-20 flex-col gap-1"
              disabled={loading}
            >
              <Upload className="h-5 w-5" />
              Da galeria
            </Button>
          </div>
        )}

        {parsed && (
          <EntryConfirmCard
            initial={parsed}
            onConfirm={handleConfirm}
            onCancel={reset}
            loading={loading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptCaptureDialog;
