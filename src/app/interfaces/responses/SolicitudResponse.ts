export interface SolicitudResponse {
    solicitudes: Solicitud[];
    estados: Estado[];
}

export interface Estado {
    id_estado: string;
    descripcion: string;
}
export interface Solicitud {
    op_metrics:     string;
    id_solicitud:   string;
    id_checklist:   string;
    id_estado:      string;
    id_solicitante: string;
    Nombre:         string;
    Personal:       string;
    fecha_registro: Date;
    descripcion:    string;
    nombreTrabajo:  string;
    proceso:        string;
    clasificacion:  string;
}
