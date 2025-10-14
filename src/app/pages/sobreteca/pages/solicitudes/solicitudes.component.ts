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

interface OrdenPrestamo  extends OrdenMetrics {
  enPrestamo:boolean

}

@Component({
  selector: 'app-solicitudes-sobre',
  imports: [SynfusionModule,SearchMetricsComponent,CommonModule,PrimeModule,FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit,AfterViewInit { 
  @ViewChild('dialogModal') dialogModal: any;
  public readonly type = TypeSearchMetrics.CON_GAVETA_ASIGNADA;
  public componentesAgrupados = signal<ComponenteAgrupado[]>([]);    
  protected minusHeight = 0.3;
   
   
  private uiService= inject(UiService);
  private _activatedRouter = inject(ActivatedRoute);
  private _sobreService = inject(SobreService);

  public tieneOrdenSeleccionada = computed(() => this.ordenActual() !== null);
  public ordenActual = signal<OrdenPrestamo | null>(null);
  public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
   
  public ordenes = computed(()=>{return [];});
   
  public nombreTrabajo = computed(() => {
    if (this.ordenActual() === null) return '';
    return `${this.ordenActual()?.NoOrden}  - ${this.ordenActual()?.NombreTrabajo}`;
  });

  ngAfterViewInit(): void {
    
    
  }

  constructor() {
    super();   
  }
  ngOnInit(): void {
      this.iniciarResizeGrid(this.minusHeight, true);
            
  }



  cerrarDetalle(){
    this.ordenActual.set(null);
    this.componentesAgrupados.set([]);

  }

  verDetalle(orden:OrdenMetrics){
    console.log("------");
  }

  public async onSelectOrder(orden: OrdenMetrics | null) {
    if (!orden) {
      return;
    }
    
    const tieneGaveta = orden?.no_gaveta && orden.no_gaveta > 0;

    if (!tieneGaveta) {
      this.uiService.mostrarAlertaError('',`El sobre con la orden ${orden.NoOrden} no tiene gaveta asignada, por favor asignar antes de continuar`);
      return;
    }
     const numero_orden = orden.NoOrden;
     const responseOrden = await firstValueFrom(this._sobreService.contenido(numero_orden));
     const responsePrestamo = await firstValueFrom(this._sobreService.informacionPrestamo(numero_orden));

     const contenido = responseOrden.contenido.map((item:any) => ({...item,a: item.aplica == '1'}));
     this.ordenActual.set({...orden,enPrestamo:responsePrestamo.enPrestamo});                                                                
     if (contenido.length > 0) {
        const componentes = new Set([ ...contenido.map((item) => item.componente)]);   
        const componentesAgrupado=  Array.from(componentes).map((componente) => ({  nombre:componente, elementos :  contenido.filter((item) => item.componente === componente) }));
        this.componentesAgrupados.set(componentesAgrupado);
     }
     this.dialogModal.maximized = true;

    //Verifica si tiene prestamo

  
  }
}
