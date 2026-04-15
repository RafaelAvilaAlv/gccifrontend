import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardCitasEstado,
  DashboardIngresoDiario,
  DashboardIngresos,
  DashboardProximaCita,
  DashboardResumen,
  DashboardServicioTop
} from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/dashboard`;

  obtenerResumen(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.apiUrl}/resumen`);
  }

  obtenerIngresos(): Observable<DashboardIngresos> {
    return this.http.get<DashboardIngresos>(`${this.apiUrl}/ingresos`);
  }

  obtenerProximasCitas(): Observable<DashboardProximaCita[]> {
    return this.http.get<DashboardProximaCita[]>(`${this.apiUrl}/proximas-citas`);
  }

  obtenerCitasPorEstado(): Observable<DashboardCitasEstado[]> {
    return this.http.get<DashboardCitasEstado[]>(`${this.apiUrl}/citas-estado`);
  }

  obtenerIngresosUltimos7Dias(): Observable<DashboardIngresoDiario[]> {
    return this.http.get<DashboardIngresoDiario[]>(`${this.apiUrl}/ingresos-ultimos-7-dias`);
  }

  obtenerServiciosTop(): Observable<DashboardServicioTop[]> {
    return this.http.get<DashboardServicioTop[]>(`${this.apiUrl}/servicios-top`);
  }
}