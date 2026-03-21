"use client";

import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { deleteGastoAction } from "@/app/_actions/gasto/actions";
import { Gasto } from "@/core/domain/entities/Gasto";
import { toast } from "sonner";
import { useState } from "react";
interface DeleteGastoFormModalProps {
  gasto: Gasto;
  onSuccess?: () => void;
}
export function DeleteGastoForm({ gasto, onSuccess }: DeleteGastoFormModalProps) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-primary">
          <Trash />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Está seguro que desea eliminar este gasto?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button
            variant="destructive"
            onClick={async (e) => {
              e.preventDefault();
              const result = await deleteGastoAction(gasto);
              console.log("Resultado de la eliminación:", result);
              if (result) {
                toast.success("Gasto eliminado correctamente");
                setOpen(false);
                onSuccess?.();
              } else {
                toast.error("Error al eliminar el gasto");
              }
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
