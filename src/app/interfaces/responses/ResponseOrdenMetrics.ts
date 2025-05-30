export interface ResponseOrdenMetrics {
    ordenes: OrdenMetrics[];
}



export interface OrdenMetrics {
    NoOrden:          string;
    NombreTrabajo:    string;
    TipoProd:         string;
    NumCliente:       string;
    NombreCliente:    string;
    CantidadEntregar: string;
    SituacionOrden:   string;
    EstatusOrden:     string;
    FechaEmision:     Date;
    FechaEntrega:     Date;
}




