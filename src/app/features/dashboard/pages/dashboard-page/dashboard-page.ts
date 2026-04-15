import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  registerables
} from 'chart.js';

import { DashboardService } from '../../../../core/services/dashboard.service';
import {
  DashboardCitasEstado,
  DashboardIngresoDiario,
  DashboardIngresos,
  DashboardProximaCita,
  DashboardResumen,
  DashboardServicioTop
} from '../../../../core/interfaces/dashboard.interface';

// 🔥 Registro global de todos los elementos de Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.scss'
})
export class DashboardPage implements OnInit {

  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  resumen: DashboardResumen | null = null;
  ingresos: DashboardIngresos | null = null;
  proximasCitas: DashboardProximaCita[] = [];
  citasEstado: DashboardCitasEstado[] = [];
  ingresosUltimos7Dias: DashboardIngresoDiario[] = [];
  serviciosTop: DashboardServicioTop[] = [];

  loading = true;
  error = '';

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Ingresos',
        tension: 0.3,
        fill: true
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      resumen: this.dashboardService.obtenerResumen().pipe(
        catchError((err) => {
          console.error('Error en resumen', err);
          return of(null);
        })
      ),

      ingresos: this.dashboardService.obtenerIngresos().pipe(
        catchError((err) => {
          console.error('Error en ingresos', err);
          return of(null);
        })
      ),

      proximasCitas: this.dashboardService.obtenerProximasCitas().pipe(
        catchError((err) => {
          console.error('Error en próximas citas', err);
          return of([]);
        })
      ),

      citasEstado: this.dashboardService.obtenerCitasPorEstado().pipe(
        catchError((err) => {
          console.error('Error en citas por estado', err);
          return of([]);
        })
      ),

      ingresosUltimos7Dias: this.dashboardService.obtenerIngresosUltimos7Dias().pipe(
        catchError((err) => {
          console.error('Error en ingresos 7 días', err);
          return of([]);
        })
      ),

      serviciosTop: this.dashboardService.obtenerServiciosTop().pipe(
        catchError((err) => {
          console.error('Error en servicios top', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        console.log('Dashboard completo', data);

        this.resumen = data.resumen;
        this.ingresos = data.ingresos;
        this.proximasCitas = data.proximasCitas;
        this.citasEstado = data.citasEstado;
        this.ingresosUltimos7Dias = data.ingresosUltimos7Dias;
        this.serviciosTop = data.serviciosTop;

        this.lineChartData = {
          labels: this.ingresosUltimos7Dias.map((item) => item.fecha),
          datasets: [
            {
              data: this.ingresosUltimos7Dias.map((item) => item.total),
              label: 'Ingresos',
              tension: 0.3,
              fill: true
            }
          ]
        };

        this.pieChartData = {
          labels: this.citasEstado.map((item) => item.estado),
          datasets: [
            {
              data: this.citasEstado.map((item) => item.total)
            }
          ]
        };

        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      },

      error: (err) => {
        console.error('Error general dashboard', err);
        this.error = 'No se pudo cargar el dashboard.';
        this.loading = false;

        requestAnimationFrame(() => {
          this.cdr.detectChanges();
        });
      }
    });
  }
}