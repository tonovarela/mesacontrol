import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenProduccionOmitida } from '@app/interfaces/responses/ResponseProduccionOmitidas';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { TruncatePipe } from '@app/pipes/truncate.pipe';
import { ProduccionService } from '@app/services';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-omisiones',
  imports: [LoadingComponent,SynfusionModule,TruncatePipe],
  templateUrl: './omisiones.component.html',
  styleUrl: './omisiones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OmisionesComponent  extends BaseGridComponent implements OnInit { 


  private _ordenes = signal<OrdenProduccionOmitida[]>([]); 
  produccionService = inject(ProduccionService);
  ordenesOmitidas= computed(() => this._ordenes());
  
  cargando = signal(false);

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

  async verDetalle(data:OrdenProduccionOmitida){
      const resp = await firstValueFrom(this.produccionService.obtenerDetalleOmisiones(data.orden));
      console.log('Detalle de omisiones para la orden ',data.orden, resp);
    
  }


}
