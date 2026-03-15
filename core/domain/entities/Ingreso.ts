export interface Ingreso {
  readonly id: string;
  monto: number;
  categoria_id: string;
  descripcion: string | null;
  usuario_id: string;
  readonly createdAt: Date;
}
