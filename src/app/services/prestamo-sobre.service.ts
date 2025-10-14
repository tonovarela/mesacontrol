import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponsePrestamo } from '@app/pages/sobreteca/interface/interface';
import { environment } from '@environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PrestamoSobreService {
  http =inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  constructor() { }


  informacion(orden:string) {      
      return this.http.get<ResponsePrestamo>(`${this.API_URL}/api/sobreteca/prestamo/sobre/${orden}`)      
    }
}
