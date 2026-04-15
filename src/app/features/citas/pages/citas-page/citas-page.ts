import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cita } from '../../../../core/interfaces/cita.interface';
import { CitasService } from '../../../../core/services/citas.service';
import { CitaEstadoModal } from '../../components/cita-estado-modal/cita-estado-modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-citas-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CitaEstadoModal],
  templateUrl: './citas-page.html',
  styleUrl: './citas-page.scss'
})
export class CitasPage implements OnInit {
  private citasService = inject(CitasService);
  private cdr = inject(ChangeDetectorRef);

  citas: Cita[] = [];
  loading = true;
  error = '';

  mostrarModalEstado = false;
  citaSeleccionada: Cita | null = null;
  guardandoEstado = false;

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading = true;
    this.error = '';

    this.citasService.listar().subscribe({
      next: (data) => {
        this.citas = data;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando citas', err);
        this.error = 'No se pudieron cargar las citas.';
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las citas.'
        });

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-700';
      case 'CONFIRMADA':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-700';
      case 'CANCELADA':
        return 'bg-red-100 text-red-700';
      case 'NO_ASISTIO':
        return 'bg-slate-200 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }

  puedeGestionarEstado(cita: Cita): boolean {
    return ['PENDIENTE', 'CONFIRMADA'].includes(cita.estado);
  }

  puedeEditar(cita: Cita): boolean {
    return ['PENDIENTE', 'CONFIRMADA'].includes(cita.estado);
  }

  abrirModalEstado(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.mostrarModalEstado = true;
  }

  cerrarModalEstado(): void {
    this.mostrarModalEstado = false;
    this.citaSeleccionada = null;
    this.guardandoEstado = false;
  }

  guardarNuevoEstado(estado: string): void {
    if (!this.citaSeleccionada) return;

    const cita = this.citaSeleccionada;

    Swal.fire({
      title: '¿Cambiar estado de la cita?',
      text: `La cita #${cita.id} pasará a estado "${estado}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.guardandoEstado = true;
      this.error = '';

      this.citasService.cambiarEstado(cita.id, estado).subscribe({
        next: () => {
          this.cerrarModalEstado();

          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: 'El estado de la cita fue actualizado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarCitas();
        },
        error: (err: any) => {
          console.error('Error cambiando estado de cita', err);
          this.guardandoEstado = false;
          this.error = 'No se pudo cambiar el estado de la cita.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo cambiar el estado de la cita.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }
}