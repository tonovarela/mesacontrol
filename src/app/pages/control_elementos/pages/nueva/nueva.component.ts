import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
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
import { SolicitudComponentService } from '@app/services/solicitudcomponente.service';
import { FormsModule } from '@angular/forms';


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
  type = TypeSearchMetrics.CONTROL_ELEMENTOS;

  componentes: ComponenteV[] =[]; 
  componenteSeleccionado = signal<ComponenteV | null>(null);
  

  selectedOrder = computed(() => this.solicitudActual().orderSelected);
  
  
  
  solicitudActual = signal<Solicitud>({
    orderSelected: null,
    componentes: [],
  });

  usuarioService = inject(UsuarioService);
  produccionService = inject(ProduccionService);
  solicitudComponenteService = inject(SolicitudComponentService);

  solicitudService = inject(SolicitudService);

  router = inject(Router);
  uiService = inject(UiService);

  tieneInformacionSeleccionado = computed(() => {
    return this.solicitudActual().componentes.some(
      (x) => x.idSeleccionados.length > 0
    );
  });

  ngOnInit(): void {
   this.componentes =[];
  }

  async onSelectOrder(orden: OrdenMetrics | null) {
    const resp = await firstValueFrom(this.produccionService.obtenerElementos(orden!.NoOrden));
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);    
    this.componentes =[];        
    Object.entries(agrupado).forEach(([componente, elementos]) => {this.componentes.push({descripcion: componente})});
    this.solicitudActual.set({ orderSelected: orden, componentes:[] });

  }

  clearSelectedOrder(): void {
    this.componentes= [];
    this.componenteSeleccionado.set(null);
    this.solicitudActual.set({
      orderSelected: null,
      componentes: [],
    });
  }

  seleccionarElemento(event: MultiSelectChangeEvent, componente: string) {
    const elementos = event.value as any[];
    const ids = elementos.map((e) => +e.id_elemento);
    const componenteActual = this.solicitudActual().componentes.find(
      (x) => x.componente === componente
    );
    if (!componenteActual) {
      return;
    }
    componenteActual.idSeleccionados = ids;
    const componentesActualizados = this.solicitudActual().componentes.map(
      (x) => (x.componente === componente ? componenteActual : x)
    );

    this.solicitudActual.set({
      ...this.solicitudActual(),
      componentes: componentesActualizados,
    });
  }

  async registrarPrestamo() {
    const seleccionados = this.solicitudActual()
      .componentes.filter((x) => x.idSeleccionados.length > 0)
      .map((x) => {
        return {
          componente: x.componente,
          elementos: x.idSeleccionados,
        };
      });
    const orden = this.solicitudActual().orderSelected?.NoOrden;

    const response = await firstValueFrom(
      this.solicitudComponenteService.registrar({ orden, seleccionados })
    );
    this.uiService.mostrarAlertaSuccess(
      'Registro exitoso',
      'Se ha registrado el préstamo de los componentes seleccionados.'
    );
    this.clearSelectedOrder();    
  }

  async onSolicitar(item: any) {
    const { id_checklist } = item;
    const id_solicitante =
      this.usuarioService.StatusSesion().usuario?.id || '99';
    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion(
      'Mesa de Control',
      'Confirma solicitar este material?',
      'Solicitar',
      'Cancelar'
    );
    if (!isConfirmed) {
      return;
    }
    try {
      await firstValueFrom(
        this.solicitudService.registrar(id_checklist, `${id_solicitante}`)
      );
      this.uiService.mostrarAlertaSuccess(
        'Solicitud registrada',
        'La solicitud se ha registrado correctamente.'
      );
      this.router.navigate(['/control_elementos/solicitudes']);
    } catch (error) {
      this.uiService.mostrarAlertaError(
        'Error al solicitar',
        'No se pudo registrar la solicitud. Intente nuevamente.'
      );
    }
  
  }

  async onChangeSelectComponent(event: any) {
    const selectedComponete  = event.value as ComponenteV;    
    this.componenteSeleccionado.set(selectedComponete);
    const orden = this.selectedOrder()?.NoOrden;
    const resp = await firstValueFrom(this.produccionService.obtenerElementos(orden ?? '' ));
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);        
    const componentes: ComponenteView[] = Object.entries(agrupado).map(
      ([componente, elementos]) => {        
        return {
          componente,
          idSeleccionados: [],
          elementos:
            elementos?.map(({ id_elemento, descripcion, id_solicitud }) => ({
              id_elemento,
              descripcion,
              isDisabled: id_solicitud !== null,
            })) || [],
        };
      }
    ).filter((c:ComponenteView) => c.componente === selectedComponete?.descripcion);    
    
    this.solicitudActual.update((prev) => ({
      ...prev,
      componentes: componentes,
    }));
    

  }
}
