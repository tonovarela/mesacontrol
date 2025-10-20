import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseContenidoSobre } from '@app/interfaces/responses/ResponseContenidoSobre';
import { ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { ResponseBitacoraSobre, ResponseSobreConGaveta } from '@app/pages/sobreteca/interface/interface';
import { environment } from '@environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class SobreService {

  http =inject(HttpClient);
   private readonly API_URL = environment.apiUrl;

  constructor() { }

  
  
  registrar(orden:string){
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre`,{orden});
  }


  listar(pendientes:boolean =true) {                
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/sobreteca/sobre?pendientes=${pendientes}`);
  }

  conGaveta(activos:boolean=true) {
    return this.http.get<ResponseSobreConGaveta>(`${this.API_URL}/api/sobreteca/sobre/conGaveta?activos=${activos}`);
  }

  contenido(orden:string) {        
    return this.http.get<ResponseContenidoSobre>(`${this.API_URL}/api/sobreteca/sobre/contenido/${orden}`);
  }

  actualizarDetalle(id:string, aplica:string) {
    return this.http.put(`${this.API_URL}/api/sobreteca/sobre/detalle`,{id,aplica});
  
  }

  eliminar(orden:string,id_usuario:string){
    return this.http.put(`${this.API_URL}/api/sobreteca/sobre/eliminar/${orden}`, {id_usuario});
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

  actualizarGaveta(orden: string, no_gaveta: string,id_usuario:string) {
    return this.http.put(`${this.API_URL}/api/sobreteca/sobre/gaveta`, { orden, no_gaveta,id_usuario });
  }

  bitacora(orden:string) {

    return this.http.get<ResponseBitacoraSobre>(`${this.API_URL}/api/sobreteca/sobre/bitacora/${orden}`);
    
  }

  actualizarVigencia(orden: string, vigencia: string, id_usuario: string) {
    return this.http.put(`${this.API_URL}/api/sobreteca/sobre/vigencia`, { orden, vigencia, id_usuario });
  }

  asociar(orden:string,asociada:string,tipo_producto:string,id_usuario:string){  
    return this.http.post(`${this.API_URL}/api/sobreteca/sobre/asociar`,{orden,asociada,tipo_producto,id_usuario});

  }

  


    


  
}
