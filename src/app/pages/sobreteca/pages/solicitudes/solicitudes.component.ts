import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

@Component({
  selector: 'app-solicitudes-sobre',
  imports: [SynfusionModule,SearchMetricsComponent],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit { 
  protected minusHeight = 0.3;
   private _activatedRouter = inject(ActivatedRoute);
   public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
   public readonly type = TypeSearchMetrics.SOBRESPREPRENSA
  constructor() {
    super();   
  }
  ngOnInit(): void {
      this.iniciarResizeGrid(this.minusHeight, true);
  }
}
