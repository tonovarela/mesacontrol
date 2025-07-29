import { OrdenMetrics } from "@app/interfaces/responses/ResponseOrdenMetrics";

export interface ComponenteView {
  componente:string,
  idSeleccionados: number[],
  elementos:Elemento[]
}

export interface ComponenteViewDevolucion {
  componente:string,
  idSeleccionados: Elemento[],
  elementos:Elemento[]
}

export  interface Elemento {
  id_elemento: string;
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