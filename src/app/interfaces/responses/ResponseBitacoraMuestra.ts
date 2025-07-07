export interface ResponseBitacoraMuestra {
    muestras: Muestra[];
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
