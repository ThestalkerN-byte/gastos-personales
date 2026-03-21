"use client";

import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteMetaAhorroAction } from "@/app/_actions/meta-ahorro/actions";
import { MetaAhorro } from "@/core/domain/entities/MetaAhorro";
import { toast } from "sonner";
import { useState } from "react";

interface DeleteMetaAhorroFormProps {
  meta: MetaAhorro;
  onSuccess?: () => void;
}

export function DeleteMetaAhorroForm({ meta, onSuccess }: DeleteMetaAhorroFormProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteMetaAhorroAction(meta);
    if (result?.success) {
      toast.success("Meta eliminada");
      setOpen(false);
      onSuccess?.();
    } else {
      toast.error(result?.message ?? "Error al eliminar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Eliminar esta meta de ahorro?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Se eliminará "{meta.nombre}" y todo su historial de contribuciones. Esta acción no se puede deshacer.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
