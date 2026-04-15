import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (allowedRoles && allowedRoles.length > 0) {
    const rol = authService.getRol();

    if (!rol || !allowedRoles.includes(rol)) {
      router.navigate(['/dashboard']);
      return false;
    }
  }

  return true;
};