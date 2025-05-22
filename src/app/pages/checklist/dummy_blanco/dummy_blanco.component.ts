import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dummy-blanco',
  imports: [],
  templateUrl: './dummy_blanco.component.html',
  styleUrl: './dummy_blanco.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DummyBlancoComponent { }
