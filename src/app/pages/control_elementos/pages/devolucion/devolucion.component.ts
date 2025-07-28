import { ChangeDetectionStrategy, Component, OnInit,input,effect } from '@angular/core';

@Component({
  selector: 'app-devolucion',
  imports: [],
  templateUrl: './devolucion.component.html',
  styleUrl: './devolucion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DevolucionComponent  {

   orden = input<string>();

   

   constructor() {
     effect(() => {
          const orden_metrics = this.orden();
          if (orden_metrics) {
            console.log('Product ID:', orden_metrics);
          }
        });
   }
   }
