import { Component, computed, effect, EffectRef, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { initFlowbite } from 'flowbite';
import { MetricsService, UiService } from './services';
import { PageService } from './services/page.service';
import { UsuarioService } from './services/usuario.service';
import { environment } from '@environments/environment.development';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent,SidebarComponent,RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit,OnDestroy {
  isDarkMode = signal(false);
  public uiService = inject(UiService);
  private metricsService = inject(MetricsService);
  private pageService = inject(PageService);
  private usuarioService = inject(UsuarioService);
  public estatusLogin = computed(() => this.usuarioService.StatusSesion().estatus);
  
  effectLogin: EffectRef;

  constructor() {
    this.metricsService.cargarCatalogoTipoMateriales();
    


    this.effectLogin = effect(() => {
      if (this.estatusLogin() === 'LOGIN') {    
             
        setTimeout(() => {
          setTimeout(() => {
            //this.uiService.cargarSidebar();
            initFlowbite();      
          }, 10);
        }, 500);
      }      
      if (this.estatusLogin() === 'LOGOUT') {
        const esProduccion = environment.production;
        if (esProduccion) {
          window.location.href = "/litoapps";
          localStorage.removeItem("User");
          localStorage.removeItem("Pass");
          return;
        }
      };
    });

  }
  ngOnInit(): void {
    this.usuarioService.verificarSesionLitoapps();
  }


  ngOnDestroy(): void {
    this.effectLogin.destroy();
  }
  

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('dark');
    this.isDarkMode.set(!this.isDarkMode());
  }
}
