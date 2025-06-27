export interface ResponseOrdenMetrics {
    ordenes: OrdenMetrics[];
}



export interface OrdenMetrics {
    NoOrden: string;
    NombreTrabajo: string;
    TipoProd: string;
    TipoProdReal?: string;
    NumCliente: string;
    Vendedor: string;
    NombreCliente: string;
    CantidadEntregar: string;
    SituacionOrden: string;
    EstatusOrden: string;
    FechaEmision: Date;
    FechaEntrega: Date;
    id_checklist_actual: string;
    pruebaColor_checklist?: string;
    pruebaColor_idEstado?: string;
    clienteDummyVestido_checklist?: string;
    clienteDummyVestido_idEstado?: string;
    viajeroPruebaColor_checkList?: string;
    viajeroPruebaColor_idEstado?: string;
    viajeroDummyBlanco_checkList?: string;
    viajeroDummyBlanco_idEstado?: string;
    viajeroDummyVestido_checkList?: string;
    viajeroDummyVestido_idEstado?: string;
    viajeroLiberacion_checkList?: string;
    viajeroLiberacion_idEstado?: string;
}


export interface ResponseDetalleOrdenProduccion {
    detalle: Detalle[];
    estadoMuestras: EstadoMuestra[];
}


export interface EstadoMuestra {
    id_estado_muestra: number;
    descripcion: string;
}

export interface Detalle {
    id_produccion: string;
    orden_metrics: string;
    proceso:       string;
    componente:    string;
    pliego:        string;
    entrada:       string;
    muestra:       number;
    tiros:         number;
    voBo:          boolean | string; // Puede ser booleano o string dependiendo del origen de los datos
    id_estado_muestra: number;
}













