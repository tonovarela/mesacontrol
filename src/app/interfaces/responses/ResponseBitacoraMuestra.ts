export interface ResponseBitacoraMuestra {
    muestras: Muestra[];
    trazo?:EventoActividad;
    vobo?:EventoActividad;
}

export interface EventoActividad {
    id_usuario: string;
    descripcion: string;    
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
