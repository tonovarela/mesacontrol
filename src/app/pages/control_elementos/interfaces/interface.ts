import { OrdenMetrics } from "@app/interfaces/responses/ResponseOrdenMetrics";

export interface ComponenteView {
  componente:string,
  idSeleccionados: Elemento[],
  elementos:Elemento[]
}


 

export interface ComponenteViewDevolucion {
  componente:string,
  idSeleccionados: Elemento[],
  
  elementos:Elemento[]
}

export  interface Elemento {
  id_elemento: string;
  componente?:string;
  descripcion: string;
  isDisabled?:boolean;
  //id_solicitud?: string ;


}

export interface Solicitud {
  orderSelected: OrdenMetrics | null;

  componentes:ComponenteView[];


}


export interface SolicitudDevolucion
 {
  orderSelected: OrdenMetrics | null;
  componentes:ComponenteViewDevolucion[];
}


export interface ResponsePrestamos {
  prestamos: Prestamo[];
}

export interface Prestamo {
  id_solicitud: string;
  componente:     string;
  solicitante:    string;
  Personal:       string;
  elemento:       string;
  liga_avatar?:string;
  fecha_registro: Date;
}
