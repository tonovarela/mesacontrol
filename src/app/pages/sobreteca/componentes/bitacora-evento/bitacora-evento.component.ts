import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';
import { Bitacora } from '../../interface/interface';

@Component({
  selector: 'bitacora-evento',
  imports: [PrimeModule,CommonModule],
  templateUrl: './bitacora-evento.component.html',
  styleUrl: './bitacora-evento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BitacoraEventoComponent {


   //public mostrarBitacora = input<boolean>(false);

   public bitacoraSobre = input<Bitacora[]>([]);

   public onCerrarBitacora = output<void>();

   cerrarBitacora(){
    this.onCerrarBitacora.emit();
   }

 }
