import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../../../core/interfaces/servicio.interface';
import { ServiciosService } from '../../../../core/services/servicios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicios-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './servicios-page.html',
  styleUrl: './servicios-page.scss'
})
export class ServiciosPage implements OnInit {
  private serviciosService = inject(ServiciosService);
  private cdr = inject(ChangeDetectorRef);

  deletingId: number | null = null;

  servicios: Servicio[] = [];
  serviciosActivos: Servicio[] = [];
  serviciosInactivos: Servicio[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    this.error = '';

    this.serviciosService.listar().subscribe({
      next: (data) => {
        console.log('Servicios activos cargados', data);

        this.servicios = data;
        this.serviciosActivos = data;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando servicios', err);
        this.error = 'No se pudieron cargar los servicios.';
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });

    this.serviciosService.listarInactivos().subscribe({
      next: (data) => {
        console.log('Servicios inactivos cargados', data);

        this.serviciosInactivos = data;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando servicios inactivos', err);
      }
    });
  }

  desactivarServicio(servicio: Servicio): void {
    Swal.fire({
      title: '¿Desactivar servicio?',
      text: `Se desactivará el servicio "${servicio.nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.deletingId = servicio.id;

      this.serviciosService.desactivar(servicio.id).subscribe({
        next: () => {
          this.deletingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Desactivado',
            text: 'El servicio fue desactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarServicios();
        },
        error: (err) => {
          console.error('Error desactivando servicio', err);
          this.deletingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo desactivar el servicio.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }

  activarServicio(servicio: Servicio): void {
    Swal.fire({
      title: '¿Reactivar servicio?',
      text: `Se reactivará el servicio "${servicio.nombre}"`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.deletingId = servicio.id;

      this.serviciosService.activar(servicio.id).subscribe({
        next: () => {
          this.deletingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Reactivado',
            text: 'El servicio fue reactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarServicios();
        },
        error: (err) => {
          console.error('Error reactivando servicio', err);
          this.deletingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reactivar el servicio.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }
}