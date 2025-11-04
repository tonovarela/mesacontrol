import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
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

  public cargando = computed(() => this._cargando());  
  public wrapSettings?: TextWrapSettingsModel;
  public ordenesOmitidas = computed(() =>  this._ordenes());

  private _cargando = signal<boolean>(false);  

  private _router = inject(Router);
  private _ordenes = signal<OrdenOmision[]>([]);
  private _prePrensaService = inject(PreprensaService);

  ngOnInit(): void {
    this.autoFitColumns = false;
    setTimeout(() => { this.iniciarResizeGrid(this.minusHeight)});    
    this.cargarInformacion();
  }

  constructor() {
    super();
  }


  async cargarInformacion(){
    this._cargando.set(true);
    try {      

    const response =await firstValueFrom( this._prePrensaService.obtenerOmisiones());
    this._ordenes.set(response.ordenes);  
    } catch(error){
      console.error('Error al cargar omisiones', error);
    }finally{
      this._cargando.set(false);
    }    
  }

public definirOrden(ordenOmision:OrdenOmision){
    const {orden } = ordenOmision;
    this._prePrensaService.setOrdenPorDefinir(orden);
    this._router.navigate(['/preprensa'] );    
}

}
