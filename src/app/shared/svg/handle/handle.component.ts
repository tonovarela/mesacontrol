import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'handle-svg',
  imports: [],
  templateUrl: './handle.component.html',
  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HandleComponent { }
