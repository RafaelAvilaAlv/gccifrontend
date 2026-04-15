import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pago } from '../../../../core/interfaces/pago.interface';
import { PagosService } from '../../../../core/services/pagos.service';

@Component({
  selector: 'app-pagos-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pagos-page.html',
  styleUrl: './pagos-page.scss'
})
export class PagosPage implements OnInit {
  private pagosService = inject(PagosService);
  private cdr = inject(ChangeDetectorRef);

  pagos: Pago[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading = true;
    this.error = '';

    this.pagosService.listar().subscribe({
      next: (data) => {
        console.log('Pagos cargados', data);
        this.pagos = data;
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        console.error('Error cargando pagos', err);
        this.error = 'No se pudieron cargar los pagos.';
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }

  getEstadoClase(estado: string): string {
    switch (estado) {
      case 'PAGADO':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  }
}