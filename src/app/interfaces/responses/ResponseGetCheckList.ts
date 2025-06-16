
export interface ResponseGetCheckList {
    checkListDetalle: CheckListDetalle[];
    
    checkList:        CheckList;
}

export interface CheckListDetalle {
    id:       string;
    label:    string;
    optional: string;
    answer?:   number;
    eventos:  EventResponse[];
}

export interface EventResponse {
    id_bitacora:    string;
    personal:        string;
    id_usuario:     string;
    comments:       string;
    evento:         string;
    fecha_registro: Date;
    nombreUsuario:  string;
}



export interface CheckList {
    id_checklist:     string;
    id_proceso:       string;
    orden:            string;
    id_clasificacion: string;
    op_metrics:       string;
    tiene_opciones:   string;
    id_estado:        string;
    fecha_registro:   Date;
    fecha_liberacion: null;
    categoria:        string;
    tipoPrueba:       string;
}



