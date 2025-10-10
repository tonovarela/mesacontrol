import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { UiService } from '@app/services';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

@Component({
  selector: 'app-solicitudes-sobre',
  imports: [SynfusionModule,SearchMetricsComponent,CommonModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit { 
  protected minusHeight = 0.3;
  private uiService= inject(UiService);
   private _activatedRouter = inject(ActivatedRoute);
   public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
   public readonly type = TypeSearchMetrics.CON_GAVETA_ASIGNADA;
   public ordenes = computed(()=>{return [];});
  constructor() {
    super();   
  }
  ngOnInit(): void {
      this.iniciarResizeGrid(this.minusHeight, true);
  }

  public async onSelectOrder(orden: OrdenMetrics | null) {
    if (!orden) {
      return;
    }
    console.log('Orden seleccionada:', orden);
    const tieneGaveta = orden?.no_gaveta && orden.no_gaveta > 0;
    if (!tieneGaveta) {
        this.uiService.mostrarAlertaError('',`El sobre con la orden ${orden.NoOrden} no tiene gaveta asignada, por favor asignar antes de continuar`);
      return;
    }
  
  }
}
