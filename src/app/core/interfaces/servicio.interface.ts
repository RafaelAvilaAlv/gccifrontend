export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precioBase: number;
  duracionMinutos: number;
  activo?: boolean;
  fechaCreacion?: string;
}