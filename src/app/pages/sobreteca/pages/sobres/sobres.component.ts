import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoadingComponent } from '@app/shared/loading/loading.component';

@Component({
  selector: 'app-sobres',
  imports: [LoadingComponent],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default  class SobresComponent { }
