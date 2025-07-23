import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';

import { TypeSearchMetrics } from '@app/interfaces/type';
import { columnas } from '@app/pages/data/columnas';
import {
  ProduccionService,
  SolicitudService,
  UiService,
  UsuarioService,
} from '@app/services';




import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';


interface Componente {
  componente:string,
  elementos:Elemento[]
}

interface Elemento {
  id_elemento: string;
  descripcion: string;
  id_solicitud: number | null;
}

interface Solicitud {
  orderSelected: OrdenMetrics | null;
  checkListOrden: any[];
  componentes:Componente[];

  

}

@Component({
  selector: 'app-nueva',
  imports: [SearchMetricsComponent, CommonModule],
  templateUrl: './nueva.component.html',
  styleUrl: './nueva.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class NuevaComponent {
  type = TypeSearchMetrics.CONTROL_ELEMENTOS;

  columnasAuditoria = columnas;
  selectedOrder = computed(() => this.solicitudActual().orderSelected);

  solicitudActual = signal<Solicitud>({
    orderSelected: null,
    checkListOrden: [] ,
    componentes: []   
  });

  usuarioService = inject(UsuarioService);
  produccionService = inject(ProduccionService);
  solicitudService = inject(SolicitudService);

  router = inject(Router);
  uiService = inject(UiService);

  async onSelectOrder(orden: OrdenMetrics | null) {
    
    const resp = await firstValueFrom(this.produccionService.obtenerElementos(orden!.NoOrden));
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);
    const componentes :Componente[]= Object.entries(agrupado).map(
      ([componente, elementos]) => ({
        componente,
        elementos: elementos?.map(({ id_elemento, descripcion, id_solicitud }) => ({id_elemento,descripcion,id_solicitud})) || []})
    );        
    // let checkListOrden = [];
    // for (const col of this.columnasAuditoria) {
    //   const id_estado = col.obtenerEstado(orden);
    //   const checkList = {
    //     id_checklist: col.getCheckListKey(orden),
    //     estaHabilitado: id_estado == '2',
    //     id_estado: col.obtenerEstado(orden),
    //     fechaLiberacion: col.obtenerFechaLiberacion(orden),
    //     titulo: col.titulo,
    //     subtitulo: col.subtitulo,
    //     estaSeleccionado: false,
    //   };
    //   checkListOrden.push(checkList);
    // }
    this.solicitudActual.set({ orderSelected: orden, checkListOrden:[],componentes });
    //console.log(this.solicitudActual());
  }

  clearSelectedOrder(): void {
    this.solicitudActual.set({
      orderSelected: null,
      checkListOrden: [],
      componentes: []
    });
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
}
