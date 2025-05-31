import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { OrdenMetrics, ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {


  //private _ordenesMetrics = signal<OrdenMetrics[]>([]);
  //ordenes= computed(() => this._ordenesMetrics());

  http =inject(HttpClient)
   private readonly API_URL = environment.apiUrl;
  constructor() { }


  listar(){
    return this.http.get<OrdenMetrics[]>(`http://localhost:3000/ordenes`);
    //return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/orden/listar`);
  }

  buscarPorPatron(patron: string) {
    return this.http.post<ResponseOrdenMetrics>(`${this.API_URL}/api/orden/buscar`,{patron});
  }


  agregarOrden(orden: OrdenMetrics) {

    return this.http.post(`http://localhost:3000/ordenes`,{...orden});
    //this._ordenesMetrics.update(ordenes => [...ordenes, orden]);
  }

}
