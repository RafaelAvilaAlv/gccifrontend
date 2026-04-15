import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/clientes`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  listarInactivos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/inactivos`);
  }

  obtenerPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  crear(cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizar(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  desactivar(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado?activo=false`, {});
  }

  activar(id: number) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado?activo=true`, {});
  }
}