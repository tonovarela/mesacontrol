import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';

@Component({
  selector: 'order-metrics',
  imports: [],
  templateUrl: './order-metrics.component.html',
  styleUrl: './order-metrics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderMetricsComponent {

  order= input.required<OrdenMetrics>();

}
