import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiciosService } from '../../../../core/services/servicios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicio-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './servicio-form-page.html',
  styleUrl: './servicio-form-page.scss'
})
export class ServicioFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private serviciosService = inject(ServiciosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = false;
  error = '';
  success = '';

  modoEdicion = false;
  servicioId: number | null = null;

  servicioForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: ['', [Validators.required, Validators.minLength(3)]],
    precioBase: [0, [Validators.required, Validators.min(0.01)]],
    duracionMinutos: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.servicioId = Number(id);
      this.cargarServicio(this.servicioId);
    }
  }

  cargarServicio(id: number): void {
    this.loading = true;
    this.error = '';

    this.serviciosService.obtenerPorId(id).subscribe({
      next: (data) => {
        console.log('Servicio cargado para editar', data);

        this.servicioForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precioBase: data.precioBase,
          duracionMinutos: data.duracionMinutos
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error cargando servicio', err);
        this.error = 'No se pudo cargar el servicio.';
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el servicio.'
        });
      }
    });
  }

  guardar(): void {
    if (this.servicioForm.invalid) {
      this.servicioForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario incompleto',
        text: 'Por favor completa todos los campos correctamente.'
      });

      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const data = this.servicioForm.getRawValue();

    if (this.modoEdicion && this.servicioId) {
      this.serviciosService.actualizar(this.servicioId, data).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Servicio actualizado correctamente.';

          Swal.fire({
            icon: 'success',
            title: 'Servicio actualizado',
            text: 'El servicio fue actualizado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            this.router.navigate(['/servicios']);
          }, 700);
        },
        error: (err: any) => {
          console.error('Error actualizando servicio', err);
          this.loading = false;
          this.error = 'No se pudo actualizar el servicio.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el servicio.'
          });
        }
      });
    } else {
      this.serviciosService.crear(data).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Servicio creado correctamente.';

          Swal.fire({
            icon: 'success',
            title: 'Servicio creado',
            text: 'El servicio fue creado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          setTimeout(() => {
            this.router.navigate(['/servicios']);
          }, 700);
        },
        error: (err: any) => {
          console.error('Error creando servicio', err);
          this.loading = false;
          this.error = 'No se pudo crear el servicio.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el servicio.'
          });
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/servicios']);
  }
}