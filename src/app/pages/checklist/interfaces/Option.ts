import { LogEvent } from "./LogEvent";

export type Option = {
    id:string;
    label: string;    
    optional?: boolean;     
    answered: boolean; // Indica si la opción ha sido respondida
    answer: number| null; // Opcional, si no se necesita, se puede omitir
    comments?: string; // Opcional, si no se necesita, se puede omitir        
    logEvents?: LogEvent[]; // Eventos asociados a la opción
    
}