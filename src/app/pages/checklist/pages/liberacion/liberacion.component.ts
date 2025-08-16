import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ElementoItem,
  OrdenLiberacionSobre,
  Ruta,
  RutaElemento,
} from '@app/interfaces/responses/ResponseRutaComponentes';
import { PrimeModule } from '@app/lib/prime.module';
import { PreprensaService, UiService } from '@app/services';
import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-liberacion',
  imports: [CommonModule, PrimeModule, ReactiveFormsModule, FormsModule],
  templateUrl: './liberacion.component.html',
  styleUrl: './liberacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LiberacionComponent implements OnInit {

  orden = input<string>();
  private ultimoModulo = "pendientes"
  

private  _trabajo = signal<OrdenLiberacionSobre | null>(null);

  public trabajo = computed(() => {
    return this._trabajo();
  });


  public nombreTrabajo = computed(() => {
    return  `${this._trabajo()?.orden} - ${this._trabajo()?.nombre_trabajo}`;
  });
  public estaEnAprobacion = computed(()=>{
    return this._trabajo()?.id_estado === "5"
  });

  

  public estaPendiente = computed(()=>{
    return this._trabajo()?.id_estado === "1" || this._trabajo()?.id_estado === "3";
  });

  public estaAprobado = computed(() => {
    return this._trabajo()?.id_estado === "2";
  });

  public estadoTrabajo = computed(() => {
    return this._trabajo()?.descripcion_estado || '';
  });


  private prePrensaService = inject(PreprensaService);
  private uiService = inject(UiService);
  private router = inject(Router);
  
  public rutas = signal<RutaElemento[]>([]);
  formRutas: FormGroup | undefined;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.orden()) {
      this.router.navigate(['/preprensa/pendientes']);
      return;
    }    
    const { modulo } = this.router.lastSuccessfulNavigation?.extras?.state || {};    
    if (modulo) {
      this.ultimoModulo = modulo;
    }
    this.cargarInformacion();
  }


  

  async cargarInformacion() {
    const orden = this.orden() || '';
  
    const resp = await firstValueFrom(
      this.prePrensaService.obtenerComponentes(orden)
    );
    if (resp.rutas.length === 0) {
      this.router.navigate(['/preprensa/pendientes']);
      return;
    }
    let rutas = resp.rutas.map((r: Ruta) => {
      return { ...r, ruta: JSON.parse(r.ruta) as ElementoItem[] };
    });
    this._trabajo.set(resp.orden!);    
    //this.estaEnAprobacion.set(resp.orden!.id_estado === "5");
    this.rutas.set(rutas);
  }



  public onAplicaChange(ruta: RutaElemento, item: ElementoItem, opcion: any) {
    item.aplica = opcion.checked == true ? 1 : 0;
    this.actualizarRuta(ruta);
  }


  async actualizarRuta(rutaActualizada: RutaElemento) {
    const rutasActuales = this.rutas();
    const rutasActualizadas = rutasActuales.map((r: RutaElemento) => {
      if (r.id_ruta === rutaActualizada.id_ruta) {
        return rutaActualizada;
      }
      return r;
    });
    this.rutas.set(rutasActualizadas);
  }

  async guardarCambios() {
    await this._guardar();
    this.uiService.mostrarAlertaSuccess(
      '',
      'Se han guardado los cambios correctamente'
    );
  }

  

  async solicitarAprobacion() {
    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion(
      '',
      '¿Está seguro de que desea solicitar la aprobación de las elementos seleccionadas?'
    );
    if (!isConfirmed) {
      return;
    }
    const rutasParaVerificar = this.rutas().map(
      ({ componente, ruta }: RutaElemento) => {
        return {
          componente,
          tieneUnoSeleccionado: ruta.some(
            (item: ElementoItem) => item.aplica === 1
          ),
        };
      }
    );
    const rutas = rutasParaVerificar.filter((r) => !r.tieneUnoSeleccionado);
    if (rutas.length > 0) {
      const elementosConError = rutas.map((x) => x.componente);
      const mensajeError = `Los siguientes componentes no tienen ningún elemento seleccionado: ${elementosConError.join(
        ', '
      )}`;
  
  
      this.uiService.mostrarAlertaError('Error', mensajeError);
      return;
    }

    await this._guardar();
    await firstValueFrom(this.prePrensaService.solicitarRevision(this.orden()!));    
    this.uiService.mostrarAlertaSuccess('', 'Se han mandado a autorización ');
    this.regresar();
  }


  async aprobar(){
      const resp  =  await this.uiService.mostrarAlertaConfirmacion("Confirmar Aprobación", "¿Está seguro de que desea aprobar la solicitud de aprobación?")
      if (!resp.isConfirmed) {
        return;
      }

      const rutas = this.rutas()
                        .flatMap((r: RutaElemento) => 
                        r.ruta
                        .filter((item: ElementoItem) => item.aplica === 1)
                          .map((item: ElementoItem) => ({
                                                        componente: r.componente,
                                                        id_elemento: item.id_elemento,
                                                        orden_metrics: this.orden()
                                                        }))
                                                      );

       
       await firstValueFrom(this.prePrensaService.aprobarRevision(this.orden()!, rutas.flat()));
       //Guardar las rutas en base de datos
      
       

      this.uiService.mostrarAlertaSuccess("", "Se ha aprobado la solicitud de aprobación");    
      this.regresar();
  }

  async rechazar(){
     const resp = await Swal.fire({
        title: "Ingrese el motivo de rechazo",
        input: "text",
        icon: 'info',
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
        showLoaderOnConfirm: true,
        preConfirm: (motivo) => {
          return motivo
        },
      });

      const { value :motivo, isDismissed } = resp;
      if (resp.isConfirmed && motivo?.length == 0) {
        this.uiService.mostrarAlertaError("", "Se necesita ingresar un motivo para rechazar");        
        return;
      }
      if (isDismissed) {
        return;
      }
      await firstValueFrom(this.prePrensaService.rechazarRevision(this.orden()!, motivo!))
      this.uiService.mostrarAlertaSuccess("", "Se ha rechazado la solicitud de aprobación");
      this.regresar();

  }


  public regresar(){
    return this.router.navigate([`/preprensa/${this.ultimoModulo}`]);
  }


  private async _guardar() {
    const rutas = this.rutas();
    const rutasParaGuardar: Ruta[] = this.rutas().map((r: RutaElemento) => {
      return {
        ...r,
        ruta: JSON.stringify(r.ruta),
      };
    });
    await firstValueFrom(this.prePrensaService.guardarRutaComponentes(rutasParaGuardar));
  }
}
