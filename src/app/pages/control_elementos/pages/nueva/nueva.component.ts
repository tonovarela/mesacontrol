import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  effect,
  OnInit,
  signal,
} from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';
import { Router } from '@angular/router';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import {
  ProduccionService,
  SolicitudService,
  UiService,
  UsuarioService,
} from '@app/services';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';
import { ComponenteView, Solicitud } from '../../interfaces/interface';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { SolicitudComponentService } from '@app/pages/control_elementos/services/solicitudcomponente.service';
import { FormsModule } from '@angular/forms';

import { SelectButtonChangeEvent } from 'primeng/selectbutton';
import { LoginLitoapps } from '@app/utils/loginLitoapps';



interface ComponenteV {
  descripcion: string;
}

@Component({
  selector: 'app-nueva',
  imports: [SearchMetricsComponent, CommonModule, PrimeModule, FormsModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevaComponent implements OnInit {
  public type = TypeSearchMetrics.CONTROL_ELEMENTOS;




  public todos = true;
  public isLoading= false;
  private usuarioService = inject(UsuarioService);
  private produccionService = inject(ProduccionService);
  private solicitudComponenteService = inject(SolicitudComponentService);
  private solicitudService = inject(SolicitudService);
  private router = inject(Router);
  private uiService = inject(UiService);
  private _currentComponente = signal<string | null>(null);




  private  _componentes = signal<ComponenteV[]>([]);
  

  
  public componentes = computed(()=> {
    const c = this._componentes().map((c:any)=> {
      return {        ...c,
        totalSeleccionados: this.solicitudActual().componentes.find(x => x.componente === c.descripcion)?.idSeleccionados.length || 0
      }
    });
    return c;
  })
  
  public componenteSeleccionado = computed(() => {
    if (this._currentComponente()) {
      const c = this.solicitudActual().componentes.filter(
        (x) => x.componente === this._currentComponente()
      );
      
      return c;
    }
    return [];
  });

  public selectedOrder = computed(() => this.solicitudActual().orderSelected);
  public solicitudActual = signal<Solicitud>({
    orderSelected: null,
    componentes: [],
  });

  public tieneInformacionSeleccionado = computed(() => {
    return this.solicitudActual().componentes.some(
      (x) => x.idSeleccionados.length > 0
    );
  });

  ngOnInit(): void {
    this._componentes.set( []);
  }


  async onSelectOrder(orden: OrdenMetrics | null) {
    const resp = await firstValueFrom(
      this.produccionService.obtenerElementos(orden!.NoOrden)
    );    
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);
    this._componentes.set([]);

    const componentes: any[] = Object.entries(agrupado).map(
      ([componente, elementos]) => {
        const _elementos =
          elementos?.map(({ id_elemento, descripcion, id_solicitud }) => ({
            id_elemento,
            componente,
            descripcion,
            id_solicitud,
            isDisabled: id_solicitud !== null,
          })) || [];
        return {
          componente,
          idSeleccionados: [],
          elementos: _elementos,
        };
      }
    );
    this._componentes.set(componentes.map((i) => ({ descripcion: i.componente,totalSeleccionados:0 })));    
    this.solicitudActual.set({ orderSelected: orden, componentes });
  }

  private actualizarToogleSeleccion(){
    const [el] = this.componenteSeleccionado().map((c) => {
      return { seleccionados: c.idSeleccionados, elementos: c.elementos.filter(el => !el.isDisabled) };
    });
    if (!el) {
      return;
    }    
    if (el.elementos.length===0 && el.seleccionados.length===0) {
      return;
    }    
    this.todos =el.elementos>el.seleccionados;
  }


  regresar() {
    this.router.navigate(['/control_elementos/solicitudes']);
    this.clearSelectedOrder();
  }

  clearSelectedOrder(): void {
    this._componentes.set([]);
    this._currentComponente.set(null);    
    this.solicitudActual.set({
      orderSelected: null,
      componentes: [],
    });
  }

  seleccionarElemento(event: SelectButtonChangeEvent, componente: string) {
    const elementosSeleccionados = event.value;
    const componenteActual = this.solicitudActual().componentes.find(
      (x) => x.componente === componente
    );
    if (!componenteActual) {
      return;
    }
    componenteActual.idSeleccionados = elementosSeleccionados;
    const componentesActualizados = this.solicitudActual().componentes.map(
      (x) => (x.componente === componente ? componenteActual : x)
    );
    
    this.solicitudActual.set({
      ...this.solicitudActual(),
      componentes: componentesActualizados,
    });
     this.actualizarToogleSeleccion();
  }



toogleSeleccion() {
     const componentes = this.solicitudActual().componentes.map((c) => {
       if (c.componente !== this._currentComponente()) {
         return c;
       }       
       const elementosSeleccionados = c.elementos.filter((el) => !el.isDisabled);         
      if (elementosSeleccionados.length === 0) {
        return c;
      }
      if (this.todos) {
        return {
          ...c,
          idSeleccionados: elementosSeleccionados,
        };
      }
      return {
        ...c,
        idSeleccionados: [],
      };
     });

         
     this.solicitudActual.set({
       ...this.solicitudActual(),
       componentes,
     });
     this.todos = !this.todos;
  }



  async registrarPrestamo() {
    const seleccionados = this.solicitudActual().componentes
                                                .filter((x) => x.idSeleccionados.length > 0).map((x) => ({ componente: x.componente, elementos: x.idSeleccionados.map((el:any) => el.id_elemento) }));
        
    const orden = this.solicitudActual().orderSelected?.NoOrden;
    const { value, isDismissed } = await LoginLitoapps(this.usuarioService);
    if (isDismissed) {
      return;
    }
    const id_usuario = value;

    try {
      this.isLoading = true;
      const response = await firstValueFrom(
      this.solicitudComponenteService.registrar({
        id_usuario,
        orden,
        seleccionados,
      })
    );
    this.uiService.mostrarAlertaSuccess(
      'Registro exitoso',
      'Se ha registrado el préstamo de los componentes seleccionados.'
    );
    }catch(error: any){
this.uiService.mostrarAlertaError(
        'Error al registrar el prestamo',
        error.message || 'Ocurrió un error al registrar el prestamo.'
      );
    }finally {
      this.isLoading = false;
    }
    
    this.clearSelectedOrder();
    this.router.navigate(['/control_elementos/solicitudes']);
  }

  async onChangeSelectComponent(event: any) {
    const selectedComponete = event.value as ComponenteV;

    if (!event.value) {
      this._currentComponente.set(null);
      return;
    }
    this._currentComponente.set(event.value.descripcion);
     this.actualizarToogleSeleccion();
  }
  
}
