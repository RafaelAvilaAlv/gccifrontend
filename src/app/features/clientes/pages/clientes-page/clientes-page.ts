import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ClientesService } from '../../../../core/services/clientes.service';
import { Cliente } from '../../../../core/interfaces/cliente.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clientes-page.html',
  styleUrl: './clientes-page.scss'
})
export class ClientesPage implements OnInit {
  private clientesService = inject(ClientesService);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  clientesInactivos: Cliente[] = [];
  loading = true;
  error = '';
  deletingId: number | null = null;
  activatingId: number | null = null;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      activos: this.clientesService.listar(),
      inactivos: this.clientesService.listarInactivos()
    }).subscribe({
      next: (data) => {
        this.clientes = data.activos;
        this.clientesInactivos = data.inactivos;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando clientes', err);
        this.error = 'No se pudieron cargar los clientes.';
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  // 🔴 DESACTIVAR
  desactivarCliente(cliente: Cliente): void {
    Swal.fire({
      title: '¿Desactivar cliente?',
      text: `${cliente.nombres} ${cliente.apellidos}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.deletingId = cliente.id;
      this.error = '';

      this.clientesService.desactivar(cliente.id).subscribe({
        next: () => {
          this.deletingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Desactivado',
            text: 'El cliente fue desactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarClientes();
        },
        error: (err: any) => {
          console.error('Error desactivando cliente', err);
          this.error = 'No se pudo desactivar el cliente.';
          this.deletingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo desactivar el cliente.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }

  // 🟢 ACTIVAR
  activarCliente(cliente: Cliente): void {
    Swal.fire({
      title: '¿Reactivar cliente?',
      text: `${cliente.nombres} ${cliente.apellidos}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.activatingId = cliente.id;
      this.error = '';

      this.clientesService.activar(cliente.id).subscribe({
        next: () => {
          this.activatingId = null;

          Swal.fire({
            icon: 'success',
            title: 'Reactivado',
            text: 'El cliente fue reactivado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cargarClientes();
        },
        error: (err: any) => {
          console.error('Error reactivando cliente', err);
          this.error = 'No se pudo reactivar el cliente.';
          this.activatingId = null;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo reactivar el cliente.'
          });

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        }
      });
    });
  }
}