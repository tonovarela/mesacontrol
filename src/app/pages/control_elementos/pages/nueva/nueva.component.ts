import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';

import { TypeSearchMetrics } from '@app/interfaces/type';
import { columnas } from '@app/pages/data/columnas';
import { SolicitudService, UiService, UsuarioService } from '@app/services';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom } from 'rxjs';

interface Solicitud {
  orderSelected: OrdenMetrics | null;
  checkListOrden: any[];
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
    checkListOrden: [],
  });

  usuarioService = inject(UsuarioService)
  router = inject(Router);
  uiService = inject(UiService);
  solicitudService = inject(SolicitudService);


  onSelectOrder(orden: OrdenMetrics | null) {
    let checkListOrden = [];
    for (const col of this.columnasAuditoria) {
      const id_estado = col.obtenerEstado(orden);
      const checkList = {
        id_checklist: col.getCheckListKey(orden),
        estaHabilitado: id_estado == '2',
        id_estado: col.obtenerEstado(orden),
        fechaLiberacion: col.obtenerFechaLiberacion(orden),
        titulo: col.titulo,
        subtitulo: col.subtitulo,
        estaSeleccionado: false,
      }
      checkListOrden.push(checkList);
    }
    this.solicitudActual.set({ orderSelected: orden, checkListOrden });
  }

  clearSelectedOrder(): void {
    this.solicitudActual.set({
      orderSelected: null,
      checkListOrden: [],
    });

  }




  async onSolicitar(item: any) {
    
    const { id_checklist } = item;
    const id_solicitante = this.usuarioService.StatusSesion().usuario?.id || '99';
    const { isConfirmed } = await this.uiService.mostrarAlertaConfirmacion("Mesa de Control", "Confirma solicitar este material?", "Solicitar", "Cancelar")
    if (!isConfirmed) {
      return;
    }
    try {
      await firstValueFrom(this.solicitudService.registrar(id_checklist, `${id_solicitante}`));
      this.uiService.mostrarAlertaSuccess("Solicitud registrada", "La solicitud se ha registrado correctamente.");
      this.router.navigate(['/control_elementos/solicitudes']);
    }
    catch (error) {
      this.uiService.mostrarAlertaError("Error al solicitar", "No se pudo registrar la solicitud. Intente nuevamente.");     
    }

  }




}
