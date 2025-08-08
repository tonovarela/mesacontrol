import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SolicitudResponse } from "@app/interfaces/responses/SolicitudResponse";
import { environment } from "@environments/environment.development";
import { ResponseSolicitudPrestamo } from '../interfaces/responses/ResponseSolicitudPrestamo';

@Injectable({
    providedIn: 'root'
  })
  
  export class SolicitudService {

    http =inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    public listar(activas: boolean = true) {
        return this.http.get<ResponseSolicitudPrestamo>(`${this.API_URL}/api/solicitud?activas=${activas}`);
    }


    // public registrar(id_checklist:string, id_solicitante:string) {
    //   return this.http.post(`${this.API_URL}/api/solicitud`, { solicitud:{id_checklist, id_solicitante}});
    // }

    public cambiarEstado(id_solicitud: string, id_estado: number, id_usuario: string, id_checklist?: string) {
      return this.http.put(`${this.API_URL}/api/solicitud`, { id_checklist,solicitud:{ id_solicitud,
                                                                          id_estado, 
                                                                          id_usuario}});
    }


    


    
    

   

  }