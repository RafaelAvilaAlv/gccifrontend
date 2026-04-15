export interface Pago {
  id: number;
  citaId: number;
  nombreCliente?: string;
  nombreServicio?: string;
  fechaCita?: string;
  monto: number;
  metodoPago: string;
  estado: string;
  fechaPago: string;
  referencia?: string;
  observacion?: string;
}