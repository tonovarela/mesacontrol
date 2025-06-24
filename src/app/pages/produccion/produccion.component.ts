import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';


@Component({
  selector: 'app-produccion',
  imports: [SearchMetricsComponent],
  templateUrl: './produccion.component.html',
  styleUrl: './produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProduccionComponent { 

   public type= TypeSearchMetrics.PRODUCCION;
  onSelectOrder(order?: OrdenMetrics ): void {    
    console.log('Selected order:', order);
    // Aquí puedes manejar la orden seleccionada, por ejemplo, enviarla a un servicio o
  }
}
