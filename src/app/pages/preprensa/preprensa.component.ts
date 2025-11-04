// Angular Core
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Angular Router
import { ActivatedRoute, RouterModule } from '@angular/router';
// RxJS
import { firstValueFrom } from 'rxjs';
// Syncfusion
import { DetailRowService, TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
// Módulos y Librerías
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
// Componentes Base
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
// Servicios
import { CheckListService, MetricsService, PdfService, PreprensaService, UiService } from '@app/services';
// Interfaces y Tipos
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
// Componentes
import { RollcallModalComponent } from '@app/pages/components/rollcall.modal/rollcall.modal.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { LiberacionModalComponent } from '../components/liberacion.modal/liberacion.modal.component';
// Data y Utilities
import { columnas } from '../data/columnas';
//import { formatDate } from '../../utils/formatDate';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { PdfComponent } from '@app/shared/svg/pdf/pdf.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';



@Component({
  selector: 'app-preprensa',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent,RollcallModalComponent,LiberacionModalComponent, TruncatePipe,PdfComponent,LoadingComponent],
  templateUrl: './preprensa.component.html',
  providers: [DetailRowService],
  styleUrl: './preprensa.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PreprensaComponent extends BaseGridComponent implements OnInit {

  
  protected minusHeight = 0.30;

  private _metricsService = inject(MetricsService);
  private _ordenLiberacion =  signal<OrdenMetrics | null>(null);
  private _checkListService = inject(CheckListService);
  private _pdfService = inject(PdfService);
  private _uiService = inject(UiService);
  private _prePrensaService= inject(PreprensaService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  private _verPendientes = signal<boolean>(true);
  private _activatedRouter = inject(ActivatedRoute);     



  public type = TypeSearchMetrics.PREPRENSA;
  public mostrarModalLiberacion = computed(()=>this._ordenLiberacion()!==null);  
  public mostrarCheckList  = computed(()=>this._checkListService.checkList() !==null);
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
        colorCheckListSobreLiberacion: this._colorLiberacion(orden.estadoRutas),
        sePuedeVisualizarSobre 
      }
    });    
    return ordenes;
  }

);

  public ordenLiberacion = computed(()=> this._ordenLiberacion()?.NoOrden || '' );

  


  public verPendientes = computed(() => this._verPendientes());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);
  public cargando = signal(false);
  public guardandoOrdenMetrics = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public catalogoTiposProductos = computed(() => this._metricsService.TipoMateriales());

  public columnasAuditoria = columnas;
  public titulo = signal<string>('');

  
  constructor() {
    super();
    this._checkListService.removeActiveCheckList();

    if (this._prePrensaService.ordenPorDefinir()){
      this.cargarInformacionPorQueryParam(this._prePrensaService.ordenPorDefinir());
    }
    


    effect(async() => {
      if ( this._checkListService.checklistSaved()){                 
        this._ordenesMetrics.set([]);
        this.grid.showSpinner();        
        const response = await firstValueFrom(this._metricsService.listar(this.verPendientes()))
        this.grid.hideSpinner();
        this._ordenesMetrics.set([...response.ordenes])
       }
  });    
  }



  cargarInformacionPorQueryParam = async(orden:string|null) => {    
    if (orden) {
      const response = await firstValueFrom(this._metricsService.buscarPorPatron(orden));      
      const ordenMetrics = response.ordenes.find(o => o.NoOrden === orden);      
       if (ordenMetrics) {
        const existe =this.catalogoTiposProductos().some(tp => tp.value === ordenMetrics?.TipoProd);        
        this.ordenMetricsPorDefinir.set({...ordenMetrics,TipoProd: existe ? ordenMetrics.TipoProd : null});
         this.onSelectOrder(ordenMetrics);
      } else {
        this._uiService.mostrarAlertaError('Orden no encontrada', `No se encontró la orden con número ${orden}. Por favor, verifique el número e intente nuevamente.`);
      }
    }


  }


