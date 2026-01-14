import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { PrimeModule } from '@app/lib/prime.module';

import { FormsModule } from '@angular/forms';
import { RegistroMuestra } from '@app/interfaces/models/RegistroMuestra';
import { Detalle } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { SearchEmployeeComponent } from '@app/shared/search-employee/search-employee.component';
import { environment } from '@environments/environment.development';

interface Operador {
  NoOperador: string;
  Nombre: string;
  Avatar: string;
}




@Component({
  selector: 'registro-muestra',
  imports: [PrimeModule, CommonModule, SearchEmployeeComponent, FormsModule],
  templateUrl: './registro-muestra.component.html',
  styleUrl: './registro-muestra.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistroMuestraComponent {
  BASE_AVATAR_URL = environment.baseAvatarUrl;
  @Input() set muestra(value: any) {
    if (value) {
      this.selectedMuestra.set(value);
      this.visible.set(true);
    } else {
      this.visible.set(false);
    }
  }

  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<RegistroMuestra>();

  visible = signal(false);
  selectedMuestra = signal<Detalle | null>(null);
  selectedOperador = signal<Operador | null>(null);
  selectedSupervisor = signal<Operador | null>(null);

  numMuestras: number = 0;
  vobo: boolean = false;

  onSelectOperador(operador: any) {
    this.selectedOperador.set({ ...operador, Avatar: `${this.BASE_AVATAR_URL}/${operador.NoOperador}` });
  }

  onSelectSupervisor(supervisor: any) {
    this.selectedSupervisor.set({ ...supervisor, Avatar: `${this.BASE_AVATAR_URL}/${supervisor.NoOperador}` });
  }

  clearOperador() {
    this.selectedOperador.set(null);
  }

  clearSupervisor() {
    this.selectedSupervisor.set(null);
  }

  closeDialog() {
    this.selectedMuestra.set(null);
    this.selectedOperador.set(null);
    this.selectedSupervisor.set(null);
    this.visible.set(false);
    this.onClose.emit();
  }
  processSamples() {

    if (isNaN(this.numMuestras) || +this.numMuestras < 0) { return; }
     const numMuestras = Math.trunc(+this.numMuestras);
     this.onSave.emit({
      detalle: this.selectedMuestra()!,
      muestraRegistrada: numMuestras,
      operador: this.selectedOperador()?.NoOperador || '-1',
      supervisor: this.selectedSupervisor()?.NoOperador || '-1'
     });

    this.closeDialog();
  }



}
