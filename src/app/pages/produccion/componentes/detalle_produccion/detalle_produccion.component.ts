import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';


@Component({
  selector: 'detalle-produccion',
  imports: [ FormsModule, CommonModule, PrimeModule, SynfusionModule],
  templateUrl: './detalle_produccion.component.html',
  styleUrl: './detalle_produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleProduccionComponent extends BaseGridComponent  implements OnInit {   
  @Input() detalles!: any[];
  @Input() orden!: any;
  @Input() selectedId: string | null = null;

  @Input() registrarMuestra =true;

  @Output() selectMuestra = new EventEmitter<any>();
  @Output() cerrarMuestra = new EventEmitter<string>();
  @Output() voBoChange = new EventEmitter<{ id: string, event: any }>();
  @Output() trazoChange = new EventEmitter<{ id: string, event: any }>();
  @Output() verHistorial = new EventEmitter<any>();
  protected minusHeight = 0.30;
  
 public wrapSettings?: TextWrapSettingsModel;

  constructor() {
    super();
  }
  ngOnInit(): void {   
    this.iniciarResizeGrid(0.28,false);
  }

  onVoBoChange(id: string, event: any) {
    this.voBoChange.emit({ id, event });
  }
  onTrazoChange(id: string, event: any) {
    this.trazoChange.emit({ id, event });
  }

  onVerHistorial(detalle: any) {    
    this.verHistorial.emit(detalle);
  }

}
