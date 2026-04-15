import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../../core/interfaces/usuario.interface';
import { UsuariosService } from '../../../../core/services/usuarios.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil-page.html',
  styleUrl: './perfil-page.scss',
})
export class PerfilPage implements OnInit {
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  usuario: Usuario | null = null;

  loading = true;
  changingPassword = false;
  error = '';
  success = '';

  passwordForm = this.fb.nonNullable.group({
    passwordActual: ['', [Validators.required, Validators.minLength(6)]],
    nuevaPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmarPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.usuariosService.obtenerMiPerfil().subscribe({
      next: (data) => {
        this.usuario = data;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando perfil', err);
        this.error = 'No se pudo cargar la información del perfil.';
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
    });
  }

  cambiarPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { passwordActual, nuevaPassword, confirmarPassword } =
      this.passwordForm.getRawValue();

    if (nuevaPassword !== confirmarPassword) {
      this.error = 'La nueva contraseña y la confirmación no coinciden.';
      this.success = '';
      return;
    }

    this.changingPassword = true;
    this.error = '';
    this.success = '';

    this.usuariosService
      .cambiarPassword({
        passwordActual,
        nuevaPassword,
      })
      .subscribe({
        next: () => {
          this.changingPassword = false;
          this.success = 'Contraseña actualizada correctamente.';
          this.passwordForm.reset();

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        },
        error: (err: any) => {
          console.error('Error cambiando contraseña', err);
          this.changingPassword = false;
          this.error =
            'No se pudo cambiar la contraseña. Verifica tu contraseña actual.';
          this.success = '';

          requestAnimationFrame(() => {
            this.cdr.detectChanges();
          });
        },
      });
  }

  get estadoTexto(): string {
    return this.usuario?.activo ? 'Activo' : 'Inactivo';
  }

  get estadoClase(): string {
    return this.usuario?.activo
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }
}