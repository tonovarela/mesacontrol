export interface ResponseProduccionOmitidas {
  ordenes: OrdenProduccionOmitida[];
}

export interface OrdenProduccionOmitida {
  orden:         string;  
  enMesaControl: string;
  faltantes:     string;
  trabajo:       string;
  cliente:       string;
}


export interface ResponseDetalleOmisiones {
   ordenes_omisiones: DetalleOmisiones[];
   ordenes_mc: DetalleOmisiones[];
}

export interface DetalleOmisiones {
 orden: string;
 proceso: string;
 componente:string;
 pliego: string;
 entrada: string;
}


export interface PropsDetalleOmisiones {
  mc:DetalleOmisiones[];
  omisiones: DetalleOmisiones[];
}


