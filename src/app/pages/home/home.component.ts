import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService, UiService, CheckListService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DetailRowService } from '@syncfusion/ej2-angular-grids'
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { Router, RouterModule } from '@angular/router';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { columnas } from './data/columnas';


@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent],
  templateUrl: './home.component.html',
  providers: [DetailRowService],
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit {


  protected minusHeight = 0;
  private metricsService = inject(MetricsService);
  public checkListService = inject(CheckListService);
  private uiService = inject(UiService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);

  public puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);
  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);


  public router = inject(Router);
  public cargando = signal(false);
  public guardandoOrdenMetrics = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  
  public catalogoTiposProductos= computed(() => this.metricsService.TipoMateriales());
  constructor() {
    super();
    this.checkListService.removeActiveCheckList();
  }

  columnasAuditoria = columnas;


  fechaLiberacion(data: any,col:any)  {
    return col.obtenerFechaLiberacion(data);
  }


  colorChecklist(data: any, col: any): string {
    return col.colorImagen(data);
  }
  getCheckListKey(data: any, col: any): string {
    return col.getCheckListKey(data);
  }

  esAuditHabilitado(data: any, col: any): boolean {
    if (data.id_estado == "2") {
      return false;
    }
    return col.check(data);
  }


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
      this._ordenesMetrics.set(response.ordenes)
    }
    catch (error) {
      this.uiService.mostrarAlertaError('Error al cargar la información', 'No se pudo cargar la información de las órdenes de métricas. Por favor, inténtelo más tarde.');
    }
    finally {
      this.cargando.set(false);
    }
  }

  async ir(ordenMetrics: OrdenMetrics,actual: {id_checkActual: string, liberacion?: Date}) {    
    const { id_checkActual, liberacion } = actual;

    const {  id_checklist_actual } = ordenMetrics    
    this.checkListService.currentMetricsOP.set(ordenMetrics);
    if (liberacion){
      this.checkListService.id_checkListCurrent = id_checkActual;    
    }else{
      this.checkListService.id_checkListCurrent = id_checklist_actual;
    }    
    //console.log(ordenMetrics);
    await this.checkListService.loadChecklist();
    //TODO: Revisar si el usuario tiene permisos para hacer la revision del checklist
    //TODO: Guardar en el estado la ordenMetrics             
    this.router.navigate([`/rollcall`]);
    
  }

  cerrarOrdenMetricsPorDefinir() {
    this.ordenMetricsPorDefinir.set(null);
  }

  async guardarOrdenMetricsPorDefinir() {
    this.guardandoOrdenMetrics.set(true);
    const ordenMetrics = this.ordenMetricsPorDefinir();
    await firstValueFrom(this.metricsService.agregarOrden(ordenMetrics!));
    this.guardandoOrdenMetrics.set(false);
    this.cargarInformacion();
    this.ordenMetricsPorDefinir.set(null);
  }

}
