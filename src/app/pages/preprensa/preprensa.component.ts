import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService, UiService, CheckListService, PdfService, UsuarioService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {  TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DetailRowService } from '@syncfusion/ej2-angular-grids'
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Type, ViewChild } from '@angular/core';
import { columnas } from '../data/columnas';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { formatDate } from '../../utils/formatDate';


@Component({
  selector: 'app-preprensa',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent],
  templateUrl: './preprensa.component.html',
  providers: [DetailRowService],
  styleUrl: './preprensa.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PreprensaComponent extends BaseGridComponent implements OnInit  {
  
  public type= TypeSearchMetrics.PREPRENSA;
  protected minusHeight = 0.30;
  private metricsService = inject(MetricsService);
  private checkListService = inject(CheckListService);
  private pdfService = inject(PdfService);
  private uiService = inject(UiService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  private _verPendientes= signal<boolean>(true);
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);
 private usuarioService = inject(UsuarioService);

  public puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);
  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public verPendientes = computed(() => this._verPendientes());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);
  public cargando = signal(false);
  public guardandoOrdenMetrics = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public catalogoTiposProductos= computed(() => this.metricsService.TipoMateriales());

  public titulo = signal<string>('');

  constructor() {
    super();
    this.checkListService.removeActiveCheckList();
  }

  columnasAuditoria = columnas;


  
  async descargarPDF(data: any) {
    
    let liberacionesCheckList =this.columnasAuditoria.map((col) => {
      const date = this.fechaLiberacion(data, col);
      return !date? null : formatDate(date);      
    });      
    await this.pdfService.obtenerPDF( {
      numero_orden: data?.NoOrden || '',
      nombre_trabajo: data?.NombreTrabajo || '',
      cliente: data?.NombreCliente || '',
      fecha_liberacion:liberacionesCheckList,
      usuario: this.usuarioService.StatusSesion()?.usuario?.nombre || ''      
    });
    
  }


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
    setTimeout(() => {
      this.iniciarResizeGrid(this.minusHeight);    
    });
    
    this.activatedRouter.data.subscribe((data) => {
      this.titulo.set(data['titulo'] || '');
      const pendientes = data['pendientes'] || false;      
      this._verPendientes.set(pendientes);
      this.cargarInformacion();            
    });
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
      const response = await firstValueFrom(this.metricsService.listar(this.verPendientes()))
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
