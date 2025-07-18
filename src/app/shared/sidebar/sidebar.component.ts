import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component,  inject, OnInit } from '@angular/core';
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
export class SidebarComponent   implements OnInit,AfterViewInit {
  router = inject(Router);
  uiService= inject(UiService);
  usuarioService = inject(UsuarioService);
  public rutasPreprensa: Ruta[] = [
    {
      nombre: 'Pendientes',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/orders.svg',
      path: '/preprensa/pendientes'
    },
    {
      nombre: 'Liberadas',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/liberadas.svg',
      path: '/preprensa/liberadas'
    },
    {
      nombre: 'Omisiones',
      claseSize: 'w-8 h-8 svg-icon',
      icono: 'assets/img/liberadas.svg',      
      path: '/preprensa/omisiones'
    },
  ];

  public rutasProduccion: Ruta[] = [
    {
      nombre: 'Pendientes',
      icono: 'assets/img/orders.svg',
      path: '/produccion/pendientes',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Liberadas',
      icono: 'assets/img/liberadas.svg',
      path: '/produccion/liberadas',
      claseSize: 'w-8 h-8 svg-icon',
    },
    {
      nombre: 'Control elementos',
      icono: 'assets/img/control.svg',
      path: '/control_elementos/solicitudes',
      claseSize: 'w-8 h-8 svg-icon',
    },
  ];
  
  ngAfterViewInit(): void {
    //TODO: Asociar el rol al menu y al Guard
    console.log(this.usuarioService.StatusSesion().usuario?.id_rol);
  }
  ngOnInit(): void {
    
  }

  closeSidebar() {
    const checkbox = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  }
}
