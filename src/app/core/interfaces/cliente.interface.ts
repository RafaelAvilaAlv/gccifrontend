export interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  email: string;
  direccion?: string;
  observaciones?: string;
  activo?: boolean;
  fechaRegistro?: string;
}