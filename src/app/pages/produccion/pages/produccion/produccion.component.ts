import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { environment } from '@environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { UiService, ProduccionService, UsuarioService } from '@app/services';
import {
  Detalle,
  EstadoMuestra,
  OrdenMetrics,
} from '@app/interfaces/responses/ResponseOrdenMetrics';
import { RegistroMuestraComponent } from '../../componentes/registro-muestra/registro-muestra.component';
import { RegistroMuestra } from '@app/interfaces/models/RegistroMuestra';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import {
  DetailRowService,
  TextWrapSettingsModel,
  RecordClickEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { CurrentOrder } from '@app/interfaces/models/CurrrentOrder';
import { DetalleProduccionComponent } from '../../componentes/detalle_produccion/detalle_produccion.component';
import { Muestra } from '@app/interfaces/responses/ResponseBitacoraMuestra';
import { ResponseBitacoraMuestra as BitacoraMuestra } from '../../../../interfaces/responses/ResponseBitacoraMuestra';

@Component({
  selector: 'app-produccion',
  imports: [
    RegistroMuestraComponent,
    SearchMetricsComponent,
    FormsModule,
    CommonModule,
    PrimeModule,
    SynfusionModule,
    DetalleProduccionComponent,
  ],
  templateUrl: './produccion.component.html',
  providers: [DetailRowService],
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProduccionComponent
  extends BaseGridComponent
  implements OnInit
{
  public estadosMuestra = signal<EstadoMuestra[]>([]);
  public selectedMuestra = signal<Detalle | null>(null);
  public currentDetail = computed(() => this._currentOrder()?.detalle || []);
  public currentOrder = computed(() => this._currentOrder()?.order || null);
  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public bitacoraMuestras = computed(() => this._bitacoraMuestras());
  public mostrarModalBitacora = signal(false);
  public cargando = signal(false);
  public cargandoDetalle = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public verPendientes = computed(() => this._verPendientes());
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  private _bitacoraMuestras = signal<BitacoraMuestra | null>(null);
  private produccionService = inject(ProduccionService);
  private usuarioService = inject(UsuarioService);
  private uiService = inject(UiService);
  private activatedRouter = inject(ActivatedRoute);
  private _currentOrder = signal<CurrentOrder | null>(null);
  private _verPendientes = signal<boolean>(true);
  protected minusHeight = 0.3;
  activeTab: string = 'tab1'; // Tab activo por defecto
  public type = TypeSearchMetrics.PRODUCCION;



  async onSelectOrder(order: any) {
    this._currentOrder.set({ order, detalle: [] });
    const { NoOrden: orden } = order;
    await this.loadDataOrder(orden);
    await this.cargarOrdenes();
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.iniciarResizeGrid(0.1, true);
    this.activatedRouter.data.subscribe((data) => {
      const pendientes = data['pendientes'] || false;
      this._verPendientes.set(pendientes);
      this.cargarOrdenes();
    });
  }

  onCellClick(args: RecordClickEventArgs): void {
    const {rowData:orden,  cellIndex} =  args;
   if (cellIndex !== 0) {
    return;
   }        
      this.onSelectOrder(orden);
  }

 

  async cargarOrdenes() {
    try {
      const response = await firstValueFrom(
        this.produccionService.listar(this._verPendientes())
      );
      this._ordenesMetrics.set(response.ordenes);
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al cargar las órdenes de producción',
        'No se pudo cargar la información de las órdenes de producción. Por favor, inténtelo más tarde.'
      );
    } finally {
      this.cargando.set(false);
      this.autoFitColumns = false;

    }
    
    setTimeout(() => this.iniciarResizeGrid(this.minusHeight));
  }

 async actualizarProduccionMetrics(orden:OrdenMetrics) {
    await firstValueFrom(this.produccionService.sincronizar(orden.NoOrden));
    await this.onSelectOrder(orden);
      
  }

  async loadDataOrder(orden: string) {
    this.cargandoDetalle.set(true);
    const response = await firstValueFrom(
      this.produccionService.detalle(orden)
    );
    const newData = response.detalle.map((item: Detalle) => ({
      ...item,
      trazo: item.trazo === '1' ? true : false, // Convertir el valor a booleano
      voBo: item.voBo === '1' ? true : false, // Convertir el valor a booleano
      carta_color: item.carta_color === '1' ? true : false, // Convertir el valor a booleano,
      puedeRegistrarOffset: item.proceso.includes('OFFSET'),
    }));
    this._currentOrder.update((orderModel) => {
      return { ...orderModel, detalle: newData };
    });
    this.cargandoDetalle.set(false);
    this.estadosMuestra.set(response.estadoMuestras);
  }

  onSelectMuestra(muestra: any) {
    this.selectedMuestra.set(muestra);
  }

  onCloseDialog() {
    this.selectedMuestra.set(null);
  }

  async onSaveMuestra(registro: RegistroMuestra) {
    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id;
    const { detalle, muestraRegistrada, operador, supervisor } = registro;
    const request = {
      id_produccion: detalle.id_produccion,
      id_operador: operador,
      id_supervisor: supervisor,
      id_usuario,
      muestra: muestraRegistrada,
    };
    try {
      await firstValueFrom(this.produccionService.registrarMuestra(request));
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al registrar muestra',
        'No se pudo registrar la muestra. Inténtalo de nuevo más tarde.'
      );
    }
  }

  async cerrarMuestra(id_produccion: string) {
    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
    const request = { id_produccion, id_usuario: `${id_usuario}` };
    const response = await this.uiService.mostrarAlertaConfirmacion(
      'Finalizar  Muestra',
      '¿Estás seguro de que deseas finalizar el registro de esta muestra?',
      'Si, finalizarla',
      'Cancelar'
    );
    if (!response.isConfirmed) {
      return;
    }
    await firstValueFrom(this.produccionService.finalizarMuestra(request));
    const orden = this.currentDetail()[0].orden_metrics;
    await this.loadDataOrder(orden);
    this.selectedMuestra.set(null);
  }

 

 

  async change(id_produccion: string, event: boolean, tipo:string) {
    switch (tipo) {
      case 'trazo':
        await this.onChangeTrazo(id_produccion, { target: { checked: event } });
        break;
      case 'voBo':
        await this.onChangeVoBo(id_produccion, { target: { checked: event } });
        break;
      case 'carta':
        await this.onChangeCarta(id_produccion, { target: { checked: event } });
        break;
      default:
        console.warn(`Tipo desconocido: ${tipo}`);
        break;
    }
    
  }
    

  private async onChangeTrazo(id_produccion: string, event: any) {
    const checked = event.target.checked;
    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
    try {
      await firstValueFrom(
        this.produccionService.actualizarTrazo(
          id_produccion,
          checked,
          `${id_usuario}`
        )
      );
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al actualizar trazo',
        'No se pudo actualizar el estado de trazo. Inténtalo de nuevo más tarde.'
      );
    }
  }

  private async onChangeVoBo(id_produccion: string, event: any) {
    const checked = event.target.checked;
    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
    try {
      await firstValueFrom(
        this.produccionService.actualizarVoBo(
          id_produccion,
          checked,
          `${id_usuario}`
        )
      );
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al actualizar VoBo',
        'No se pudo actualizar el estado de VoBo. Inténtalo de nuevo más tarde.'
      );
    }
  }


  private async onChangeCarta(id_produccion: string, event: any) {    
   const checked = event.target.checked;            
   const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
   try {
     await firstValueFrom(
       this.produccionService.actualizarCarta(
         id_produccion,
         checked,
         `${id_usuario}`
       )
     );
     const orden = this.currentDetail()[0].orden_metrics;
     await this.loadDataOrder(orden);
   } catch (error) {
     this.uiService.mostrarAlertaError('Error al actualizar Carta Color','No se pudo actualizar el estado de Carta Color. Inténtalo de nuevo más tarde.');
   }


}

  async onVerHistorial(detalle: any) {
    const { id_produccion } = detalle;
    try {
      const response = await firstValueFrom(
        this.produccionService.obtenerBitacoraMuestra(id_produccion)
      );
      const BASE_AVATAR_URL = environment.baseAvatarUrl;
      const muestras = response.muestras.map((muestra: Muestra) => {
        return {
          ...muestra,
          avatarOperador: `${BASE_AVATAR_URL}/${muestra.id_operador}`,
          avatarSupervisor: `${BASE_AVATAR_URL}/${muestra.id_supervisor}`,
        };
      });

      this._bitacoraMuestras.set({ ...response, muestras });
      this.mostrarModalBitacora.set(true); // Mostrar el modal
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al cargar historial',
        'No se pudo cargar el historial de la muestra. Inténtalo de nuevo más tarde.'
      );
    }
  }
}
