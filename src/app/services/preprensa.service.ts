import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseRutaComponentes, Ruta } from '@app/interfaces/responses/ResponseRutaComponentes';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PreprensaService {
 http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  constructor() { }

  obtenerComponentes(orden:string){
    return this.http.get<ResponseRutaComponentes>(`${this.API_URL}/api/preprensa/ruta-componentes/${orden}`);
  }

  guardarRutaComponentes( rutas:Ruta[]){
    return this.http.post(`${this.API_URL}/api/preprensa/ruta-componentes`,{rutas});
  }

  solicitarRevision(orden:string){
    return this.http.post(`${this.API_URL}/api/preprensa/solicitar-revision`,{orden});
  }

  aprobarRevision(orden:string){
    return this.http.post(`${this.API_URL}/api/preprensa/aprobar-revision`,{orden});
  }

  rechazarRevision(orden:string, motivo:string){  
    return this.http.post(`${this.API_URL}/api/preprensa/rechazar-revision`,{orden,motivo});
  }
}
