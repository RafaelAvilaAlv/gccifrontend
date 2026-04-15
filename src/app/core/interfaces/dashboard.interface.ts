export interface DashboardResumen {
  citasHoy: number;
  clientesActivos: number;
  usuariosActivos: number;
  serviciosActivos: number;
  citasPendientes: number;
  citasConfirmadas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  citasNoAsistio: number;
  ingresosHoy: number;
  ingresosMes: number;
}

export interface DashboardIngresos {
  ingresosHoy: number;
  ingresosMes: number;
}

export interface DashboardProximaCita {
  citaId: number;
  nombreCliente: string;
  nombreServicio: string;
  nombreUsuario: string;
  fecha: string;
  horaInicio: string;
  estado: string;
}

export interface DashboardCitasEstado {
  estado: string;
  total: number;
}

export interface DashboardIngresoDiario {
  fecha: string;
  total: number;
}

export interface DashboardServicioTop {
  nombreServicio: string;
  total: number;
}