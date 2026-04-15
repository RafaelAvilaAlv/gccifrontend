import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pago } from '../interfaces/pago.interface';

@Injectable({
  providedIn: 'root'
})
export class PagosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pagos`;

  listar(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  obtenerPorCita(citaId: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/cita/${citaId}`);
  }

  crear(body: {
    citaId: number;
    monto: number;
    metodoPago: string;
    referencia?: string;
    observacion?: string;
  }): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, body);
  }
}