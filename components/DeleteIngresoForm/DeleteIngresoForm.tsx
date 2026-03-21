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
import { toast } from "sonner";
import { useState } from "react";
import { deleteIngresoAction } from "@/app/_actions/ingreso/actions";
import { Ingreso } from "@/core/domain/entities/Ingreso";
interface DeleteIngresoFormModalProps {
  ingreso: Ingreso;
  onSuccess?: () => void;
}
export function DeleteIngresoForm({ ingreso, onSuccess }: DeleteIngresoFormModalProps) {
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
          <DialogTitle>¿Está seguro que desea eliminar este ingreso?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button
            variant="destructive"
            onClick={async (e) => {
              e.preventDefault();
              const result = await deleteIngresoAction(ingreso);
              console.log("Resultado de la eliminación:", result);
              if (result) {
                toast.success("Ingreso eliminado correctamente");
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
