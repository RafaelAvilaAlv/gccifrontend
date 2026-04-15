import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Cita } from '../../../../core/interfaces/cita.interface';
import { Pago } from '../../../../core/interfaces/pago.interface';

import { CitasService } from '../../../../core/services/citas.service';
import { PagosService } from '../../../../core/services/pagos.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pago-form-page.html',
  styleUrl: './pago-form-page.scss'
})
export class PagoFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private citasService = inject(CitasService);
  private pagosService = inject(PagosService);

  citasDisponibles: Cita[] = [];
  todasLasCitas: Cita[] = [];
  pagos: Pago[] = [];

  loading = false;
  loadingData = true;
  error = '';
  success = '';

  metodosPago = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA'];

  pagoForm = this.fb.nonNullable.group({
    citaId: [0, [Validators.required, Validators.min(1)]],
    monto: [0, [Validators.required, Validators.min(0.01)]],
    metodoPago: ['', Validators.required],
    referencia: [''],
    observacion: ['']
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.loadingData = true;
    this.error = '';

    this.citasService.listar().subscribe({
      next: (citas) => {
        this.todasLasCitas = citas;

        this.pagosService.listar().subscribe({
          next: (pagos) => {
            this.pagos = pagos;

            const citasPagadasIds = new Set(this.pagos.map((p) => p.citaId));

            this.citasDisponibles = this.todasLasCitas.filter(
              (cita) => cita.estado === 'COMPLETADA' && !citasPagadasIds.has(cita.id)
            );

            this.loadingData = false;

            requestAnimationFrame(() => {
              this.cdr.detectChanges();
            });
          },
          error: (err: any) => {
            console.error('Error cargando pagos', err);
            this.error = 'No se pudieron cargar los pagos.';
            this.loadingData = false;

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los pagos.'
            });

            requestAnimationFrame(() => {
              this.cdr.detectChanges();
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Error cargando citas', err);
        this.error = 'No se pudieron cargar las citas.';
        this.loadingData = false;

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

  get citaSeleccionada(): Cita | null {
    const citaId = this.pagoForm.getRawValue().citaId;
    return this.citasDisponibles.find((c) => c.id === citaId) ?? null;
  }

  onCitaChange(): void {
    const cita = this.citaSeleccionada;
    if (!cita) return;

    this.pagoForm.patchValue({
      monto: cita.precioFinal
    });
  }

  guardar(): void {
    if (this.pagoForm.invalid) {
      this.pagoForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos obligatorios.'
      });

      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const data = this.pagoForm.getRawValue();

    const body = {
      citaId: data.citaId,
      monto: data.monto,
      metodoPago: data.metodoPago,
      referencia: data.referencia,
      observacion: data.observacion
    };

    this.pagosService.crear(body).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Pago registrado correctamente.';

        Swal.fire({
          icon: 'success',
          title: 'Pago registrado',
          text: 'El pago fue registrado correctamente.',
          timer: 1500,
          showConfirmButton: false
        });

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });

        setTimeout(() => {
          this.router.navigate(['/pagos']);
        }, 700);
      },
      error: (err: any) => {
        console.error('Error registrando pago', err);
        this.loading = false;
        this.error = 'No se pudo registrar el pago.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar el pago.'
        });

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pagos']);
  }

  descripcionCita(cita: Cita): string {
    return `#${cita.id} - ${cita.nombreCliente} - ${cita.nombreServicio} - ${cita.fecha}`;
  }
}