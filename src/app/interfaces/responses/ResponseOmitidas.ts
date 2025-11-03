export interface ResponseOmitidas {
  ordenes: OrdenOmision[];
}
export interface OrdenOmision {
  orden:        string;
  fechaplaca:   Date;
  Trabajo:      string;
  tipo:         string;
  Cliente:      string;  
}


