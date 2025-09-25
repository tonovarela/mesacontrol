import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'loading',
  imports: [],
  templateUrl: './loading.component.html',  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent { }
