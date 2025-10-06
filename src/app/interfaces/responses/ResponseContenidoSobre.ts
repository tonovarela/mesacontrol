export interface ResponseContenidoSobre {
    contenido: DetalleSobre[];
    autorizacion?: Autorizacion;
}

export interface Autorizacion {    
    fecha_registro: string;
    motivo: string;
}

export interface DetalleSobre {
    id:            string;
    orden_metrics: string;
    componente:    string;
    elemento:      string;
    aplica:      string ;
}


