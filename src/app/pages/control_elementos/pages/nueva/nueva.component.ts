import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

@Component({
  selector: 'app-nueva',
  imports: [SearchMetricsComponent],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevaComponent { }
