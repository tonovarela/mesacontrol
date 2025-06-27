import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { ProduccionService } from '@app/services/produccion.service';
import { RegistroMuestraComponent } from '@app/shared/registro-muestra/registro-muestra.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { Detalle, EstadoMuestra } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-produccion',
  imports: [SearchMetricsComponent, CommonModule, PrimeModule, RegistroMuestraComponent,FormsModule],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class ProduccionComponent {
  public type = TypeSearchMetrics.PRODUCCION;
  private produccionService = inject(ProduccionService);
  private uiService = inject(UiService);
  private _currentOrder = signal<any>(null);
  public estadosMuestra =signal<EstadoMuestra[]>([]);
  public selectedMuestra = signal<Detalle | null>(null);
  public currentOrder = computed(() => this._currentOrder());

  async onSelectOrder(order: any) {        
    const { NoOrden: orden } = order;
    await this.loadDataOrder(orden);
  }

  async loadDataOrder(orden:string){
    const response = await firstValueFrom(this.produccionService.detalle(orden));
    const newData =response.detalle.map((item: Detalle) => ({
      ...item,
       voBo: item.voBo === '1' ? true : false, // Convertir el valor a booleano
    }));
      
    this._currentOrder.set(newData);
    this.estadosMuestra.set(response.estadoMuestras);
  }

  selectMuestra(muestra: any) {
    this.selectedMuestra.set(muestra);
  }


  onCloseDialog() {
    this.selectedMuestra.set(null);    
  }

  // Método para procesar las muestras
  onSaveMuestra(response :{muestra:Detalle, operador: string, supervisor: string}) {
    console.log('Muestra guardada:', response);
  }

  async cerrarMuestra(id_produccion: string) {
    // Aquí puedes implementar la lógica para cerrar la muestra    
    const  response = await this.uiService.mostrarAlertaConfirmacion("Cerrar Muestra", "¿Estás seguro de que deseas cerrar esta muestra?", "Cerrar", "Cancelar")
    if (!(response.isConfirmed)){
      return; // Si el usuario cancela, no hacemos nada
    }
    console.log('Muestra cerrada:', id_produccion);
    //const {orden }= this._currentOrder();
    //this.loadDataOrder(orden); // Recargar la orden para reflejar el cambio
    //this.loadDataOrder(id_produccion); // Recargar la orden para reflejar el cambio
    // Aquí podrías llamar a un servicio para actualizar el estado de la muestra
    // Por ejemplo, podrías hacer una llamada al servicio para actualizar el estado de la muestra
    this.selectedMuestra.set(null); // Limpiar la muestra seleccionada después de cerrarla
  }

}