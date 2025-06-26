import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { ProduccionService } from '@app/services/produccion.service';
import { RegistroMuestraComponent } from '@app/shared/registro-muestra/registro-muestra.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { Detalle } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { firstValueFrom } from 'rxjs';
// interface Operador {
//   NoOperador: string;
//   Nombre: string;
//   Avatar: string;
// }
@Component({
  selector: 'app-produccion',
  imports: [SearchMetricsComponent, CommonModule, PrimeModule, RegistroMuestraComponent],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export default class ProduccionComponent {
  public type = TypeSearchMetrics.PRODUCCION;

  private produccionService = inject(ProduccionService);
  private _currentOrder = signal<any>(null);
  
  selectedMuestra = signal<Detalle | null>(null);


  currentOrder = computed(() => this._currentOrder());

  async onSelectOrder(order: any) {
    const { NoOrden: orden } = order;
    const response = await firstValueFrom(this.produccionService.detalle(orden));
    this._currentOrder.set(response.detalle);
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

}