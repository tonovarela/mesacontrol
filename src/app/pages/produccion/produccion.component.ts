import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  onSelectOrder(order: any): void {
  }
}
