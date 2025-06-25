import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { ProduccionService } from '@app/services/produccion.service';
import { SearchEmployeeComponent } from '@app/shared/search-employee/search-employee.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-produccion',
  imports: [SearchMetricsComponent,SearchEmployeeComponent,CommonModule],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProduccionComponent { 

   public type= TypeSearchMetrics.PRODUCCION;

   private produccionService = inject(ProduccionService);
   private _currentOrder = signal<any>(null);
   


   currentOrder = computed(() => this._currentOrder());
   

async  onSelectOrder(order: any  ) {    
    const {NoOrden:orden} = order;            
    const response =await firstValueFrom(this.produccionService.detalle(orden));    
    this._currentOrder.set(response.detalle);    
    
  }


// mostrarla en la interfaz de usuario.
  onSelectOperador(employee: any): void {
    console.log('Selected employee:', employee);
    // Aquí puedes manejar el empleado seleccionado, por ejemplo, enviarlo a un servicio o
    // mostrarlo en la interfaz de usuario.
  }

  onSelectSupervisor(employee: any): void {
    console.log('Selected employee:', employee);
    // Aquí puedes manejar el empleado seleccionado, por ejemplo, enviarlo a un servicio o
    // mostrarlo en la interfaz de usuario.
  }
  
}