
import { AfterViewInit, ChangeDetectionStrategy,Component,computed,inject,OnInit,signal,ViewChild,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { firstValueFrom, map } from 'rxjs';
import Swal from 'sweetalert2';


import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Autorizacion, DetalleSobre } from '@app/interfaces/responses/ResponseContenidoSobre';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { LoginLitoapps } from '@app/utils/loginLitoapps';

import { MetricsService,SobreService,UiService,UsuarioService} from '@app/services';
import { DetailDataBoundEventArgs, DetailRowService, Grid, GridComponent } from '@syncfusion/ej2-angular-grids';
import { CheckboxChangeEvent } from 'primeng/checkbox';

interface ComponenteAgrupado {
  nombre: string;
  elementos:any[];
}
@Component({
  selector: 'app-sobres',
  imports: [SynfusionModule,PrimeModule,CommonModule,FormsModule,SearchMetricsComponent,
   // LoadingComponent
  ],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css',
  providers:[DetailRowService],  
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class SobresComponent extends BaseGridComponent implements OnInit

{
  @ViewChild('dialogModal') dialogModal: any;

  public readonly type = TypeSearchMetrics.SOBRESPREPRENSA;
  public ordenActual = signal<OrdenMetrics | null>(null);

  public componentesAgrupados = signal<ComponenteAgrupado[]>([]);  
  public ordenes = computed(() => this._ordenes());
  public contenidoSobre = signal<any[]>([]);
  public tieneOrdenSeleccionada = computed(() => this.ordenActual() !== null);
  public verPendientes = computed(() => this._verPendientes());
  public titulo = computed(() => this._activatedRouter.snapshot.data['titulo']);
  public liberacionInfo = computed(() => {
    return this._autorizacion();
  });
  private _autorizacion = signal<Autorizacion | null>(null);
  private _verPendientes = signal<boolean>(true);
  private _sobreService = inject(SobreService);
  private _activatedRouter = inject(ActivatedRoute);
  private _uiService = inject(UiService);
  private _usuarioService = inject(UsuarioService);
  private _ordenes = signal<OrdenMetrics[]>([]);

  protected minusHeight = 0.3;

  constructor() {
    super();
  }


  ngOnInit(): void {
    this.iniciarResizeGrid(this.minusHeight, true);
    this._activatedRouter.data.subscribe((data:any) => {
      const pendientes = data['pendientes'] || false;
      this._verPendientes.set(pendientes);
      this.cargarInformacion();   
  });
  }

  public async verDetalle(orden: OrdenMetrics) {
    this.dialogModal.maximized = true;
    const response = await firstValueFrom(this._sobreService.contenido(orden.NoOrden));
    const contenido = response.contenido.map((item) => ({
      ...item,
      aplica: item.aplica == '1',
    }));
    this.ordenActual.set(orden);    
    this._autorizacion.set(response.autorizacion || null);
    this.contenidoSobre.set(contenido);

    if (contenido.length > 0) {
      const componentes = new Set([ ...contenido.map((item) => item.componente)]);   
     const componentesAgrupado=  Array.from(componentes).map((componente) => ({  nombre:componente, elementos :  contenido.filter((item) => item.componente === componente) }));
      this.componentesAgrupados.set(componentesAgrupado);
    }
 
  }

  public cerrarDetalle() {
    this.ordenActual.set(null);
  }

  public async onSelectOrder(orden: OrdenMetrics | null) {
    if (orden === null) {
      return;
    }
    try {
      const response = await firstValueFrom(
        this._sobreService.registrar(orden.NoOrden)
      );
      this.cargarInformacion();
    } catch (error) {
      console.error('Error al registrar el sobre:', error);
    } finally {
      await this.verDetalle(orden!);
    }
  }

  public async onCheckboxChange(id:string,aplica:string) {
    await firstValueFrom(this._sobreService.actualizarDetalle(id, aplica));
  }

  public estaEnAprobacion = computed(() => {
    if (this.ordenActual() === null) return false;
    return this.ordenActual()?.id_estado === '5';
  });

  public estaPendiente = computed(() => {
    if (this.ordenActual() === null) return false;
    return (
      this.ordenActual()?.id_estado === '1' ||
      this.ordenActual()?.id_estado === '3'
    );
  });

  async toggleGrupo(index: number, $event: CheckboxChangeEvent) {

    const { checked } = $event;      
    const componentesModificados = [...this.componentesAgrupados()];
    const grupoSeleccionado = componentesModificados[index];    
    if (!grupoSeleccionado) return;        
    const porModificar = grupoSeleccionado.elementos.map(item => item.id);        
    componentesModificados[index] = {
      ...grupoSeleccionado,
      elementos: grupoSeleccionado.elementos.map(item => ({
        ...item,
        aplica: checked
      }))
    };
    this.componentesAgrupados.set(componentesModificados);    
    for (const id of porModificar) {
       await this.onCheckboxChange(id, checked ? '1' : '0');
    }
    
  }

  public nombreTrabajo = computed(() => {
    if (this.ordenActual() === null) return '';
    return `${this.ordenActual()?.NoOrden}  - ${
      this.ordenActual()?.NombreTrabajo
    }`;
  });

  public async solicitarAprobacion() {

    const elementosRevision = this.componentesAgrupados().map(item =>{
      const tieneSoloUna = item.elementos.some((el:any) => el.aplica);
      return { grupo: item.nombre, tieneSoloUna };
    });    

    const algunGrupoSinSeleccion = elementosRevision.some(item => !item.tieneSoloUna);
    const gruposConSeleccionRequerida = elementosRevision.filter(item => !item.tieneSoloUna).map(item => item.grupo);
    if(algunGrupoSinSeleccion){
      this._uiService.mostrarAlertaError('',`Los componentes ${gruposConSeleccionRequerida.join(', ')} deben tener al menos un elemento seleccionado`);
      return;
    }

    const { isConfirmed } = await this._uiService.mostrarAlertaConfirmacion('','¿Está seguro de que desea solicitar la aprobación de las elementos seleccionadas?');
    if (!isConfirmed) {
      return;
    }
    const orden = this.ordenActual()?.NoOrden;
    try {
      const id_usuario = this._usuarioService.StatusSesion().usuario?.id || "1";
      await firstValueFrom(this._sobreService.solicitarAprobacion(orden!,`${id_usuario}`));
    } catch (error) {
      console.error('Error al solicitar la aprobación:', error);
    }
    this._uiService.mostrarAlertaSuccess('', 'Se han mandado a autorización ');
    this.cerrarDetalle();
    this.cargarInformacion();
    
  }

  public async rechazar() {
    const resp = await Swal.fire({
      title: 'Ingrese el motivo de rechazo',
      input: 'text',
      icon: 'info',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (motivo) => {
        return motivo;
      },
    });
    const { value: motivo, isDismissed } = resp;

    if (resp.isConfirmed && motivo?.length == 0) {
      this._uiService.mostrarAlertaError(
        '',
        'Se necesita ingresar un motivo para rechazar'
      );
      return;
    }
    if (isDismissed) {
      return;
    }
    const responseLogin = await LoginLitoapps(
      this._usuarioService,
      'Password de usuario que solicita el rechazo.'
    );
    if (responseLogin.isDismissed) {
      return;
    }
    const { value: id_usuario } = responseLogin;

    const orden = this.ordenActual()?.NoOrden;
    await firstValueFrom(this._sobreService.rechazar(orden!, motivo!,`${id_usuario!}`));
    this._uiService.mostrarAlertaSuccess(
      '',
      'Se ha rechazado la solicitud de aprobación'
    );
    this.cerrarDetalle();
    this.cargarInformacion();
  }

  public async aprobar() {

  
    const { isDismissed, value: id_usuario } = await LoginLitoapps(
      this._usuarioService,
      'Password de usuario que realiza la aprobación'
    );

    if (isDismissed) {
      return;
    }
    const orden = this.ordenActual()?.NoOrden;
    
    try {
      await firstValueFrom(this._sobreService.aprobar(orden!,`${id_usuario!}`));
    } catch (error) {
      console.error('Error al aprobar:', error);
    }
    this._uiService.mostrarAlertaSuccess(
      '',
      'Se ha aprobado la solicitud de aprobación'
    );
    this.cerrarDetalle();
    this.cargarInformacion();
  }

  public async actualizarGaveta(orden:string) {
    // Crear opciones del 1 al 60 para el select
    const opcionesGaveta: { [key: string]: string } = {};
    for (let i = 1; i <= 60; i++) {
      opcionesGaveta[i.toString()] = i.toString();
    }

    const resp = await Swal.fire({
      title: 'Actualizar número de gaveta',
      input: 'select',
      inputLabel: 'Número de gaveta',
      inputOptions: opcionesGaveta,
      inputValue: this.ordenActual()?.no_gaveta || '1',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: (numero_gaveta) => {
        if (!numero_gaveta) {
          Swal.showValidationMessage('Debe seleccionar un número de gaveta');
          return false;
        }
        return numero_gaveta;
      },
    });

    const { value: numero_gaveta, isDismissed } = resp;

    if (isDismissed || !numero_gaveta) {
      return;
    }

    
    //console.log({orden, numero_gaveta});
    //return ;
    
    try {
      const id_usuario = this._usuarioService.StatusSesion().usuario?.id || "1";
      await firstValueFrom(this._sobreService.actualizarGaveta(orden, numero_gaveta,`${id_usuario}`));
      this._uiService.mostrarAlertaSuccess('', 'Número de gaveta actualizado correctamente');
      this.cargarInformacion();      
    // Actualizar la orden actual con el nuevo número de gaveta          
    } catch (error) {
      console.error('Error al actualizar gaveta:', error);
      this._uiService.mostrarAlertaError('', 'Error al actualizar el número de gaveta');
    }
  }

  private async cargarInformacion() {
    try {
      const obs$ = this._sobreService.listar(this._verPendientes());      
      const {ordenes} = await firstValueFrom(obs$);      
      this._ordenes.set(ordenes);      
    } catch (error) {
      console.error('Error al cargar la información:', error);
    }
  }

}
