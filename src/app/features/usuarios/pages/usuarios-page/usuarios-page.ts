import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../../../core/interfaces/usuario.interface';
import { UsuariosService } from '../../../../core/services/usuarios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.scss',
})
export class UsuariosPage implements OnInit {
  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  usuarios: Usuario[] = [];
  loading = true;
  error = '';
  changingId: number | null = null;

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.error = '';

    this.usuariosService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando usuarios', err);
        this.error = 'No se pudieron cargar los usuarios.';
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los usuarios.'
        });

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  get usuariosActivos(): Usuario[] {
    return this.usuarios.filter(u => u.activo);
  }

  get usuariosInactivos(): Usuario[] {
    return this.usuarios.filter(u => !u.activo);
  }

  nuevoUsuario(): void {
    this.router.navigate(['/usuarios/nuevo']);
  }

  editar(usuario: Usuario): void {
    this.router.navigate(['/usuarios/editar', usuario.id]);
  }

  // 🔴 DESACTIVAR
  desactivar(usuario: Usuario): void {
    Swal.fire({
      title: '¿Desactivar usuario?',
      text: `${usuario.nombre} ${usuario.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.changingId = usuario.id;
      this.error = '';

      this.usuariosService.cambiarEstado(usuario.id, false).subscribe({
        next: () => {
          this.changingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Desactivado',
            text: 'El usuario fue desactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarUsuarios();
        },
        error: (err: any) => {
          console.error('Error desactivando usuario', err);
          this.error = 'No se pudo desactivar el usuario.';
          this.changingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo desactivar el usuario.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }

  // 🟢 REACTIVAR
  reactivar(usuario: Usuario): void {
    Swal.fire({
      title: '¿Reactivar usuario?',
      text: `${usuario.nombre} ${usuario.apellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.changingId = usuario.id;
      this.error = '';

      this.usuariosService.cambiarEstado(usuario.id, true).subscribe({
        next: () => {
          this.changingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Reactivado',
            text: 'El usuario fue reactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarUsuarios();
        },
        error: (err: any) => {
          console.error('Error reactivando usuario', err);
          this.error = 'No se pudo reactivar el usuario.';
          this.changingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reactivar el usuario.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }
}