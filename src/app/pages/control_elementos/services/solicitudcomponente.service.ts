import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SolicitudResponse } from "@app/interfaces/responses/SolicitudResponse";
import { environment } from "@environments/environment.development";
import { ResponsePrestamos } from "../interfaces/interface";

@Injectable({
    providedIn: 'root'
  })
  
  export class SolicitudComponentService {

    http =inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    public registrar(request:any){
        return this.http.post(`${this.API_URL}/api/solicitudcomponente`, {solicitud:request});
    }

    public devolucion(request:any){
        return this.http.post<SolicitudResponse>(`${this.API_URL}/api/solicitudcomponente/devolucion`, {solicitud:request});
    }

    public obtenerPrestamos(orden:string,activas:boolean){
        return this.http.get<ResponsePrestamos>(`${this.API_URL}/api/solicitudcomponente/prestamos/${orden}?activas=${activas}`);
    }

  }