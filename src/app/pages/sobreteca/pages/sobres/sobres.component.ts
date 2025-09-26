import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

@Component({
  selector: 'app-sobres',
  imports: [
    SearchMetricsComponent
  //  LoadingComponent
  ],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default  class SobresComponent {

 public readonly type  = TypeSearchMetrics.SOBRESPREPRENSA;

 onSelectOrder(orden: OrdenMetrics | null) {
  if(orden === null) {
   // console.log("no hay orden seleccionada");
   return;
  }

  console.log("Orden seleccionada:", orden.NoOrden);
 }

 }
