import { HttpClient } from '@angular/common/http';
import {  computed, inject, Injectable, signal } from '@angular/core';
import { ResponseMateriales } from '@app/interfaces/responses/ResponseMateriales';
import { OrdenMetrics, ResponseOrden, ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TipoMaterial } from '@app/interfaces/TipoMaterial';
import { environment } from '@environments/environment.development';
import { LiberacionComponent } from '../pages/preprensa/checklist/components/liberacion/liberacion.component';
import { ListboxModule } from 'primeng/listbox';
import { ResponseContenidoSobre } from '@app/interfaces/responses/ResponseContenidoSobre';


@Injectable({
  providedIn: 'root'
})
export class SobreService {

  http =inject(HttpClient);
   private readonly API_URL = environment.apiUrl;

  constructor() { }

  

  // buscar(patron: string) {  
  //   return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/sobreteca/sobre/buscar`,{patron});
  // }

  
  registrar(orden:string){
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre`,{orden});
  }


  listar(historico:boolean =true) {                
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/sobreteca/sobre?historico=${historico}`);

  }

  contenido(orden:string) {        
    return this.http.get<ResponseContenidoSobre>(`${this.API_URL}/api/sobreteca/sobre/contenido/${orden}`);
  }

  actualizarDetalle(id:string, aplica:string) {
    return this.http.put(`${this.API_URL}/api/sobreteca/sobre/detalle`,{id,aplica});
  
  }

  solicitarAprobacion(orden:string,
                      id_usuario:string) {        
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre/revision`,{orden,id_usuario});
  }
  
  aprobar(orden:string,
         id_usuario:string) {
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre/autorizar`,{orden,id_usuario});
  }

  rechazar(orden:string, motivo:string,id_usuario:string) {
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre/rechazar`,{orden,id_usuario,motivo});
  }


  

  


  
}
