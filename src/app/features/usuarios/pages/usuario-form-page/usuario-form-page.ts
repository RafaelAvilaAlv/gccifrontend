import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { UsuarioRequest } from '../../../../core/interfaces/usuario.interface';
import { UsuariosService } from '../../../../core/services/usuarios.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario-form-page.html',
  styleUrl: './usuario-form-page.scss'
})
export class UsuarioFormPage implements OnInit {
  private fb = inject(FormBuilder);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  loading = false;
  loadingData = false;
  error = '';
  success = '';
  editando = false;
  usuarioId: number | null = null;

  roles = ['ADMIN', 'EMPLEADO'];

  usuarioForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    rol: ['EMPLEADO', [Validators.required]],
    activo: [true]
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          this.editando = true;
          this.usuarioId = Number(id);

          this.usuarioForm.controls.password.clearValidators();
          this.usuarioForm.controls.password.updateValueAndValidity();

          this.cargarUsuario(this.usuarioId);
        } else {
          this.editando = false;
          this.usuarioId = null;

          this.usuarioForm.reset({
            nombre: '',
            apellido: '',
            email: '',
            password: '',
            rol: 'EMPLEADO',
            activo: true
          });

          this.usuarioForm.controls.password.setValidators([
            Validators.required,
            Validators.minLength(8)
          ]);
          this.usuarioForm.controls.password.updateValueAndValidity();

          this.loadingData = false;
          this.cdr.detectChanges();
        }
      }
    });
  }

  cargarUsuario(id: number): void {
    this.loadingData = true;
    this.error = '';
    this.cdr.detectChanges();

    this.usuariosService.obtenerPorId(id)
      .pipe(
        finalize(() => {
          this.loadingData = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (usuario) => {
          this.usuarioForm.patchValue({
            nombre: usuario.nombre ?? '',
            apellido: usuario.apellido ?? '',
            email: usuario.email ?? '',
            password: '',
            rol: usuario.rol ?? 'EMPLEADO',
            activo: usuario.activo ?? true
          });

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando usuario', err);
          this.error = err?.error?.message || 'No se pudo cargar la información del usuario.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.error
          });

          this.cdr.detectChanges();
        }
      });
  }

  guardar(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();

      Swal.fire({
        icon: 'warning',
        title: 'Formulario inválido',
        text: 'Revisa los campos obligatorios del formulario.'
      });

      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';
    this.cdr.detectChanges();

    const formValue = this.usuarioForm.getRawValue();

    let payload: UsuarioRequest;

    if (this.editando) {
      payload = {
        nombre: formValue.nombre.trim(),
        apellido: formValue.apellido.trim(),
        email: formValue.email.trim(),
        rol: formValue.rol,
        activo: formValue.activo
      };
    } else {
      payload = {
        nombre: formValue.nombre.trim(),
        apellido: formValue.apellido.trim(),
        email: formValue.email.trim(),
        password: formValue.password.trim(),
        rol: formValue.rol,
        activo: formValue.activo
      };
    }

    if (this.editando && this.usuarioId) {
      this.usuariosService.actualizar(this.usuarioId, payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Usuario actualizado correctamente.';

          Swal.fire({
            icon: 'success',
            title: 'Usuario actualizado',
            text: 'El usuario fue actualizado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/usuarios']);
          }, 700);
        },
        error: (err) => {
          console.error('Error actualizando usuario', err);
          this.loading = false;
          this.error = err?.error?.message || 'No se pudo actualizar el usuario.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.error
          });

          this.cdr.detectChanges();
        }
      });
    } else {
      this.usuariosService.crear(payload).subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Usuario creado correctamente.';

          Swal.fire({
            icon: 'success',
            title: 'Usuario creado',
            text: 'El usuario fue creado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });

          this.cdr.detectChanges();

          setTimeout(() => {
            this.router.navigate(['/usuarios']);
          }, 700);
        },
        error: (err) => {
          console.error('Error creando usuario', err);
          this.loading = false;
          this.error = err?.error?.message || 'No se pudo crear el usuario.';

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: this.error
          });

          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/usuarios']);
  }

  get passwordHint(): string {
    return this.editando
      ? 'En edición no se cambia la contraseña desde este formulario.'
      : 'La contraseña es obligatoria y debe tener mínimo 8 caracteres.';
  }
}