export interface ResponseOmitidas {
  ordenes: OrdenOmision[];
}
export interface OrdenOmision {
  orden:        string;
  fechaPlaca:   Date;
  Trabajo:      string;
  tipo:         string;
  Cliente:      string;  
}


