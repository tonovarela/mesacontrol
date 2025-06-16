import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { UiService } from '../../services';
import { UsuarioService } from '@app/services/usuario.service';
import { Usuario } from '../../interfaces/models/Usuario';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {

  Foto = computed(() => `${!environment.production?'https://servicios.litoprocess.com':''}/colaboradores/api/foto/${this.usuarioService.StatusSesion()?.usuario?.personal}`);
  usuarioService = inject(UsuarioService);
  uiService = inject(UiService);
  esDark = false;
  linksThemeMap: Map<string, HTMLLinkElement> = new Map();


  Username = computed(() => this.usuarioService.StatusSesion().usuario?.nombre);

  ngOnInit(): void {
    const links = Array.from(document.querySelectorAll('link')) as HTMLLinkElement[]; 
    const _links = links.filter(link => link.getAttribute('rel') === 'stylesheet' && link.getAttribute('href')?.includes('syncfusion') )
                          .map(link => {link.setAttribute('disabled', 'true');return link;});        
    _links.forEach(link =>this.linksThemeMap.set(link.getAttribute('href')?.includes('dark')?"dark":'light', link));      
    if(('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches){      
      const  esDark= localStorage.getItem('color-theme') === 'dark';            
      this.setTema({esDark});          
    }else{
      this.setTema({esDark:false});
     }
  }
  
  
  cambiarTema() {
    this.setTema({ esDark: localStorage.getItem('color-theme') !== 'dark' });
  }


  private setTema(props: { esDark: boolean }) {    
    if (props.esDark) {
      document.documentElement.classList.add('dark');
      this.linksThemeMap.get('dark')?.removeAttribute('disabled');
      this.linksThemeMap.get('light')?.setAttribute('disabled', 'true');
      localStorage.setItem('color-theme', 'dark');
      this.esDark = true;
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      this.linksThemeMap.get('light')?.removeAttribute('disabled');
      this.linksThemeMap.get('dark')?.setAttribute('disabled', 'true');
      this.esDark = false;

    }

  }

  cerrarSesion() {
    this.usuarioService.logout();
  }

}
