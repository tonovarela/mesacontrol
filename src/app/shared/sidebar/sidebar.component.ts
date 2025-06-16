import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface Ruta {
  nombre: string;
  icono: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent   implements OnInit,AfterViewInit {
  router = inject(Router);
  private _rutas = signal<Ruta[]>([]);
  public rutas = computed(() => this._rutas());
  private rutasEmbarques: Ruta[] = [
    {
    nombre: 'Pendientes',
    icono: 'assets/img/orders.svg',
    path: '/home/pendientes'
  },
  {
    nombre: 'Liberadas',
    icono: 'assets/img/liberadas.svg',
    path: '/home/liberadas'
  },
  
  ];
  
  ngAfterViewInit(): void {
    document.querySelectorAll('.pathItem').forEach((element) => {
      element.addEventListener('click', () => {        
        ///this.uiService.closeSidebar();
      });
    });
  }
  ngOnInit(): void {
    this._rutas.set(this.rutasEmbarques);
  }
}
