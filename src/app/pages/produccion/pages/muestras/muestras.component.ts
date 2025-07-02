import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RegistroMuestraComponent } from '../../componentes/registro-muestra/registro-muestra.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from '@app/lib/prime.module';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { RegistroMuestra } from '@app/interfaces/models/RegistroMuestra';
import { OrdenMetrics, EstadoMuestra, Detalle } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { ProduccionService, UsuarioService, UiService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CurrentOrder } from '@app/interfaces/models/CurrrentOrder';


@Component({
  selector: 'app-muestras',
  imports: [RegistroMuestraComponent, FormsModule, CommonModule, PrimeModule],
  templateUrl: './muestras.component.html',  
  styleUrl: './muestras.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MuestrasComponent extends BaseGridComponent implements OnInit {
  

  public ordenesMetrics = computed(() => this._ordenesMetrics());
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);

  public cargando = signal(false);
  protected minusHeight = 0.30;
  public wrapSettings?: TextWrapSettingsModel;


  public type = TypeSearchMetrics.PRODUCCION;
  private produccionService = inject(ProduccionService);
  private usuarioService = inject(UsuarioService);
  private uiService = inject(UiService);
  private _currentOrder = signal<CurrentOrder | null>(null);
  public estadosMuestra = signal<EstadoMuestra[]>([]);
  public selectedMuestra = signal<Detalle | null>(null);
  public currentDetail = computed(() => this._currentOrder()?.detalle || []);
  public currentOrder = computed(() => this._currentOrder()?.order || null);



  async onSelectOrder(order: any) {        
    this._currentOrder.set({
      order,
      detalle: []
    });
    const { NoOrden: orden } = order;
    await this.loadDataOrder(orden);
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

public detailDataBound(element: any): void {  
  console.log('Detail data bound:', element.data);
  this.onSelectOrder(element.data);  
}



  async cargarOrdenes() {
    this.cargando.set(true);    
    try {
      const response = await firstValueFrom(this.produccionService.listar());
      this._ordenesMetrics.set(response.ordenes);
    } catch (error) {
      this.uiService.mostrarAlertaError('Error al cargar las órdenes de producción', 'No se pudo cargar la información de las órdenes de producción. Por favor, inténtelo más tarde.');
    }
    finally {
      this.cargando.set(false);
    }
    this.autoFitColumns = false;    
    setTimeout(() => {
      this.iniciarResizeGrid(this.minusHeight);    
    });


  }

  async loadDataOrder(orden: string) {
    const response = await firstValueFrom(this.produccionService.detalle(orden));
    const newData = response.detalle.map((item: Detalle) => ({
      ...item,
      voBo: item.voBo === '1' ? true : false, // Convertir el valor a booleano
    }));
    this._currentOrder.update(orderModel => { return { ...orderModel, detalle: newData } });
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
    const { detalle, muestraRegistrada, operador, supervisor, } = registro
    const request = {
      id_produccion: detalle.id_produccion,
      id_operador: operador,
      id_supervisor: supervisor,
      id_usuario,
      muestra: muestraRegistrada
    };

    try {
      await firstValueFrom(this.produccionService.registrarMuestra(request));
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    } catch (error) {
      this.uiService.mostrarAlertaError("Error al registrar muestra", "No se pudo registrar la muestra. Inténtalo de nuevo más tarde.");
    }

  }


  async cerrarMuestra(id_produccion: string) {

    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
    const request = { id_produccion, id_usuario: `${id_usuario}` };
    const response = await this.uiService.mostrarAlertaConfirmacion("Finalizar  Muestra", "¿Estás seguro de que deseas finalizar el registro de esta muestra?", "Si, finalizarla", "Cancelar")
    if (!(response.isConfirmed)) { return; }
    await firstValueFrom(this.produccionService.finalizarMuestra(request));
    const orden = this.currentDetail()[0].orden_metrics;
    await this.loadDataOrder(orden);
    this.selectedMuestra.set(null);

  }


  async onChangeVoBo(id_produccion: string, event: any) {

    const checked = event.target.checked;
    try {
      await firstValueFrom(this.produccionService.actualizarVoBo(id_produccion, checked));
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    } catch (error) {

      this.uiService.mostrarAlertaError("Error al actualizar VoBo", "No se pudo actualizar el estado de VoBo. Inténtalo de nuevo más tarde.");

    }

  }
}
