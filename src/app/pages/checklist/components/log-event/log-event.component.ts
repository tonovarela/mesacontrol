import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LogEvent } from '../../interfaces/LogEvent';
@Component({
  selector: 'log-event',
  imports: [CommonModule],
  templateUrl: './log-event.component.html',
  styleUrl: './log-event.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogEventComponent {

  logEvent =input.required<LogEvent>();
  

 }
