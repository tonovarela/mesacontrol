export interface ComponenteAgrupado {
  nombre: string;
  elementos:any[];
}

export interface ResponsePrestamo {
  enPrestamo: boolean;
  solicitante?:Solicitante;
}

export interface Solicitante {
  id_prestamo:number;
  personal: string;
  fecha_prestamo:Date;
  nombre:string
}

export interface ResponseSobreConGaveta {
  ordenes: OrdenConGaveta[];
}

export interface EstatusAsociacion {
  asociando: boolean;
  op: string;
}

export interface OrdenConGaveta {
  NoOrden:       string;
  NombreTrabajo: string;
  TipoProd:      string;
  TipoProdReal:  string;
  NumCliente:    string;
  Vendedor:      string;
  NombreCliente: string;
  no_gaveta:     string;
  enPrestamo:    string;
}



export interface ResponseBitacoraSobre {
  bitacora: Bitacora[];
}

export interface Bitacora {
  id:             string;
  op_metrics:     string;
  id_usuario:     string;
  evento:         string;
  motivo:         string;
  fecha_registro: Date;
}




