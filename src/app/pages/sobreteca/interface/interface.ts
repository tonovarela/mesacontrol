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



