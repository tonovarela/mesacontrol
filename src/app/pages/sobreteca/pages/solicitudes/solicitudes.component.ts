import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SobreService, UiService } from '@app/services';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { ComponenteAgrupado } from '../../interface/interface';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-solicitudes-sobre',
  imports: [SynfusionModule,SearchMetricsComponent,CommonModule,PrimeModule,FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit,AfterViewInit { 
  @ViewChild('dialogModal') dialogModal: any;
  public componentesAgrupados = signal<ComponenteAgrupado[]>([]);    
   protected minusHeight = 0.3;
   
   
   private uiService= inject(UiService);
   private _activatedRouter = inject(ActivatedRoute);
   private _sobreService = inject(SobreService);

  public tieneOrdenSeleccionada = computed(() => this.ordenActual() !== null);
  public ordenActual = signal<OrdenMetrics | null>(null);
   public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
   public readonly type = TypeSearchMetrics.CON_GAVETA_ASIGNADA;
   public ordenes = computed(()=>{return [];});
   
   public nombreTrabajo = computed(()=>{
    return "---";
   }
  );

  ngAfterViewInit(): void {
    this.dialogModal.maximized = true;
  }

  constructor() {
    super();   
  }
  ngOnInit(): void {
      this.iniciarResizeGrid(this.minusHeight, true);
            
  }



  cerrarDetalle(){}

  public async onSelectOrder(orden: OrdenMetrics | null) {
    if (!orden) {
      return;
    }
    //console.log('Orden seleccionada:', orden);
    const tieneGaveta = orden?.no_gaveta && orden.no_gaveta > 0;

    if (!tieneGaveta) {
      this.uiService.mostrarAlertaError('',`El sobre con la orden ${orden.NoOrden} no tiene gaveta asignada, por favor asignar antes de continuar`);
      return;
    }
     const response = await firstValueFrom(this._sobreService.contenido(orden.NoOrden));
     const contenido = response.contenido.map((item:any) => ({
                                                              ...item,
                                                              aplica: item.aplica == '1'
                                                            }));

    this.ordenActual.set(orden);                                                            
     if (contenido.length > 0) {

        const componentes = new Set([ ...contenido.map((item) => item.componente)]);   
        const componentesAgrupado=  Array.from(componentes).map((componente) => ({  nombre:componente, elementos :  contenido.filter((item) => item.componente === componente) }));
        this.componentesAgrupados.set(componentesAgrupado);

    }

    //Verifica si tiene prestamo

  
  }
}
