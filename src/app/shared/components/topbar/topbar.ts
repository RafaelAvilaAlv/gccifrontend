import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = this.authService.getUserEmail();
  rol = this.authService.getUserRole();

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}