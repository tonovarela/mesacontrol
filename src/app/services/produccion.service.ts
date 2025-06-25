import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ResponseDetalleOrdenProduccion } from "@app/interfaces/responses/ResponseOrdenMetrics";
import { environment } from "@environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class ProduccionService {
    private readonly API_URL = environment.apiUrl;
    http = inject(HttpClient);

    detalle(orden: string) {
        return this.http.get<ResponseDetalleOrdenProduccion>(`${this.API_URL}/api/produccion/detalle/${orden}`);
    }

}