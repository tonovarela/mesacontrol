import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {


  http =inject(HttpClient)
   private readonly API_URL = environment.apiUrl;
  constructor() { }


  listar(){
    return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/orden/listar`);
  }
}
