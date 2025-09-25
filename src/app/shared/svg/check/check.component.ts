import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'check-svg',
  imports: [],
  templateUrl: './check.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckComponent { }
