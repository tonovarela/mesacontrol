import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, ViewChild } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';

@Component({
  selector: 'sobre-detalle',
  imports: [CommonModule,PrimeModule],
  templateUrl: './sobre-detalle.component.html',
  styleUrl: './sobre-detalle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreDetalleComponent {

  @ViewChild('dialogModal') dialogModal: any;

  public tieneOrdenSeleccionada = input<boolean>(false);
  public ordenActual = input<any | null>(null);
  public componentesAgrupados = input<any[]>([]);
  public onCerrarDetalle = output<void>();
  public onDevolverPrestamo = output<void>();
  public onSolicitarPrestamo = output<void>();



  cerrarDetalle(){
    this.onCerrarDetalle.emit();
  }

  devolverPrestamo(){
    this.onDevolverPrestamo.emit();
  }

  solicitarPrestamo(){
    this.onSolicitarPrestamo.emit();
  }

}
