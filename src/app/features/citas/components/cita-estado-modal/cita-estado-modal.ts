import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cita } from '../../../../core/interfaces/cita.interface';

@Component({
  selector: 'app-cita-estado-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita-estado-modal.html'
})
export class CitaEstadoModal {
  @Input() cita!: Cita | null;
  @Input() loading = false;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<string>();

  estadoSeleccionado = '';

  ngOnChanges(): void {
    this.estadoSeleccionado = '';
  }

  get estadosDisponibles(): string[] {
    if (!this.cita) return [];

    switch (this.cita.estado) {
      case 'PENDIENTE':
        return ['CONFIRMADA', 'CANCELADA', 'NO_ASISTIO'];
      case 'CONFIRMADA':
        return ['COMPLETADA', 'CANCELADA', 'NO_ASISTIO'];
      default:
        return [];
    }
  }

  get flujoCerrado(): boolean {
    if (!this.cita) return true;

    return ['COMPLETADA', 'CANCELADA', 'NO_ASISTIO'].includes(this.cita.estado);
  }

  onGuardar(): void {
    if (!this.estadoSeleccionado) return;
    this.guardar.emit(this.estadoSeleccionado);
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}