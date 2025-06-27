import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';


import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { Detalle, EstadoMuestra, OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UiService, ProduccionService, UsuarioService } from '@app/services';
import { OrderMetricsComponent } from './componentes/order-metrics/order-metrics.component';
import { RegistroMuestraComponent } from './componentes/registro-muestra/registro-muestra.component';
import { RegistroMuestra } from '@app/interfaces/models/RegistroMuestra';


interface CurrentOrder {
  order?: OrdenMetrics,
  detalle: any[];
}

@Component({
  selector: 'app-produccion',
  imports: [RegistroMuestraComponent, SearchMetricsComponent, FormsModule, CommonModule, PrimeModule],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class ProduccionComponent {
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
      order: order,
      detalle: []
    });
    const { NoOrden: orden } = order;
    await this.loadDataOrder(orden);
  }

  async loadDataOrder(orden: string) {
    const response = await firstValueFrom(this.produccionService.detalle(orden));
    //console.log('Response from produccionService.detalle:', response);
    const newData = response.detalle.map((item: Detalle) => ({
      ...item,
      voBo: item.voBo === '1' ? true : false, // Convertir el valor a booleano
    }));
    this._currentOrder.update(orderModel => { return { ...orderModel, detalle: newData } });

    //this._currentOrder.update(orderModel => {...orderModel,detalle: newData});
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


    try{
      await firstValueFrom(this.produccionService.registrarMuestra(request));
      
      const orden = this.currentDetail()[0].orden_metrics;
      await this.loadDataOrder(orden);
    }catch(error) {     
      this.uiService.mostrarAlertaError("Error al registrar muestra", "No se pudo registrar la muestra. Inténtalo de nuevo más tarde.");
    
    }
    
  
  }


  async cerrarMuestra(id_produccion: string) {
    const id_usuario = this.usuarioService.StatusSesion()?.usuario?.id!;
    const request = { id_produccion, id_usuario:`${id_usuario}` };
    const response = await this.uiService.mostrarAlertaConfirmacion("Finalizar  Muestra", "¿Estás seguro de que deseas finalizar el registro de esta muestra?", "Si, finalizarla", "Cancelar")
    if (!(response.isConfirmed)) {return;}
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