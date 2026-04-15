export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  activo: boolean;
  fechaCreacion?: string;
}

export interface UsuarioRequest {
  nombre: string;
  apellido: string;
  email: string;
  password?: string;
  rol: string;
  activo: boolean;
}