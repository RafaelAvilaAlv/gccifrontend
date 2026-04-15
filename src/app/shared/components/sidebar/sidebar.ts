import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  private authService = inject(AuthService);

  // 🔥 Admin
  get esAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // 🔥 Rol actual (para futuras mejoras)
  get rol(): string | null {
    return this.authService.getRol();
  }
}