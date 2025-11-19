import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PropsDetalleOmisiones } from '@app/interfaces/responses/ResponseProduccionOmitidas';
import { PrimeModule } from '@app/lib/prime.module';

@Component({
  selector: 'detalle-omisiones',
  imports: [PrimeModule, CommonModule],
  templateUrl: './detalle-omisiones.html',
  styleUrl: './detalle-omisiones.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleOmisiones  {
   
   visible = input<boolean>(true);
   detalleOmisiones = input<PropsDetalleOmisiones>({omisiones: [], mc: []});
   onCerrarModal = output<void>();
   onRegistrarOrdenOmision = output<string>();

   tieneOmisiones = computed(() => {
    return this.detalleOmisiones().omisiones.length > 0;
   });

   cerrar() {    
     this.onCerrarModal.emit();
   }

   registrarOmisiones(){    
    const omisionesARegistrar = this.detalleOmisiones().omisiones;
    const orden = omisionesARegistrar.length > 0 ? omisionesARegistrar[0].orden : null;    
    if (orden==null){
      return;
    }
    this.onRegistrarOrdenOmision.emit(orden);
   }

   


 }
