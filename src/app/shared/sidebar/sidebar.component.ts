import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UiService, UsuarioService } from '@app/services';

interface Ruta {
  nombre: string;
  icono: string;
  path: string;
  claseSize: string;
}


@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent   implements OnInit {
  
  router = inject(Router);
  uiService= inject(UiService);
  usuarioService = inject(UsuarioService);
  public rutasPreprensa = signal<Ruta[]>([
    {
      nombre: 'Pendientes',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/sidebar/preprensa-pendientes.svg',
      path: '/preprensa/pendientes'
    },
    {
      nombre: 'Liberadas',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/sidebar/preprensa-liberadas.svg',
      path: '/preprensa/liberadas'
    },
    {
      nombre: 'Omisiones',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/sidebar/preprensa-omisiones.svg',
      path: '/preprensa/omisiones'
    }
  ]);

  public rutasProduccion= signal<Ruta[]>([
    {
      nombre: 'Pendientes',
      icono: 'assets/img/sidebar/produccion-pendientes.svg',
      path: '/produccion/pendientes',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Liberadas',
      icono: 'assets/img/sidebar/produccion-liberadas.svg',
      path: '/produccion/liberadas',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Procesos faltantes',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/sidebar/produccion-faltantes.svg',
      path: '/produccion/omisiones'
    }
    
  ]);

  public rutasControlElementos =   signal<Ruta[]>([
    {
      nombre: 'Solicitudes',
      icono: 'assets/img/sidebar/control-solicitudes.svg',
      path: '/control_elementos/solicitudes',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Histórico',
      icono: 'assets/img/sidebar/control-historico.svg',
      path: '/control_elementos/historico',
      claseSize: 'w-8 h-8 svg-icon',
    }
  ]);

  public rutasSobreteca = signal<Ruta[]>([
    {
      nombre: 'Revisión  sobres',
      icono: 'assets/img/sidebar/sobreteca-revision.svg',
      path: '/sobreteca/sobres',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Sin gaveta asignada',
      icono: 'assets/img/sidebar/sobreteca-sin-gaveta.svg',
      path: '/sobreteca/sobres-confirmados',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Prestamo',
      icono: 'assets/img/sidebar/sobreteca-prestamo.svg',
      path: '/sobreteca/solicitudes',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Histórico',
      icono: 'assets/img/sidebar/sobreteca-historico.svg',
      path: '/sobreteca/historico',
      claseSize: 'w-8 h-8 svg-icon',
    }
  ]);

  


  ngOnInit(): void {
    
  }

  closeSidebar() {
    const checkbox = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  }
}
