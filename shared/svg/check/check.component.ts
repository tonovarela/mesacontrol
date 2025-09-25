import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'check-svg',
  imports: [],
  templateUrl: './check.component.html',
  styleUrl: './check.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckComponent { }
