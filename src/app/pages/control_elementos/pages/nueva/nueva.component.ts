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
import Swal from 'sweetalert2';

type LoginFormResult = {
  username: string;
  password: string;
};

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

  componentes: ComponenteV[] = [];
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
    this.componentes = [];
  }

  async onSelectOrder(orden: OrdenMetrics | null) {
    const resp = await firstValueFrom(
      this.produccionService.obtenerElementos(orden!.NoOrden)
    );
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);
    this.componentes = [];
    Object.entries(agrupado).forEach(([componente, elementos]) => {
      this.componentes.push({ descripcion: componente });
    });
    this.solicitudActual.set({ orderSelected: orden, componentes: [] });
  }

  clearSelectedOrder(): void {
    this.componentes = [];
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
      .componentes.filter((x) => x.idSeleccionados.length > 0).map((x) => ({componente: x.componente,elementos: x.idSeleccionados}));
    const orden = this.solicitudActual().orderSelected?.NoOrden;
    const { value, isDismissed } = await this.LoginLitoapps();    
    if (isDismissed) {
      return;
    }
    const id_usuario = value;        
    const response = await firstValueFrom(
      this.solicitudComponenteService.registrar({ id_usuario, orden, seleccionados })
    );
    this.uiService.mostrarAlertaSuccess(
      'Registro exitoso',
      'Se ha registrado el préstamo de los componentes seleccionados.'
    );
    this.clearSelectedOrder();
    this.router.navigate(['/control_elementos/solicitudes']);
  }

 
  async onChangeSelectComponent(event: any) {
    const selectedComponete = event.value as ComponenteV;
    this.componenteSeleccionado.set(selectedComponete);
    const orden = this.selectedOrder()?.NoOrden;
    const resp = await firstValueFrom(
      this.produccionService.obtenerElementos(orden ?? '')
    );
    const agrupado = Object.groupBy(resp.componentes, (c) => c.componente);
    const componentes: ComponenteView[] = Object.entries(agrupado)
      .map(([componente, elementos]) => {
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
      })
      .filter(
        (c: ComponenteView) => c.componente === selectedComponete?.descripcion
      );

    this.solicitudActual.update((prev) => ({
      ...prev,
      componentes: componentes,
    }));
  }






  async LoginLitoapps() {
    let usernameInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;

    const { isDismissed, value } = await Swal.fire<LoginFormResult>({
      title: 'Usuario de Litoapps',
      html: `
      <input type="text"  autocomplete="off"  id="usuario" name="usuario" class="swal2-input rounded-md" placeholder="usuario">
      <input type="password"  autocomplete="new-password" name="pass"  id="contrasenia" class="swal2-input rounded-md" placeholder="password">
    `,
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Login',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      didOpen: () => {
        const popup = Swal.getPopup()!;
        usernameInput = popup.querySelector('#usuario') as HTMLInputElement;
        passwordInput = popup.querySelector('#contrasenia') as HTMLInputElement;
        usernameInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
        passwordInput.onkeyup = (event) =>
          event.key === 'Enter' && Swal.clickConfirm();
      },
      preConfirm: () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
          Swal.showValidationMessage(`Por favor, ingrese ambos campos`);
        }
        return { username, password };
      },
    });
    if (isDismissed) {
      return { value: null, isDismissed: true };
    }
    const { username, password } = value!;
    const resp = await this.usuarioService.loginSolicitante(username, password);    
    if (resp.error) {
      Swal.fire({
        title: 'Error',
        text: 'Usuario o contraseña incorrectos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return { value: null, isDismissed: true };      
    }
    return { isDismissed: false, value: resp.id };
  
  }

}
