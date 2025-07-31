import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  signal,
  effect,
  inject,
  computed,
} from '@angular/core';
import {
  ComponenteView,
  ComponenteViewDevolucion,
  Solicitud,
  SolicitudDevolucion,
} from '../../interfaces/interface';
import { ProduccionService, UiService, UsuarioService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PrimeModule } from '@app/lib/prime.module';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudComponentService } from '@app/pages/control_elementos/services/solicitudcomponente.service';

interface ComponenteV {
  descripcion: string;
}

@Component({
  selector: 'app-devolucion',
  imports: [CommonModule, PrimeModule, FormsModule],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DevolucionComponent {
  orden = input<string>();

  

  private router = inject(Router);
  private uiService = inject(UiService);
  private _currentComponente = signal<string | null>(null);
  private produccionService = inject(ProduccionService);
  private solicitudComponenteService = inject(SolicitudComponentService);
  private usuarioService = inject(UsuarioService);

  public componenteSeleccionado = computed(() => {
    if (this._currentComponente()) {
      return this.solicitudActual().componentes.filter(
        (x) => x.componente === this._currentComponente()
      );
    }
    return [];
  });

  public solicitudActual = signal<SolicitudDevolucion>({orderSelected: null,componentes: []});
  public selectedOrder = computed(() => this.solicitudActual().orderSelected);
  public componentes: ComponenteV[] = [];

  constructor() {
    effect(() => {
      const orden_metrics = this.orden();
      if (orden_metrics) {
        this.cargarInformacion(orden_metrics);
      }
    });
  }

  async cargarInformacion(orden_metrics: string) {
    const resp = await firstValueFrom(this.produccionService.obtenerElementos(orden_metrics));

    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);
    this.componentes = [];
    const componentes: ComponenteViewDevolucion[] = Object.entries(
      agrupado
    ).map(([componente, elementos]) => {
      const _elementos =
        elementos?.map(({ id_elemento, descripcion, id_solicitud }) => ({
          id_elemento,
          descripcion,
          id_solicitud,
          isDisabled: id_solicitud === null,
        })) || [];
      return {
        componente,
        idSeleccionados: [],
        elementos: _elementos.filter((el) => !el.isDisabled),
      };
    });    
    this.componentes = componentes.filter(i=>i.elementos.length>0).map((i) => ({ descripcion: i.componente }));
    if (this.componentes.length === 0) {
      this.router.navigate(['/control_elementos/solicitudes']);
      return;
    }
    const orden = resp.orden;
    this.solicitudActual.set({ orderSelected: orden, componentes });
  }

  seleccionarElemento(event: any, componente: string) {
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
  }

  onChangeSelectComponent(event: any) {
    if (!event.value) {
      this._currentComponente.set(null);
      return;
    }
    this._currentComponente.set(event.value.descripcion);
  }

  puedeRegistrarDevolucion = computed(() => {
    const r = this.seleccionados(); 
    return r.length > 0;
  });

  seleccionados = computed(() => {
    return this.solicitudActual().componentes.map((c) => {
      const arreglo1 = c.elementos || [];
      const arreglo2 = c.idSeleccionados || [];
      const diferencia = arreglo2.filter(
        (a) => arreglo1.some((b) => b.id_elemento === a.id_elemento)
      );
      return diferencia;
    }).flat();    

  });

  async registrarPrestamo() {  
    const seleccionados = this.seleccionados();    
    const id_solicitudes = seleccionados      
      .map((item: any) => item.id_solicitud);
    const id_usuario = this.usuarioService.StatusSesion().usuario?.id!;
    try {
      const resp = await firstValueFrom(
        this.solicitudComponenteService.devolucion({
          id_solicitudes,
          id_usuario,
        })
      );

      

            
      const orden = this.solicitudActual().orderSelected?.NoOrden;

      this.uiService.mostrarAlertaSuccess(
        'Devolucion exitosa',
        'Se ha registrado la devolucion'
      );
      this.cargarInformacion(orden!);
      this._currentComponente.set(null);
    } catch (error: any) {
      this.uiService.mostrarAlertaError(
        'Error al registrar devolucion',
        error.message || 'Ocurrió un error al registrar la devolución.'
      );
    }
  }

  clearSelectedOrder(): void {
    this.router.navigate(['/control_elementos/solicitud']);
  }
}
