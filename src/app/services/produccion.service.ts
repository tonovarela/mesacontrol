import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ResponseBitacoraMuestra } from "@app/interfaces/responses/ResponseBitacoraMuestra";
import { ResponseDetalleOrdenProduccion, ResponseOrdenMetrics } from "@app/interfaces/responses/ResponseOrdenMetrics";
import { environment } from "@environments/environment.development";

@Injectable({
    providedIn: 'root'
})
export class ProduccionService {
    private readonly API_URL = environment.apiUrl;
    http = inject(HttpClient);

    listar() {
        return this.http.get<ResponseOrdenMetrics>(`${this.API_URL}/api/produccion`);
    }

    detalle(orden: string) {
        return this.http.get<ResponseDetalleOrdenProduccion>(`${this.API_URL}/api/produccion/detalle/${orden}`);
    }

    actualizarVoBo(id_produccion: string,voBo: boolean,id_usuario: string) {
        return this.http.put(`${this.API_URL}/api/produccion/vobo`, {
            request: {
                voBo,
                id_produccion,
                id_usuario
            }
        });
    }

    actualizarTrazo(id_produccion: string, trazo: boolean, id_usuario: string) {
        return this.http.put(`${this.API_URL}/api/produccion/trazo`, {
            request: {
                trazo,
                id_produccion,
                id_usuario
            }
        });
    }

    finalizarMuestra(request: { id_produccion: string, id_usuario: string }) {
        return this.http.put(`${this.API_URL}/api/produccion/finalizar`, { request });
    }

    registrarMuestra(request: any) {
        return this.http.post(`${this.API_URL}/api/produccion/muestra`, { request });
    }

    obtenerBitacoraMuestra(id_produccion: string) {
        return this.http.get<ResponseBitacoraMuestra>(`${this.API_URL}/api/produccion/bitacora/${id_produccion}`);
    }

}