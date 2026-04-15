import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cita } from '../interfaces/cita.interface';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/citas`;

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${id}`);
  }

  crear(cita: any): Observable<Cita> {
    return this.http.post<Cita>(this.apiUrl, cita);
  }

  actualizar(id: number, cita: any): Observable<Cita> {
    return this.http.put<Cita>(`${this.apiUrl}/${id}`, cita);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.patch(`${this.apiUrl}/${id}/estado`, { estado });
  }
}