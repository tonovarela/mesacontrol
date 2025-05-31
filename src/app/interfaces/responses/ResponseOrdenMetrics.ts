export interface ResponseOrdenMetrics {
    ordenes: OrdenMetrics[];
}



export interface OrdenMetrics {
    id:              string;
    NoOrden:          string;
    NombreTrabajo:    string;
    TipoProd:         string;
    Vendedor:          string;
    NumCliente:       string;
    NombreCliente:    string;
    CantidadEntregar: string;
    SituacionOrden:   string;
    EstatusOrden:     string;
    FechaEmision:     Date;
    FechaEntrega:     Date;
}




