// Angular Core
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Angular Router
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// RxJS
import { firstValueFrom } from 'rxjs';
// Syncfusion
import { TextWrapSettingsModel, DetailRowService } from '@syncfusion/ej2-angular-grids';
// Módulos y Librerías
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
// Componentes Base
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
// Servicios
import { MetricsService, UiService, CheckListService, PdfService, UsuarioService } from '@app/services';
// Interfaces y Tipos
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
// Componentes
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { RollcallModalComponent } from '@app/pages/components/rollcall.modal/rollcall.modal.component';
import { LiberacionModalComponent } from '../components/liberacion.modal/liberacion.modal.component';
// Data y Utilities
import { columnas } from '../data/columnas';
import { formatDate } from '../../utils/formatDate';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { PdfComponent } from '@app/shared/svg/pdf/pdf.component';
import { LoadingComponent } from '@app/shared/loading/loading.component';



@Component({
  selector: 'app-preprensa',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent,RollcallModalComponent,LiberacionModalComponent, TruncatePipe,PdfComponent,LoadingComponent],
  templateUrl: './preprensa.component.html',
  providers: [DetailRowService],
  styleUrl: './preprensa.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PreprensaComponent extends BaseGridComponent implements OnInit {

  public type = TypeSearchMetrics.PREPRENSA;
  protected minusHeight = 0.30;
  private metricsService = inject(MetricsService);
  private _ordenLiberacion =  signal<OrdenMetrics | null>(null);
  private checkListService = inject(CheckListService);
  private pdfService = inject(PdfService);
  private uiService = inject(UiService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  private _verPendientes = signal<boolean>(true);
  private router = inject(Router);
  private activatedRouter = inject(ActivatedRoute);
  private usuarioService = inject(UsuarioService);
  public mostrarCheckList  = computed(()=>this.checkListService.checkList() !==null);
  public puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);
  public ordenesMetrics = computed(() => {    
    const ordenes= this._ordenesMetrics().map( (orden:any) =>{
      let sePuedeVisualizarSobre =false;
      if (orden.estadoRutas !== null) {
        sePuedeVisualizarSobre= true;
      }
      if (orden.id_estado ==='2' && orden.estadoRutas === null) {
        sePuedeVisualizarSobre=false;
      }      
      
      return { ...orden ,
        colorCheckListSobreLiberacion:this.colorLiberacion(orden.estadoRutas),
        sePuedeVisualizarSobre 
      }
    });    
    return ordenes;
  }

);

  public ordenLiberacion = computed(()=> this._ordenLiberacion()?.NoOrden || '' );
  private colorLiberacion(id_estado: string): string {
  if (id_estado == "1" ) return 'fill-white py-1 rounded-full bg-purple-600';  
  if (id_estado == "2") return 'fill-white py-1 rounded-full bg-lime-700';
  if (id_estado == "3") return 'fill-white py-1 rounded-full bg-pink-600';
  if (id_estado == "4") return 'fill-white py-1 rounded-full bg-gray-400';
  if (id_estado == "5" ) return 'fill-white py-1 rounded-full bg-yellow-400';  
   return 'fill-gray-400';
    
  }
  public verPendientes = computed(() => this._verPendientes());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);
  public cargando = signal(false);
  public guardandoOrdenMetrics = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public catalogoTiposProductos = computed(() => this.metricsService.TipoMateriales());

  public titulo = signal<string>('');

  columnasAuditoria = columnas;


  constructor() {
    super();
    this.checkListService.removeActiveCheckList();

    effect(async() => {
      if (this.checkListService.checklistSaved()){         
        this._ordenesMetrics.set([]);
        this.grid.showSpinner();        
        const response = await firstValueFrom(this.metricsService.listar(this.verPendientes()))
        this.grid.hideSpinner();
        this._ordenesMetrics.set([...response.ordenes])
       }
  });    
  }


ngOnInit(): void {
    this.autoFitColumns = false;
    setTimeout(() => { this.iniciarResizeGrid(this.minusHeight) });
    this.activatedRouter.data.subscribe((data) => {
      this.titulo.set(data['titulo'] || '');
      const pendientes = data['pendientes'] || false;
      this._verPendientes.set(pendientes);
      this.cargarInformacion();
    });
  }
  
  async descargarPDF(data: any) {
    const { NoOrden }= data    
    const { orden, infoLiberacion,sobreContenido } =await firstValueFrom(this.metricsService.obtener(NoOrden));    
      
    const { usuarioLibero } = infoLiberacion!;    
    this.pdfService.descargarPDF(data,sobreContenido, usuarioLibero || '' );
  }

  fechaLiberacion(data: any, col: any) {
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
      this._ordenesMetrics.set([...response.ordenes])
    }
    catch (error) {
      this.uiService.mostrarAlertaError('Error al cargar la información', 'No se pudo cargar la información de las órdenes de métricas. Por favor, inténtelo más tarde.');
    }
    finally {
      this.cargando.set(false);
    }
  }

  irRutas(orden:OrdenMetrics){   
    this._ordenLiberacion.set(orden);    
  }


 

  async ir(ordenMetrics: OrdenMetrics, actual: { id_checkActual: string, liberacion?: Date }) {
    const { id_checkActual, liberacion } = actual;
    const { id_checklist_actual } = ordenMetrics;
    this.checkListService.currentMetricsOP.set(ordenMetrics);
    if (liberacion) {
      this.checkListService.id_checkListCurrent = id_checkActual;
    } else {
      this.checkListService.id_checkListCurrent = id_checklist_actual;
    }
    await this.checkListService.loadChecklist();    
  
  }

  cerrarModalCheckList(){
    this.checkListService.removeActiveCheckList();
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




    mostrarModalLiberacion = computed(()=>{

      return this._ordenLiberacion()!==null;

    });


  cerrarModalLiberacion(){
      this._ordenLiberacion.set(null);
  }
}
