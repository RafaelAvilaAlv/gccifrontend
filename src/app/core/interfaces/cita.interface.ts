export interface Cita {
  id: number;
  clienteId: number;
  nombreCliente: string;
  servicioId: number;
  nombreServicio: string;
  usuarioId: number;
  nombreUsuario: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  precioFinal: number;
  observaciones?: string;
  fechaCreacion?: string;
}