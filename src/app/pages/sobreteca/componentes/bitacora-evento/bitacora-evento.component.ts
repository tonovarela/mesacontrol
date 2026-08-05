import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';
import { Bitacora } from '../../interface/interface';

interface EstiloEvento {
  punto: string;
  etiqueta: string;
  chip: string;
  borde: string;
}

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
   public orden = input<string>('');

   public onCerrarBitacora = output<void>();

   public eventos = computed(() =>
     this.bitacoraSobre().map((registro) => ({
       ...registro,
       ...this.separarMotivo(registro.motivo),
       estilo: this.resolverEstilo(registro.evento),
     }))
   );

   cerrarBitacora(){
    this.onCerrarBitacora.emit();
   }

   /**
    * El backend manda la acción y el motivo en un solo texto, por ejemplo:
    * "El usuario mrodriguez ha rechazado la orden de sobre. Motivo: Falta dummy"
    * Se separa en la descripción de la acción y el motivo capturado por el usuario.
    */
   private separarMotivo(motivo: string): { descripcion: string; detalle: string } {
     const texto = (motivo || '').trim();
     const separador = /\bmotivo\s*:/i.exec(texto);
     if (!separador) {
       return { descripcion: texto, detalle: '' };
     }
     return {
       descripcion: texto.slice(0, separador.index).trim(),
       detalle: texto.slice(separador.index + separador[0].length).trim(),
     };
   }

   private resolverEstilo(evento: string): EstiloEvento {
     const texto = (evento || '').toLowerCase();
     if (texto.includes('aprob') || texto.includes('autoriz') || texto.includes('libera')) {
       return {
         punto: 'bg-emerald-500',
         etiqueta: 'text-emerald-700 dark:text-emerald-400',
         chip: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
         borde: 'border-emerald-300 dark:border-emerald-500/40',
       };
     }
     if (texto.includes('rechaz') || texto.includes('elimin') || texto.includes('cancel')) {
       return {
         punto: 'bg-red-500',
         etiqueta: 'text-red-700 dark:text-red-400',
         chip: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
         borde: 'border-red-300 dark:border-red-500/40',
       };
     }
     if (texto.includes('revis') || texto.includes('solicit')) {
       return {
         punto: 'bg-amber-500',
         etiqueta: 'text-amber-700 dark:text-amber-400',
         chip: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
         borde: 'border-amber-300 dark:border-amber-500/40',
       };
     }
     if (texto.includes('gaveta') || texto.includes('prestamo') || texto.includes('préstamo')) {
       return {
         punto: 'bg-violet-500',
         etiqueta: 'text-violet-700 dark:text-violet-400',
         chip: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
         borde: 'border-violet-300 dark:border-violet-500/40',
       };
     }
     return {
       punto: 'bg-sky-500',
       etiqueta: 'text-sky-700 dark:text-sky-400',
       chip: 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400',
       borde: 'border-sky-300 dark:border-sky-500/40',
     };
   }

 }
