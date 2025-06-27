import { Detalle } from "../responses/ResponseOrdenMetrics";

export interface RegistroMuestra {
    detalle: Detalle,
    muestraRegistrada: number,
    operador: string,
    supervisor: string
  }