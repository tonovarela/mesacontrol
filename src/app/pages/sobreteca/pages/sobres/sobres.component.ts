import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { MetricsService } from '@app/services';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sobres',
  imports: [
    SynfusionModule,
    CommonModule,
    SearchMetricsComponent,
    //  LoadingComponent
  ],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SobresComponent  extends BaseGridComponent implements OnInit {
  public readonly type = TypeSearchMetrics.SOBRESPREPRENSA;
  metricsService = inject(MetricsService);
  protected minusHeight = 0.3;
  private _ordenes= signal<OrdenMetrics[]>([]);
  public ordenes = computed(() => this._ordenes());
  

  

  async onSelectOrder(orden: OrdenMetrics | null) {
    if (orden === null) {
      return;
    }
    try {
      const response = await firstValueFrom(this.metricsService.registrarSobre(orden.NoOrden));
      this.cargarInformacion(false);
    } catch (error) {
      console.error('Error al registrar el sobre:', error);
    }
  }

 constructor() {
    super();
  }
  
  ngOnInit(): void {
    this.cargarInformacion(false);
    this.iniciarResizeGrid(this.minusHeight, true);
  }

  async cargarInformacion(historico:boolean) {
    try {
      const response =await firstValueFrom(this.metricsService.listarSobres(historico));      
      this._ordenes.set(response.ordenes);
    } catch (error) {
      console.error('Error al cargar la información:', error);
    }
  }
}
