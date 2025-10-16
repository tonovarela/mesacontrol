import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, computed, input, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from '@app/lib/prime.module';

@Component({
  selector: 'sobre-detalle',
  imports: [CommonModule,PrimeModule,FormsModule],
  templateUrl: './sobre-detalle.component.html',
  styleUrl: './sobre-detalle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SobreDetalleComponent implements OnInit,AfterViewInit {

  @ViewChild('dialogModal') dialogModal: any;

  
  public ordenActual = input<any | null>(null);
  public componentesAgrupados = input<any[]>([]);
  public onCerrarDetalle = output<void>();
  public onDevolverPrestamo = output<void>();
  public onSolicitarPrestamo = output<void>();



  nombreTrabajo = computed(() => {
    if (this.ordenActual() === null) return '';
    return `${this.ordenActual()?.NoOrden}  - ${this.ordenActual()?.NombreTrabajo}`;
  });

  ngAfterViewInit(): void {
    this.dialogModal.maximized = true;
    console.log('ngAfterViewInit dialogModal');
   // throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    //console.log('ngOnInit dialogModal', this.dialogModal);
     //this.dialogModal.maximized = true;  
  }

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
