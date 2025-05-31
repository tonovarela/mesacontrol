import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, type OnInit, signal, ViewChild } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DetailRowService } from '@syncfusion/ej2-angular-grids'
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { Router, RouterModule } from '@angular/router';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent],
  templateUrl: './home.component.html',
  providers: [DetailRowService],
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit{


  protected minusHeight = 0;
  private metricsService = inject(MetricsService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);



  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);
  public router = inject(Router);
  public cargando = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public stackChecklist: any[] = [];
  public catalogoTiposProductos = [
    { id: "AUTOPOP", value: "Autopops" },
    { id: "BOL", value: "Bolsas" },
    { id: "CAG", value: "Catálogos / Folletos" },
    { id: "CD", value: "Calendarios" },
    { id: "EMPL", value: "Empaque Plegadizo" },
    { id: "EST", value: "Estuches" },
    { id: "ET", value: "Etiquetas" },
    { id: "FD", value: "Folder / Sobres" },
    { id: "LIB", value: "Libretas / Agendas" },
    { id: "MA", value: "Dipticos / Tripticos" },
    { id: "VIN", value: "Viniles / Floorgraphics" }
  ];

  constructor() {
    super();
  }

  puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);  

  ngOnInit(): void {
    this.autoFitColumns = false;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();
  }

  actualizarTipoProd(tipo: string) {
    this.ordenMetricsPorDefinir.update((ordenMetrics) => {
      if (!ordenMetrics) return null;
      return { ...ordenMetrics, TipoProd: tipo };
    });

  }


  onSelectOrder(ordenMetrics: OrdenMetrics | null) {
    if (!ordenMetrics) {
      return;
    }
    this.ordenMetricsPorDefinir.set(ordenMetrics);
  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      this._ordenesMetrics.set([]); // Limpiar la lista antes de cargar nuevos datos            
      const response = await firstValueFrom(this.metricsService.listar())      
      this._ordenesMetrics.set(response)      
    }
    catch (error) {
      console.error('Error al cargar la información:', error);
    }
    finally {
      this.cargando.set(false);
    }
  }

  ir(ruta: string, ordenMetrics: OrdenMetrics) {
    //console.log(ordenMetrics);    
    //TODO: Revisar si el usuario tiene permisos para hacer la revision del checklist
    //TODO: Guardar en el estado la ordenMetrics         
    this.router.navigate([`/checklist/${ruta}`]);
  }

  cerrarOrdenMetricsPorDefinir() {
    this.ordenMetricsPorDefinir.set(null);
  }

  async guardarOrdenMetricsPorDefinir() {    
    const ordenMetrics = this.ordenMetricsPorDefinir();
    console.log('Guardando ordenMetricsPorDefinir:', ordenMetrics);
    await firstValueFrom(this.metricsService.agregarOrden(ordenMetrics!));
    this.cargarInformacion();
    this.ordenMetricsPorDefinir.set(null);
  }

}
