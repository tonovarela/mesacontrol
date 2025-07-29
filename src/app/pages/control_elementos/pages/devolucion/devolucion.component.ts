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
import { SolicitudComponentService } from '@app/services/solicitudcomponente.service';

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
  componentes: ComponenteV[] = [];
  router = inject(Router);
  uiService = inject(UiService);
  orden = input<string>();


  private _currentComponente = signal<string | null>(null);

  componenteSeleccionado = computed(() => {
    if (this._currentComponente()) {
      const valores = this.solicitudActual().componentes.filter(
        (x) => x.componente === this._currentComponente()
      );
      return valores;
    }
    return [];
  });

  solicitudActual = signal<SolicitudDevolucion>({
    orderSelected: null,
    componentes: [],
  });
  produccionService = inject(ProduccionService);
  solicitudComponenteService = inject(SolicitudComponentService);
  selectedOrder = computed(() => this.solicitudActual().orderSelected);
  usuarioService = inject(UsuarioService);

  constructor() {
    effect(() => {
      const orden_metrics = this.orden();
      if (orden_metrics) {
        this.cargarInformacion(orden_metrics);
      }
    });
  }

  async cargarInformacion(orden_metrics: string) {

    const resp = await firstValueFrom(
      this.produccionService.obtenerElementos(orden_metrics)
    );
    
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
        idSeleccionados: _elementos.filter((el) => !el.isDisabled),
        elementos: _elementos.filter((el) => !el.isDisabled),
      };
    });    
    this.componentes=componentes.filter(c=>c.idSeleccionados.length > 0).map((i) => {return{descripcion:i.componente}})            
    const orden = resp.orden;
    this.solicitudActual.set({ orderSelected: orden, componentes});    
  }

  seleccionarElemento(event: any, componente: string) {
    const elementosSeleccionados = event.value;
    const componenteActual = this.solicitudActual().componentes.find((x) => x.componente === componente);
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
    const r = this.solicitudActual().componentes.map((c) => {
      const arreglo1 = c.elementos || [];
      const arreglo2 = c.idSeleccionados || [];
      const diferencia = arreglo1.filter(
        (a) => !arreglo2.some((b) => b.id_elemento === a.id_elemento)
      );
      return diferencia;
    });
    return r.some((x) => x.length > 0); 

  });

  async registrarPrestamo() {


    const seleccionados =this.solicitudActual().componentes.map((c) => {
      const arreglo1 = c.elementos || [];
      const arreglo2 = c.idSeleccionados || [];
      const diferencia = arreglo1.filter(
        (a) => !arreglo2.some((b) => b.id_elemento === a.id_elemento)
      );
      return diferencia;      
    });    
    const id_solicitudes = seleccionados.flat().map((item:any) => item.id_solicitud);
    const id_usuario = this.usuarioService.StatusSesion().usuario?.id!;
    
    const resp =await firstValueFrom(this.solicitudComponenteService.devolucion({id_solicitudes,id_usuario}));
    const orden = this.solicitudActual().orderSelected?.NoOrden;

    this.uiService.mostrarAlertaSuccess("Devolucion exitosa","Se ha registrado la devolucion")
    this.cargarInformacion(orden!);
    this._currentComponente.set(null);

    
    

  }

  
  clearSelectedOrder(): void {
    this.router.navigate(['/control_elementos/solicitud']);
  }
}
