import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CitasService } from '../../../../core/services/citas.service';
import { ClientesService } from '../../../../core/services/clientes.service';
import { ServiciosService } from '../../../../core/services/servicios.service';
import { UsuariosService } from '../../../../core/services/usuarios.service';

import { Cliente } from '../../../../core/interfaces/cliente.interface';
import { Servicio } from '../../../../core/interfaces/servicio.interface';
import { Usuario } from '../../../../core/interfaces/usuario.interface';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-cita-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cita-form-page.html',
  styleUrl: './cita-form-page.scss'
})
export class CitaFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  private citasService = inject(CitasService);
  private clientesService = inject(ClientesService);
  private serviciosService = inject(ServiciosService);
  private usuariosService = inject(UsuariosService);

  clientes: Cliente[] = [];
  servicios: Servicio[] = [];
  usuarios: Usuario[] = [];

  loading = false;
  loadingData = true;
  error = '';
  success = '';

  modoEdicion = false;
  citaId: number | null = null;

  citaForm = this.fb.nonNullable.group({
    clienteId: [0, [Validators.required, Validators.min(1)]],
    servicioId: [0, [Validators.required, Validators.min(1)]],
    usuarioId: [0, [Validators.required, Validators.min(1)]],
    fecha: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    precioFinal: [0, [Validators.required, Validators.min(0.01)]],
    observaciones: ['']
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.modoEdicion = true;
      this.citaId = Number(id);
    }

    this.cargarDatosFormulario();
  }

  cargarDatosFormulario(): void {
    this.loadingData = true;
    this.error = '';

    this.clientesService.listar().subscribe({
      next: (clientes) => {
        this.clientes = clientes;

        this.serviciosService.listar().subscribe({
          next: (servicios) => {
            this.servicios = servicios;

            this.usuariosService.listar().subscribe({
              next: (usuarios) => {
                this.usuarios = usuarios;

                if (this.modoEdicion && this.citaId) {
                  this.cargarCita(this.citaId);
                } else {
                  this.loadingData = false;
                  requestAnimationFrame(() => this.cdr.detectChanges());
                }
              },
              error: (err: any) => {
                console.error('Error cargando usuarios', err);
                this.error = 'No se pudieron cargar los usuarios.';
                this.loadingData = false;

                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'No se pudieron cargar los usuarios.'
                });

                requestAnimationFrame(() => this.cdr.detectChanges());
              }
            });
          },
          error: (err: any) => {
            console.error('Error cargando servicios', err);
            this.error = 'No se pudieron cargar los servicios.';
            this.loadingData = false;

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron cargar los servicios.'
            });

            requestAnimationFrame(() => this.cdr.detectChanges());
          }
        });
      },
      error: (err: any) => {
        console.error('Error cargando clientes', err);
        this.error = 'No se pudieron cargar los clientes.';
        this.loadingData = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los clientes.'
        });

        requestAnimationFrame(() => this.cdr.detectChanges());
      }
    });
  }

  cargarCita(id: number): void {
    this.citasService.obtenerPorId(id).subscribe({
      next: (cita) => {
        this.citaForm.patchValue({
          clienteId: cita.clienteId,
          servicioId: cita.servicioId,
          usuarioId: cita.usuarioId,
          fecha: cita.fecha,
          horaInicio: cita.horaInicio,
          horaFin: cita.horaFin,
          precioFinal: cita.precioFinal,
          observaciones: cita.observaciones ?? ''
        });

        this.loadingData = false;
        requestAnimationFrame(() => this.cdr.detectChanges());
      },
      error: (err: any) => {
        console.error('Error cargando cita', err);
        this.error = 'No se pudo cargar la cita.';
        this.loadingData = false;

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar la cita.'
        });

        requestAnimationFrame(() => this.cdr.detectChanges());
      }
    });
  }

  guardar(): void {
    if (this.citaForm.invalid) {
      this.citaForm.markAllAsTouched();

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

    const data = this.citaForm.getRawValue();

    const body = {
      clienteId: data.clienteId,
      servicioId: data.servicioId,
      usuarioId: data.usuarioId,
      fecha: data.fecha,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      precioFinal: data.precioFinal,
      observaciones: data.observaciones
    };

    const request = this.modoEdicion && this.citaId
      ? this.citasService.actualizar(this.citaId, body)
      : this.citasService.crear(body);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.success = this.modoEdicion
          ? 'Cita actualizada correctamente.'
          : 'Cita creada correctamente.';

        Swal.fire({
          icon: 'success',
          title: this.modoEdicion ? 'Cita actualizada' : 'Cita creada',
          text: this.success,
          timer: 1500,
          showConfirmButton: false
        });

        requestAnimationFrame(() => this.cdr.detectChanges());

        setTimeout(() => {
          this.router.navigate(['/citas']);
        }, 700);
      },
      error: (err: any) => {
        console.error('Error guardando cita', err);
        this.loading = false;
        this.error = this.modoEdicion
          ? 'No se pudo actualizar la cita.'
          : 'No se pudo crear la cita.';

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.error
        });

        requestAnimationFrame(() => this.cdr.detectChanges());
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/citas']);
  }

  nombreUsuario(u: Usuario): string {
    return `${u.nombre ?? ''} ${u.apellido ?? ''}`.trim();
  }
}