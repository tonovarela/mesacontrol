import { OrdenMetrics } from "../responses/ResponseOrdenMetrics";

export interface CurrentOrder {
    order?: OrdenMetrics,
    detalle: any[];
  }