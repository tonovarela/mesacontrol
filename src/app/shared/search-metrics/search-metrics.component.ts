import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, output, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';

import { PrimeModule } from '@app/lib/prime.module';
import { MetricsService } from '@app/services';
import {  Subject, switchMap } from 'rxjs';


@Component({  
  selector: 'search-metrics',
  imports: [PrimeModule,FormsModule,CommonModule],
  templateUrl: './search-metrics.component.html',
  styleUrl: './search-metrics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchMetricsComponent implements OnInit { 

  
  public OPsBusqueda = signal<any[]>([]);
  public cargandoBusqueda = signal(false);
  public selectedOP: OrdenMetrics | null = null;
  public valorQuery = "";
  public onSelectOrder = output<OrdenMetrics | null >();



  public typeSearch = input.required();


  private valorQuerySubject: Subject<string> = new Subject<string>();  
  private metrisService = inject(MetricsService);
  


  constructor() {
    
    this.valorQuerySubject.pipe(
      switchMap(query => { return this.metrisService.buscarPorPatron(query) })
    ).subscribe((response) => {
      this.cargandoBusqueda.set(false);
      this.OPsBusqueda.set(response.ordenes);
    })
  }
  ngOnInit(): void {
    //console.log("TypeSearch", this.typeSearch());
  }

  async onSelect({ value }: { value: OrdenMetrics }) {
    this.selectedOP = value!;    
    if (!this.selectedOP) {
      return;
    }
    this.onSelectOrder.emit(this.selectedOP );
    this.valorQuery = "";
  }

  OnQueryChanged() {    

      this.OPsBusqueda.set([]);
    if (this.valorQuery.length < 3) {
      return;
    }
    this.cargandoBusqueda.set(true);
    this.valorQuerySubject.next(this.valorQuery);

  }

}