ngOnInit(): void {
    this.autoFitColumns = false;
    setTimeout(() => { this.iniciarResizeGrid(this.minusHeight) });
    this._activatedRouter.data.subscribe((data) => {
      this.titulo.set(data['titulo'] || '');
      const pendientes = data['pendientes'] || false;
      this._verPendientes.set(pendientes);
      this.cargarInformacion();
    });
  }
  
  async descargarPDF(data: any) {
    const { NoOrden }= data    
    const { infoLiberacion,sobreContenido } =await firstValueFrom(this._metricsService.obtener(NoOrden));    
      
    const { usuarioLibero } = infoLiberacion!;    
    this._pdfService.descargarMarbetePDF(data,sobreContenido, usuarioLibero || '' );
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
    const existe =this.catalogoTiposProductos().some(tp => tp.value === ordenMetrics?.TipoProd);        
    this.ordenMetricsPorDefinir.set({...ordenMetrics,TipoProd: existe ? ordenMetrics.TipoProd : null });
  }

  async cargarInformacion() {      
    if (this._prePrensaService.ordenPorDefinir()){
       return;
    }

    this.cargando.set(true);
    try {
      this._ordenesMetrics.set([]); // Limpiar la lista antes de cargar nuevos datos            
      const response = await firstValueFrom(this._metricsService.listar(this.verPendientes()))
      this._ordenesMetrics.set([...response.ordenes])
    }
    catch (error) {
      this._uiService.mostrarAlertaError('Error al cargar la información', 'No se pudo cargar la información de las órdenes de métricas. Por favor, inténtelo más tarde.');
    }
    finally {
      this.cargando.set(false);
    }
  }

  irRutas(orden:OrdenMetrics){   
    this._ordenLiberacion.set(orden);    
  }


  private _colorLiberacion(id_estado: string): string {
  if (id_estado == "1" ) return  'fill-white py-1 rounded-full bg-purple-600';  
  if (id_estado == "2")  return  'fill-white py-1 rounded-full bg-lime-700';
  if (id_estado == "3")  return  'fill-white py-1 rounded-full bg-pink-600';
  if (id_estado == "4")  return  'fill-white py-1 rounded-full bg-gray-400';
  if (id_estado == "5" ) return  'fill-white py-1 rounded-full bg-yellow-400';  
   return 'fill-gray-400';    
  }

  async ir(ordenMetrics: OrdenMetrics, actual: { id_checkActual: string, liberacion?: Date }) {
    const { id_checkActual, liberacion } = actual;
    const { id_checklist_actual } = ordenMetrics;
    this._checkListService.currentMetricsOP.set(ordenMetrics);
    if (liberacion) {
      this._checkListService.id_checkListCurrent = id_checkActual;
    } else {
      this._checkListService.id_checkListCurrent = id_checklist_actual;
    }
    await this._checkListService.loadChecklist();    
  
  }

  cerrarModalCheckList(){
    this._checkListService.removeActiveCheckList();
  }

  cerrarOrdenMetricsPorDefinir() {
    if (this._prePrensaService.ordenPorDefinir()){
      this._prePrensaService.setOrdenPorDefinir(null);
      this.cargarInformacion();
    }
    
    this.ordenMetricsPorDefinir.set(null);
  }

  async guardarOrdenMetricsPorDefinir() {
    this.guardandoOrdenMetrics.set(true);
    console.log('Guardando orden de métricas por definir...');
    console.log(this.ordenMetricsPorDefinir());    
     await new Promise(resolve => setTimeout(resolve,2000));
    // const ordenMetrics = this.ordenMetricsPorDefinir();
    // await firstValueFrom(this._metricsService.agregarOrden(ordenMetrics!));
    this.guardandoOrdenMetrics.set(false);
    this._prePrensaService.setOrdenPorDefinir(null);
    this.cargarInformacion();    
    this.ordenMetricsPorDefinir.set(null);
  }




  cerrarModalLiberacion(){
      this._ordenLiberacion.set(null);
  }
}
