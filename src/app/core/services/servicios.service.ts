import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Servicio } from '../interfaces/servicio.interface';

@Injectable({
    providedIn: 'root'
})
export class ServiciosService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/api/servicios`;

    listar(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.apiUrl);
    }

    obtenerPorId(id: number): Observable<Servicio> {
        return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
    }

    crear(servicio: Partial<Servicio>): Observable<Servicio> {
        return this.http.post<Servicio>(this.apiUrl, servicio);
    }

    actualizar(id: number, servicio: Partial<Servicio>): Observable<Servicio> {
        return this.http.put<Servicio>(`${this.apiUrl}/${id}`, servicio);
    }


    listarInactivos(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(`${this.apiUrl}/inactivos`);
    }

    desactivar(id: number) {
        return this.http.patch<void>(`${this.apiUrl}/${id}/estado?activo=false`, {});
    }

    activar(id: number) {
        return this.http.patch<void>(`${this.apiUrl}/${id}/estado?activo=true`, {});
    }

    
}