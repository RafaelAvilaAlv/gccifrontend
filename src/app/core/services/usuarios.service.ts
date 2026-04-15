import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, UsuarioRequest } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(payload: UsuarioRequest): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, payload);
  }

  actualizar(id: number, payload: UsuarioRequest): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, payload);
  }

  cambiarEstado(id: number, activo: boolean) {
    return this.http.patch<void>(`${this.apiUrl}/${id}/estado?activo=${activo}`, {});
  }

  obtenerMiPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }

  cambiarPassword(body: {
    passwordActual: string;
    nuevaPassword: string;
  }) {
    return this.http.put<void>(`${this.apiUrl}/cambiar-password`, body);
  }
}