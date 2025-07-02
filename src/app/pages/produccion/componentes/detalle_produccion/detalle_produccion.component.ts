import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';

@Component({
  selector: 'detalle-produccion',
  imports: [ FormsModule, CommonModule, PrimeModule, SynfusionModule],
  templateUrl: './detalle_produccion.component.html',
  styleUrl: './detalle_produccion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleProduccionComponent { 
  @Input() detalles!: any[];
  @Input() orden!: any;
  @Input() selectedId: string | null = null;

  @Output() selectMuestra = new EventEmitter<any>();
  @Output() cerrarMuestra = new EventEmitter<string>();
  @Output() voBoChange = new EventEmitter<{ id: string, event: any }>();

  onVoBoChange(id: string, event: any) {
    this.voBoChange.emit({ id, event });
  }

}
