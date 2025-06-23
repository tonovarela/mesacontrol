import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component,  inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UiService } from '@app/services';

interface Ruta {
  nombre: string;
  icono: string;
  path: string;
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
  public rutasPreprensa: Ruta[] = [
    {
      nombre: 'Pendientes',
      icono: 'assets/img/orders.svg',
      path: '/preprensa/pendientes'
    },
    {
      nombre: 'Liberadas',
      icono: 'assets/img/liberadas.svg',
      path: '/preprensa/liberadas'
    },
  ];

  public rutasProduccion: Ruta[] = [
    {
      nombre: 'Liberacion',
      icono: 'assets/img/orders.svg',
      path: '/produccion/liberacion'
    },
  ];
  
  ngAfterViewInit(): void {
    // document.querySelectorAll('.pathItem').forEach((element) => {
    //   element.addEventListener('click', () => {        
    //     //this.uiService.closeSidebar();
    //   });
    // });
  }
  ngOnInit(): void {
    
  }

  closeSidebar() {
    const checkbox = document.getElementById('sidebar-toggle') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  }
}
