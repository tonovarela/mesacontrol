import { Component, computed, effect, EffectRef, inject, OnDestroy, OnInit, RendererFactory2, signal } from '@angular/core';

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
  public URL_BASE_FONTAWESOME = environment.baseURLFontAwesome;
  public uiService = inject(UiService);
  private metricsService = inject(MetricsService);
  private pageService = inject(PageService);
  private usuarioService = inject(UsuarioService);
  public estatusLogin = computed(() => this.usuarioService.StatusSesion().estatus);

  
  
  effectLogin: EffectRef;



  constructor() {
    this.loadScript(this.URL_BASE_FONTAWESOME);
    this.metricsService.cargarCatalogoTipoMateriales();
    this.effectLogin = effect(() => {
      if (this.estatusLogin() === 'LOGIN') {    
             
        setTimeout(() => {
          setTimeout(() => {            
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



private renderFactory= inject(RendererFactory2);
private renderer = this.renderFactory.createRenderer(null, null);

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'src', url);
      this.renderer.setAttribute(script, 'async', 'true');
      this.renderer.listen(script, 'load', () => resolve());
      this.renderer.listen(script, 'error', (error) => reject(`Script load error: ${url}, ${error}`));
      this.renderer.appendChild(document.body, script);
    });
  }
}
