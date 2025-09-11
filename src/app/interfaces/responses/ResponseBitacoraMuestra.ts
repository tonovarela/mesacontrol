export interface ResponseBitacoraMuestra {
    muestras: Muestra[];
    trazo?:EventoActividad;
    voBo?:EventoActividad;
    carta?:EventoActividad;
}

export interface EventoActividad {
    id_usuario: string;
    descripcion: string; 
    fecha_registro:Date;   
}


export interface Muestra {
    muestraRegistrada: string;
    id_operador:       string;
    nombreOperador:    string;
    id_supervisor:     string;
    nombreSupervisor:  string;
    fecha_registro:    Date;
    avatarOperador:    string;
    avatarSupervisor:  string;
}
