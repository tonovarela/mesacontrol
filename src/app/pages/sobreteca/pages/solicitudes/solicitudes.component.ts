import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';

import { TruncatePipe } from '@app/pipes/truncate.pipe';
import { MetricsService, PrestamoSobreService, SobreService, UiService, UsuarioService } from '@app/services';
import { LoginLitoapps } from '@app/utils/loginLitoapps';
import { BitacoraEventoComponent } from '../../componentes/bitacora-evento/bitacora-evento.component';
import { SobreDetalleComponent } from '../../componentes/sobre-detalle/sobre-detalle.component';
import { Bitacora, ComponenteAgrupado, Solicitante } from '../../interface/interface';

interface OrdenPrestamo  extends OrdenMetrics {
  enPrestamo:boolean,

  solicitante?:Solicitante
}

@Component({
  selector: 'app-solicitudes-sobre',
  imports: [SynfusionModule,SearchMetricsComponent,CommonModule,PrimeModule,FormsModule,BitacoraEventoComponent,SobreDetalleComponent,TruncatePipe,SearchMetricsComponent],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',  
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit { 
  
  protected minusHeight = 0.3;   
  private _uiService= inject(UiService);
  private _activatedRouter = inject(ActivatedRoute);
  private _sobreService = inject(SobreService);
  private _prestamoService  =  inject(PrestamoSobreService);
  private _usuarioService = inject(UsuarioService);
  private _metricsService = inject(MetricsService);
  private _ordenes = signal<any[]>([]);

  public puedePrestarseOp  = computed(() => {
     return this._puedePrestarseOp();
  });

  private _puedePrestarseOp = signal<boolean>(false);
  



  
  public ordenBaja = signal<string | null>(null);
  public tipoMaterialSeleccionado = signal<string>(''); // Cambiar de null a string vacío
  public estatusAsociacion = signal({asociando:false,op:''});
  public opPorAsociar = signal<OrdenMetrics | null>(null);  

  public typeSearch = TypeSearchMetrics.PREPRENSA;
  

  public bitacoraSobre = signal<Bitacora[]>([]);
  public mostrarBitacora = signal(false)
  public tieneOrdenSeleccionada = computed(() => this.ordenActual() !== null);  
  public ordenActual = signal<OrdenPrestamo | null>(null);
  public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);  
  public verSobresActivos  =computed(()=> this._activatedRouter.snapshot.data['activos'] ?? true);
  public ordenes = computed(()=>{return this._ordenes();});
  public readonly type = TypeSearchMetrics.CON_GAVETA_ASIGNADA;
  public componentesAgrupados = signal<ComponenteAgrupado[]>([]);    

  public catalogoTiposProductos = computed(() => this._metricsService.TipoMateriales());


  // Propiedades para la edición de vigencia
  public editandoVigencia = signal<string | null>(null);
  public nuevaVigencia = signal<string>('');
   
  
  constructor() {
    super();   
  }

  ngOnInit(): void {
    this.autoFitColumns=false;
    this.iniciarResizeGrid(this.minusHeight, true);  
    this.cargarInformacion();        
  }


  async cargarInformacion(){

    try {
    const response =await firstValueFrom( this._sobreService.conGaveta(this.verSobresActivos()));
    const ordenes = response.ordenes.map(orden=>({...orden,enPrestamo:orden.enPrestamo==="1"}))    
    this._ordenes.set(ordenes);    
    }catch(error){
    console.log(error);
    }       
  } 


  cerrarDetalle(){
    this.ordenActual.set(null);
    this.componentesAgrupados.set([]);
    this._puedePrestarseOp.set(false);
  }

  async verDetalle(orden:OrdenMetrics){
    await this.onSelectOrder(orden);
  }

  public async onSelectOrder(orden: OrdenMetrics | null) {
    if (!orden) {
      return;
    }  
    const tieneGaveta = orden?.no_gaveta && orden.no_gaveta > 0;

    if (!tieneGaveta) {
      this._uiService.mostrarAlertaError('',`El sobre con la orden ${orden.NoOrden} no tiene gaveta asignada, por favor asignar antes de continuar`);
      return;
    }    
     const numero_orden = orden.NoOrden;
     const responseOrden = await firstValueFrom(this._sobreService.contenido(numero_orden));
     const { enPrestamo, solicitante } = await firstValueFrom(this._prestamoService.informacion(numero_orden));
     this._puedePrestarseOp.set(responseOrden.activo);     
     const contenido = responseOrden.contenido.map((item:any) => ({...item,a: item.aplica == '1'}));
     this.ordenActual.set({...orden,enPrestamo,solicitante});                                                                
     if (contenido.length > 0) {
        const componentes = new Set([ ...contenido.map((item) => item.componente)]);   
        const componentesAgrupado=  Array.from(componentes).map((componente) => ({  nombre:componente, elementos :  contenido.filter((item) => item.componente === componente) }));
        this.componentesAgrupados.set(componentesAgrupado);
     }          
  }


   public async solicitarPrestamo(){

    const { NoOrden:orden } = this.ordenActual()!;    
    const {value:id_usuario, isDismissed} = await LoginLitoapps(this._usuarioService,"Login del usuario para solicitar préstamo");    
    if (isDismissed) {
      return;
    }    
    
    try{

      await firstValueFrom(this._prestamoService.prestar(orden,id_usuario!));      
      this._uiService.mostrarAlertaSuccess("",'Solicitud de préstamo realizada con éxito');
      this.cargarInformacion();      
      this.ordenActual.set(null);

    }catch(error){
      console.log(error);
    }
    
     
  }

   public async devolverPrestamo(){

     const { NoOrden:orden,no_gaveta } = this.ordenActual()!;
     const id_usuario = this._usuarioService.StatusSesion().usuario?.id;         

    try {

      await firstValueFrom(this._prestamoService.devolver(orden,id_usuario!,this.ordenActual()!.solicitante!.id_prestamo));      
      this._uiService.mostrarAlertaSuccess("",'Devolución de préstamo realizada con éxito, el sobre ya debera de colocarse en la gaveta '+no_gaveta);
      this.cargarInformacion();
      this.ordenActual.set(null);      

    }catch(error){

      console.log(error);

    } 

  }



   public async verBitacora(orden:string) {
    try {
      const response = await firstValueFrom(this._sobreService.bitacora(orden));
      const bitacora = response.bitacora;      
      this.bitacoraSobre.set(bitacora);
      this.mostrarBitacora.set(true);            
    } catch (error) {      
      this._uiService.mostrarAlertaError('', 'Error al cargar la bitácora');
    }
  }


  public cerrarBitacora() {
    this.mostrarBitacora.set(false);
    this.bitacoraSobre.set([]);
  }



  setVigencia(fecha:any){        
   this.nuevaVigencia.set(fecha.target.value);
}

  // Métodos para editar vigencia
  public iniciarEdicionVigencia(ordenNo: string, vigenciaActual: Date) {
    this.editandoVigencia.set(ordenNo);
    // Convertir fecha a formato YYYY-MM-DD para el input date
    const fecha = new Date(vigenciaActual);
    
    const fechaFormateada = fecha.toISOString().split('T')[0];    
    this.nuevaVigencia.set(fechaFormateada);
  }

  public cancelarEdicionVigencia() {
    this.editandoVigencia.set(null);
    this.nuevaVigencia.set('');
  }

  public async guardarVigencia(ordenNo: string) {
    if (!this.nuevaVigencia()) {
      this._uiService.mostrarAlertaError('', 'Debe seleccionar una fecha válida');
      return;
    }
    const id_usuario = this._usuarioService.StatusSesion().usuario?.id;          
    try {

      await firstValueFrom(this._sobreService.actualizarVigencia(ordenNo, this.nuevaVigencia(), id_usuario!.toString()));      
      this._uiService.mostrarAlertaSuccess('', 'Vigencia actualizada correctamente');
      this.cancelarEdicionVigencia();
      this.cargarInformacion(); // Recargar datos

    } catch (error) {
      console.log(error);
      this._uiService.mostrarAlertaError('', 'Error al actualizar la vigencia');
    }
  }

  

  public async darDeBajaSobre(ordenNo: string) {    
    this.ordenBaja.set(ordenNo);      
    this.estatusAsociacion.set({asociando:false,op:''});
    this.opPorAsociar.set(null);
  }


  public async confirmarBajaSobre(){
    const ordenNo = this.ordenBaja();
    if (!ordenNo) {
      return;
    }
    try {
      const id_usuario = this._usuarioService.StatusSesion().usuario?.id;          
      await firstValueFrom(this._sobreService.eliminar(ordenNo, id_usuario!.toString()));      
      this._uiService.mostrarAlertaSuccess('', `El sobre con orden ${ordenNo} ha sido dado de baja correctamente`);
      this.cargarInformacion(); 
      this.ordenBaja.set(null);
    } catch (error) {
      console.log(error);
      this._uiService.mostrarAlertaError('', 'Error al dar de baja el sobre');
    }
  }

  public cerrarBajaSobre(){
    this.ordenBaja.set(null);
  }

  public asociarOrden(){
    
    const ordenBaja = this.ordenBaja();  
    this.estatusAsociacion.set({asociando:true,op:ordenBaja!});
    this.cerrarBajaSobre();


  }

  public cerrarAsociacionOP(){
    this.estatusAsociacion.set({asociando:false,op:''});
  }


  public onAsociarOrder(orden:OrdenMetrics | null){
    if (!orden){
      return;
    }
    this.opPorAsociar.set(orden);

  }

  public async confirmarAsociacionOP(){
    const ordenBaja = this.estatusAsociacion().op;
    const { NoOrden:ordenAsociada, TipoProd:tipoProd} = this.opPorAsociar()!;
    const id_usuario = this._usuarioService.StatusSesion().usuario?.id;
    try{
      await firstValueFrom(this._sobreService.asociar(ordenBaja,ordenAsociada, tipoProd, `${id_usuario}`));
      await firstValueFrom(this._sobreService.eliminar(ordenBaja, `${id_usuario}`));  
      this._uiService.mostrarAlertaSuccess('',`La orden de producción ${ordenAsociada} ha sido asociada correctamente a la orden ${ordenBaja}`);    
    }catch(error){
      this._uiService.mostrarAlertaError("","No se pude asociar la orden");
    }
    
     this.cerrarAsociacionOP();
     this.cargarInformacion();

  }



  
}


