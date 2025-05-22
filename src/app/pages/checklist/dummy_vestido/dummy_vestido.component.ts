import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dummy-vestido',
  imports: [],
  templateUrl: './dummy_vestido.component.html',
  styleUrl: './dummy_vestido.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class DummyVestidoComponent { }
