export interface MetaAhorro {
  readonly id: string;
  usuario_id: string;
  nombre: string;
  monto_objetivo: number;
  monto_actual: number;
  descripcion: string | null;
  readonly createdAt: Date;
}
