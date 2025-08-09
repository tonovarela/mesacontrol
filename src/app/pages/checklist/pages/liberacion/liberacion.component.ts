import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit ,signal} from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ElementoItem, Ruta, RutaElemento } from '@app/interfaces/responses/ResponseRutaComponentes';
import { PrimeModule } from '@app/lib/prime.module';
import { PreprensaService, UiService } from '@app/services';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-liberacion',
  imports: [CommonModule,PrimeModule,ReactiveFormsModule,FormsModule],
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

  formRutas: FormGroup | undefined;
  constructor(private fb: FormBuilder) {
      
  }

  ngOnInit() {
    if (!this.orden()) {
      this.router.navigate(['/preprensa/pendientes']);
      return;
    }
    
    this.cargarInformacion();
  }

  async cargarInformacion()  {    
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

     
  

  }


  onAplicaChange(ruta: RutaElemento, item: ElementoItem,opcion:any) {

    // console.log("onAplicaChange called", ruta, item,opcion);
   item.aplica = opcion.checked==true?  1:0;;
   this.actualizarRuta(ruta);
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
