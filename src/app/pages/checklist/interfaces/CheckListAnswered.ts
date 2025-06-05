import { CheckList, CheckListDetalle } from '@app/interfaces/responses/ResponseGetCheckList';
import { Option } from './Option';

export interface CheckListAnswered {
    optionsAnswered: OptionAnswered[],    
    isRefused: boolean; // Indica si el checklist fue rechazado
    
}

export interface CheckListDisplay {
    detail?:CheckList;
    options:Option[];
}

export interface OptionAnswered extends Option {
    
    comments: string;
    isMissingComments: boolean;
}