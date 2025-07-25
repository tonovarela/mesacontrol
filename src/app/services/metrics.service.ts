import { HttpClient } from '@angular/common/http';
import {  computed, inject, Injectable, signal } from '@angular/core';
import { ResponseMateriales } from '@app/interfaces/responses/ResponseMateriales';
import { OrdenMetrics, ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TipoMaterial } from '@app/interfaces/TipoMaterial';
import { environment } from '@environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  private _tipoMateriales = signal<TipoMaterial[]>([]);
  

  TipoMateriales = computed(() => this._tipoMateriales());  
  


  http =inject(HttpClient)
   private readonly API_URL = environment.apiUrl;
  constructor() { }


  listar(pendientes:boolean) {
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/orden?pendientes=${pendientes}`);
    
  }

  omisiones(){
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/orden?omisiones=true`);
  }

   cargarCatalogoTipoMateriales() {
     this.http.get<ResponseMateriales>(`${this.API_URL}/api/orden/materiales`)
     .subscribe(response=>{
        this._tipoMateriales.set(response.tipoMateriales);
     });
  }

  buscarPorPatron(patron: string,paraProducion:boolean = false) {
    return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/orden/buscar?produccion=${paraProducion}`,{patron});
  }

  buscarRegistroPreprensa(patron: string) {  
    return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/preprensa/buscar`,{patron});
  }

 


  agregarOrden(orden: OrdenMetrics) {

    const {NoOrden,TipoProd} = orden;
    return this.http.post(`${this.API_URL}/api/orden`,{orden:{NoOrden,TipoProd}});    
  }


  

}
