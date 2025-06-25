import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Operador } from '@app/interfaces/responses/ResponseOperador';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { PrimeModule } from '@app/lib/prime.module';
import { MetricsService } from '@app/services';
import { UsuarioService } from '@app/services/usuario.service';
import { Subject, switchMap } from 'rxjs';

@Component({
  selector: 'search-employee',
  imports: [PrimeModule, FormsModule, CommonModule],
  templateUrl: './search-employee.component.html',
  styleUrl: './search-employee.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchEmployeeComponent {

  public operatorsBusqueda = signal<any[]>([]);
  public cargandoBusqueda = signal(false);

  public placeholder = input.required<string>();
  public selectedOP: Operador | null = null;
  public valorQuery = "";
  public onSelectEmployee = output<Operador | null>();


  private valorQuerySubject: Subject<string> = new Subject<string>();
  private usuarioService = inject(UsuarioService);

  constructor() {
    this.valorQuerySubject.pipe(
      switchMap(query => { return this.usuarioService.buscarOperador(query) })
    ).subscribe((response) => {
      this.cargandoBusqueda.set(false);
      this.operatorsBusqueda.set(response.operadores);
    });
  }


  async onSelect({ value }: { value: Operador }) {
    this.selectedOP = value!;
    if (!this.selectedOP) {
      return;
    }
    this.onSelectEmployee.emit(this.selectedOP);
    this.valorQuery = "";
  }

  OnQueryChanged() {
    this.operatorsBusqueda.set([]);
    if (this.valorQuery.length < 3) {
      return;
    }
    this.cargandoBusqueda.set(true);
    this.valorQuerySubject.next(this.valorQuery);
  }


}
