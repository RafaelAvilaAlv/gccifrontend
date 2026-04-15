import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientesService } from '../../../../core/services/clientes.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cliente-form-page',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './cliente-form-page.html',
    styleUrl: './cliente-form-page.scss'
})
export class ClienteFormPage implements OnInit {
    private fb = inject(FormBuilder);
    private clientesService = inject(ClientesService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    loading = false;
    loadingData = false;
    error = '';
    success = '';
    editando = false;
    clienteId: number | null = null;

    clienteForm = this.fb.nonNullable.group({
        nombres: ['', [Validators.required, Validators.minLength(2)]],
        apellidos: ['', [Validators.required, Validators.minLength(2)]],
        telefono: ['', [Validators.required, Validators.minLength(7)]],
        email: ['', [Validators.required, Validators.email]],
        direccion: ['', [Validators.required, Validators.minLength(3)]],
        observaciones: ['']
    });

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');

        if (id) {
            this.editando = true;
            this.clienteId = Number(id);
            this.cargarCliente(this.clienteId);
        }
    }

    cargarCliente(id: number): void {
        this.loadingData = true;
        this.error = '';

        this.clientesService.obtenerPorId(id).subscribe({
            next: (cliente) => {
                this.clienteForm.patchValue({
                    nombres: cliente.nombres ?? '',
                    apellidos: cliente.apellidos ?? '',
                    telefono: cliente.telefono ?? '',
                    email: cliente.email ?? '',
                    direccion: cliente.direccion ?? '',
                    observaciones: cliente.observaciones ?? ''
                });

                this.loadingData = false;
            },
            error: (err) => {
                console.error('Error cargando cliente', err);
                this.error = 'No se pudo cargar la información del cliente.';
                this.loadingData = false;

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información del cliente.'
                });
            }
        });
    }

    guardar(): void {
        if (this.clienteForm.invalid) {
            this.clienteForm.markAllAsTouched();

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

        const payload = this.clienteForm.getRawValue();

        if (this.editando && this.clienteId) {
            this.clientesService.actualizar(this.clienteId, payload).subscribe({
                next: () => {
                    this.loading = false;
                    this.success = 'Cliente actualizado correctamente.';

                    Swal.fire({
                        icon: 'success',
                        title: 'Cliente actualizado',
                        text: 'El cliente fue actualizado correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        this.router.navigate(['/clientes']);
                    }, 700);
                },
                error: (err) => {
                    console.error('Error actualizando cliente', err);
                    this.loading = false;
                    this.error = 'No se pudo actualizar el cliente.';

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar el cliente.'
                    });
                }
            });
        } else {
            this.clientesService.crear(payload).subscribe({
                next: () => {
                    this.loading = false;
                    this.success = 'Cliente creado correctamente.';

                    Swal.fire({
                        icon: 'success',
                        title: 'Cliente creado',
                        text: 'El cliente fue creado correctamente.',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    setTimeout(() => {
                        this.router.navigate(['/clientes']);
                    }, 700);
                },
                error: (err) => {
                    console.error('Error creando cliente', err);
                    this.loading = false;
                    this.error = 'No se pudo crear el cliente.';

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo crear el cliente.'
                    });
                }
            });
        }
    }

    cancelar(): void {
        this.router.navigate(['/clientes']);
    }
}