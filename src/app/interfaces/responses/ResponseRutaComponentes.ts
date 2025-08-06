export interface ResponseRutaComponentes {
    rutas: Ruta[];
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

