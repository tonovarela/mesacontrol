import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SolicitudResponse } from "@app/interfaces/responses/SolicitudResponse";
import { environment } from "@environments/environment.development";

@Injectable({
    providedIn: 'root'
  })
  
  export class SolicitudService {

    http =inject(HttpClient);
    private readonly API_URL = environment.apiUrl;

    public listar(){
        return this.http.get<SolicitudResponse>(`${this.API_URL}/api/solicitud`);
    }


    public registrar(id_checklist:string, id_solicitante:string) {
      return this.http.post(`${this.API_URL}/api/solicitud`, { solicitud:{id_checklist, id_solicitante}});
    }

  }