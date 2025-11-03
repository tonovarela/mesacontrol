import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenOmision } from '@app/interfaces/responses/ResponseOmitidas';

import { SynfusionModule } from '@app/lib/synfusion.module';
import { TruncatePipe } from '@app/pipes/truncate.pipe';
import { PreprensaService } from '@app/services';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-omisiones',
  imports: [SynfusionModule,TruncatePipe,LoadingComponent],
  templateUrl: './omisiones.component.html',
  styleUrl: './omisiones.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Omisiones extends BaseGridComponent implements OnInit {

  protected minusHeight = 0.1;
  cargando = signal<boolean>(false);
  public wrapSettings?: TextWrapSettingsModel;
  ordenesOmitidas = computed(() =>  this._ordenes());
  private _ordenes = signal<OrdenOmision[]>([]);
  prePrensaService = inject(PreprensaService);

  ngOnInit(): void {
    this.autoFitColumns = false;
    setTimeout(() => { this.iniciarResizeGrid(this.minusHeight)});    
    this.cargarInformacion();
  }

  constructor() {
    super();
  }


  async cargarInformacion(){
    this.cargando.set(true);
    try {
    const response =await firstValueFrom( this.prePrensaService.obtenerOmisiones());
    this._ordenes.set(response.ordenes);  
    }catch(error){
      console.error('Error al cargar omisiones', error);
    }finally{
      this.cargando.set(false);
    }
    
  }

  definirOrden(ordenOmision:OrdenOmision){
    const {orden } = ordenOmision;

  }

}
