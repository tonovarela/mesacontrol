export enum LogEventType {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
  }
  export interface LogEvent {
    type: LogEventType;
    by: string;
    date: Date;
    extraInformation?: string;
  }
  