export interface Reembolso {
  readonly id: string;
  gasto_id: string;
  usuario_id: string;
  monto: number;
  de_quien: string | null;
  descripcion: string | null;
  readonly createdAt: Date;
}
