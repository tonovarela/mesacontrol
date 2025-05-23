import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'audit-svg',
  imports: [],
  templateUrl: './audit.component.html',
  styleUrl: './audit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditComponent  { 

  enabled = input.required<boolean>()
}
