export interface Gasto {
  id: string;
  motivo: string;
  monto: number;
  cantidad_cuotas: number;
  categoriaId: string;
  usuarioId: string;
  tarjetaId: string;
  createdAt: Date;
}
