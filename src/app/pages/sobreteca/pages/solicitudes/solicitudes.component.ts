import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { PrestamoSobreService, SobreService, UiService } from '@app/services';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';
import { ComponenteAgrupado, OrdenConGaveta } from '../../interface/interface';

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
export default class SolicitudesComponent extends BaseGridComponent implements OnInit { 
  @ViewChild('dialogModal') dialogModal: any;
  public readonly type = TypeSearchMetrics.CON_GAVETA_ASIGNADA;
  public componentesAgrupados = signal<ComponenteAgrupado[]>([]);    
  protected minusHeight = 0.3;
   
   
  private uiService= inject(UiService);
  private _activatedRouter = inject(ActivatedRoute);
  private _sobreService = inject(SobreService);
  private _prestamoService  =  inject(PrestamoSobreService);


  public tieneOrdenSeleccionada = computed(() => this.ordenActual() !== null);
  public ordenActual = signal<OrdenPrestamo | null>(null);
  public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
   
  public ordenes = computed(()=>{return this._ordenes();});
  private _ordenes = signal<OrdenConGaveta[]>([]);
   
  public nombreTrabajo = computed(() => {
    if (this.ordenActual() === null) return '';
    return `${this.ordenActual()?.NoOrden}  - ${this.ordenActual()?.NombreTrabajo}`;
  });


  constructor() {
    super();   
  }

  ngOnInit(): void {
      this.iniciarResizeGrid(this.minusHeight, true);  
      this.cargarInformacion();          
  }


  async cargarInformacion(){
    try {
    const response =await  firstValueFrom( this._sobreService.conGaveta())
    this._ordenes.set(response.ordenes);
    }catch(error){
    console.log(error);
    }       
  } 






  cerrarDetalle(){
    this.ordenActual.set(null);
    this.componentesAgrupados.set([]);

  }

  async verDetalle(orden:OrdenMetrics){
    await this.onSelectOrder(orden);
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
     const responsePrestamo = await firstValueFrom(this._prestamoService.informacion(numero_orden));

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
