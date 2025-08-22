export interface ResponseRutaComponentes {
    rutas: Ruta[];
    orden?:OrdenLiberacionSobre
}


export interface OrdenLiberacionSobre {
    orden:string;
    nombre_trabajo:string;
    descripcion_estado:string;
    usuario_libero?:string;
    fecha_liberacion?:Date;
    id_estado:EstadoRevision;
}

export enum EstadoRevision {
  PENDIENTE = '1',
  EN_REVISION = '5',
  APROBADO = '2',
  RECHAZADO = '3',
}

export interface Ruta {
    componente: string;
    id_ruta:    string;
    ruta:       string;
}

export interface  RutaElemento {
    componente: string;    
    id_ruta:    string;
    ruta:       ElementoItem[];
    
}

export interface ElementoItem {
  id_elemento: number;
  descripcion: string;
  aplica:number
}

