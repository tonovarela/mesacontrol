import { OrdenMetrics } from "@app/interfaces/responses/ResponseOrdenMetrics";

export interface ComponenteView {
  componente:string,
  idSeleccionados: number[],
  elementos:Elemento[]
}

export  interface Elemento {
  id_elemento: string;
  descripcion: string;
  isDisabled:boolean;

}

export interface Solicitud {
  orderSelected: OrdenMetrics | null;

  componentes:ComponenteView[];

}