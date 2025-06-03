import { Option } from './Option';

export interface CheckListAnswered {
    selectedOptions: OptionAnswered[],    
}

export interface OptionAnswered extends Option {
    
    comments: string;
    isMissingComments: boolean;
}