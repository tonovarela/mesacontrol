import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { MetricsService, UiService } from '@app/services';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-omisiones',
  imports: [ CommonModule, SynfusionModule ],
  templateUrl: './omisiones.component.html',
  styleUrl: './omisiones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OmisionesComponent extends BaseGridComponent implements OnInit {
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  private  metricsService= inject(MetricsService);
  private uiService = inject(UiService);
  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public cargando = signal(false);
  protected minusHeight = 0.30;
  public wrapSettings?: TextWrapSettingsModel;
  ngOnInit(): void {
    this.autoFitColumns = false;    
    setTimeout(() => {
      this.iniciarResizeGrid(this.minusHeight);    
    });

    this.cargarInformacion();    
  }

  constructor() {
    super();   

  }


    async cargarInformacion() {
  
      this.cargando.set(true);
      try {
        this._ordenesMetrics.set([]); // Limpiar la lista antes de cargar nuevos datos            
        const response = await firstValueFrom(this.metricsService.omisiones())
        this._ordenesMetrics.set(response.ordenes)
      }
      catch (error) {
        this.uiService.mostrarAlertaError('Error al cargar la información', 'No se pudo cargar la información de las órdenes de métricas. Por favor, inténtelo más tarde.');
      }
      finally {
        this.cargando.set(false);                
      }
    }
}
