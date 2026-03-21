export interface MovimientoAhorro {
  readonly id: string;
  meta_ahorro_id: string;
  usuario_id: string;
  monto: number; // positivo = depósito, negativo = retiro
  descripcion: string | null;
  readonly createdAt: Date;
}
