export interface Gasto {
  readonly id: string;
  motivo: string;
  monto: number;
  cantidad_cuotas: number;
  categoria_id: string;
  usuario_id: string;
  tarjeta_id: string;
  readonly createdAt: Date;
}
