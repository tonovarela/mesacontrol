import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenProduccionOmitida, PropsDetalleOmisiones } from '@app/interfaces/responses/ResponseProduccionOmitidas';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { TruncatePipe } from '@app/pipes/truncate.pipe';
import { ProduccionService } from '@app/services';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { firstValueFrom } from 'rxjs';
import { DetalleOmisiones } from '../../componentes/detalle-omisiones/detalle-omisiones';



@Component({
  selector: 'app-omisiones',
  imports: [LoadingComponent,SynfusionModule,DetalleOmisiones,TruncatePipe],
  templateUrl: './omisiones.component.html',
  styleUrl: './omisiones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OmisionesComponent  extends BaseGridComponent implements OnInit { 
  public produccionService = inject(ProduccionService);


  private _ordenes = signal<OrdenProduccionOmitida[]>([]); 
  private _detalleOmisiones = signal<PropsDetalleOmisiones>({omisiones: [], mc: []});  
  private _modalVisible = signal<boolean>(false);
  
  
  public ordenesOmitidas = computed(() => this._ordenes());
  public detalleOmisiones = computed(() => this._detalleOmisiones());  
  public modalVisible = computed(() => this._modalVisible());  
  public cargando = signal(false);


  ngOnInit(): void {    
    this.autoFitColumns=false;
    setTimeout(() => { this.iniciarResizeGrid(0.1)});    
    this.cargarInformacion();
  }

   constructor() {
    super();
  }

  async cargarInformacion() {        
    this.cargando.set(true);
    try{
    const resp =await firstValueFrom(this.produccionService.obtenerOmitidas());
    this._ordenes.set(resp.ordenes);
    }
    catch(error){
      console.error('Error al cargar las omisiones', error);
    }
    finally{
      this.cargando.set(false);
    }
  }

  async verDetalle(data: OrdenProduccionOmitida) {  
    try {
      const { ordenes_omisiones:omisiones, ordenes_mc:mc } = await firstValueFrom(this.produccionService.obtenerDetalleOmisiones(data.orden));
      this._detalleOmisiones.set({ omisiones,mc});      
      this._modalVisible.set(true);      
    } catch (error) {
      console.error('Error al cargar el detalle de omisiones', error);
    }
  }

  cerrarModal() {
    console.log('Cerrando modal de detalle de omisiones');
    this._modalVisible.set(false);
    this._detalleOmisiones.set({ omisiones: [], mc: [] });
  }

  registrarOrdenOmision(orden: string) {
    console.log('Registrando omisiones para la orden:', orden);
  }


}
