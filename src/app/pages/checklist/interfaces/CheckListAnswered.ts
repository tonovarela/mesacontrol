import { Option } from './Option';

export interface CheckListAnswered {
    selectedOptions: OptionAnswered[],    
}

export interface OptionAnswered extends Option {
    answer: string;
    comments: string;
    isMissingComments: boolean;
}