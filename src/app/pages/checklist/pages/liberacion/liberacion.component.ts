import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit ,signal} from '@angular/core';
import { Router } from '@angular/router';
import { ElementoItem, Ruta, RutaElemento } from '@app/interfaces/responses/ResponseRutaComponentes';
import { PreprensaService, UiService } from '@app/services';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-liberacion',
  imports: [CommonModule],
  templateUrl: './liberacion.component.html',
  styleUrl: './liberacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LiberacionComponent implements OnInit {
    orden = input<string>();
  private prePrensaService = inject(PreprensaService);
  private uiService = inject(UiService);
  private router= inject(Router);
  public rutas  =signal<RutaElemento[]>([]);

  ngOnInit() {
    if (!this.orden()) {
      this.router.navigate(['/preprensa/pendientes']);
      return;
    }
    this.cargarInformacion();
  }

  async cargarInformacion(){    
    const orden = this.orden() ||  '';
    const resp =await firstValueFrom(this.prePrensaService.obtenerComponentes(orden));

    if (resp.rutas.length===0){
      this.router.navigate(['/preprensa/pendientes']);
      return;
    }

    let rutas = resp.rutas.map((r:Ruta)=>{
      return {...r,ruta: JSON.parse(r.ruta) as ElementoItem[]}
   });
    this.rutas.set(rutas);

    //Marcar el primer elemento
    


        
  }

  async actualizarRuta(rutaActualizada:RutaElemento){
    const rutasActuales = this.rutas();
    const rutasActualizadas = rutasActuales.map((r:RutaElemento)=>{
      if (r.id_ruta === rutaActualizada.id_ruta){
        return rutaActualizada;
      }
      return r;
    });
    this.rutas.set(rutasActualizadas);
    
  }

  async guardarCambios(){
    const rutas = this.rutas();
    const primeraRuta = rutas[1];
    primeraRuta.ruta[1].aplica=0;
    this.actualizarRuta(primeraRuta);
    const rutasParaGuardar:Ruta[] = this.rutas().map((r:RutaElemento)=>{
      return {
        ...r,
        ruta: JSON.stringify(r.ruta)
      }
    });
    console.log(rutasParaGuardar);
    await firstValueFrom(this.prePrensaService.guardarRutaComponentes(rutasParaGuardar));
    ///this.uiService.showSuccess('Cambios guardados');
  }


}
