import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  imports: [CommonModule,PrimeModule, FormsModule, SynfusionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit {

  ordenesMetrics = signal<OrdenMetrics[]>([]);
  cargando = signal(false);
  protected minusHeight = 0;
  private metricsService = inject(MetricsService);

  constructor() {
    super();
  }
  
  ngOnInit(): void {
    this.autoFitColumns = false;

    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();

  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      const response = await firstValueFrom(this.metricsService.listar())
      this.ordenesMetrics.set(response.ordenes)
    }
    catch (error) {
      console.error('Error al cargar la información:', error);
    }
    finally {
      this.cargando.set(false);
    }


  }




}
