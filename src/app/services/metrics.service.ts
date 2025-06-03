import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { OrdenMetrics, ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private readonly APIDATA=environment.apiData

  //private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  //ordenes= computed(() => this._ordenesMetrics());

  http =inject(HttpClient)
   private readonly API_URL = environment.apiUrl;
  constructor() { }


  listar(){
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/orden`);
    
  }

  buscarPorPatron(patron: string) {
    return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/orden/buscar`,{patron});
  }


  agregarOrden(orden: OrdenMetrics) {

    const {NoOrden,TipoProd} = orden;
    return this.http.post(`${this.API_URL}/api/orden`,{orden:{NoOrden,TipoProd}});    
  }

}
