import { CheckList } from '@app/interfaces/responses/ResponseGetCheckList';
import { Option } from './Option';

export interface CheckListAnswered {
    optionsAnswered: OptionAnswered[],        
    
}

export interface CheckListDisplay {
    detail?:CheckList;
    options:Option[];
}

export interface OptionAnswered extends Option {
    
    comments: string;
    isMissingComments: boolean;
}