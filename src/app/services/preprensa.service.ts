import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ResponseOmitidas } from '@app/interfaces/responses/ResponseOmitidas';
import { ResponseRutaComponentes, Ruta } from '@app/interfaces/responses/ResponseRutaComponentes';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PreprensaService {
 http = inject(HttpClient);

   private _ordenPorDefinir = signal<string | null>(null);
   ordenPorDefinir = computed(() => {
     return this._ordenPorDefinir();
   });

   setOrdenPorDefinir(orden: string | null) {
     this._ordenPorDefinir.set(orden);
   }

  
  private readonly API_URL = environment.apiUrl;
  constructor() { }

  obtenerComponentes(orden:string){
    return this.http.get<ResponseRutaComponentes>(`${this.API_URL}/api/preprensa/ruta-componentes/${orden}`);
  }

  guardarRutaComponentes( rutas:Ruta[]){
    return this.http.post(`${this.API_URL}/api/preprensa/ruta-componentes`,{rutas});
  }

  solicitarRevision(orden:string,id_usuario:string){
    return this.http.post(`${this.API_URL}/api/preprensa/solicitar-revision`,{orden, id_usuario});
  }

  aprobarRevision(orden:string,reglas:any[],id_usuario:string){
    return this.http.post(`${this.API_URL}/api/preprensa/aprobar-revision`,{orden, reglas, id_usuario});
  }

  rechazarRevision(orden:string, motivo:string,id_usuario:string){  
    return this.http.post(`${this.API_URL}/api/preprensa/rechazar-revision`,{orden,motivo,id_usuario});
  }
  obtenerOmisiones(){
    return this.http.get<ResponseOmitidas>(`${this.API_URL}/api/preprensa/omitidas`);
  }
}
