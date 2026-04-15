import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

import { MainLayout } from './shared/layouts/main-layout/main-layout';

import { LoginPage } from './features/auth/pages/login-page/login-page';
import { DashboardPage } from './features/dashboard/pages/dashboard-page/dashboard-page';

import { ClientesPage } from './features/clientes/pages/clientes-page/clientes-page';
import { ClienteFormPage } from './features/clientes/pages/cliente-form-page/cliente-form-page';

import { ServiciosPage } from './features/servicios/pages/servicios-page/servicios-page';
import { ServicioFormPage } from './features/servicios/pages/servicio-form-page/servicio-form-page';

import { CitasPage } from './features/citas/pages/citas-page/citas-page';
import { CitaFormPage } from './features/citas/pages/cita-form-page/cita-form-page';

import { PagosPage } from './features/pagos/pages/pagos-page/pagos-page';
import { PagoFormPage } from './features/pagos/pages/pago-form-page/pago-form-page';

import { UsuariosPage } from './features/usuarios/pages/usuarios-page/usuarios-page';
import { UsuarioFormPage } from './features/usuarios/pages/usuario-form-page/usuario-form-page';
import { PerfilPage } from './features/perfil/pages/perfil-page/perfil-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardPage },

      { path: 'clientes', component: ClientesPage },
      { path: 'clientes/nuevo', component: ClienteFormPage },
      { path: 'clientes/editar/:id', component: ClienteFormPage },

      { path: 'servicios', component: ServiciosPage },
      { path: 'servicios/nuevo', component: ServicioFormPage },
      { path: 'servicios/editar/:id', component: ServicioFormPage },

      { path: 'citas', component: CitasPage },
      { path: 'citas/nueva', component: CitaFormPage },
      { path: 'citas/editar/:id', component: CitaFormPage },

      { path: 'pagos', component: PagosPage },
      { path: 'pagos/nuevo', component: PagoFormPage },

      {
        path: 'usuarios',
        component: UsuariosPage,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'usuarios/nuevo',
        component: UsuarioFormPage,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'usuarios/editar/:id',
        component: UsuarioFormPage,
        canActivate: [authGuard],
        data: { roles: ['ADMIN'] }
      },

      { path: 'perfil', component: PerfilPage },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];