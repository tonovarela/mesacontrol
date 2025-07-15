import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, output, input, OnInit, computed, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdenMetrics, ResponseOrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';

import { PrimeModule } from '@app/lib/prime.module';
import { MetricsService } from '@app/services';
import {  Observable, Subject, switchMap } from 'rxjs';


@Component({  
  selector: 'search-metrics',
  imports: [PrimeModule,FormsModule,CommonModule],
  templateUrl: './search-metrics.component.html',
  styleUrl: './search-metrics.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchMetricsComponent implements OnInit,OnDestroy { 

  
  public OPsBusqueda = signal<any[]>([]);
  public cargandoBusqueda = signal(false);
  public selectedOP: OrdenMetrics | null = null;
  public valorQuery = "";
  public onSelectOrder = output<OrdenMetrics | null >();





  public typeSearch = input<TypeSearchMetrics>(TypeSearchMetrics.PREPRENSA);


  private valorQuerySubject: Subject<string> = new Subject<string>();  
  private metrisService = inject(MetricsService);
  
  paraProduccion = computed(() => {
    return this.typeSearch() === 1;
  });


  constructor() {
    
    
  }
  ngOnDestroy(): void {
    this.valorQuerySubject.unsubscribe();
    
  }
  ngOnInit(): void {
    
    const tipoSearch = this.typeSearch();
    let busquedaObservable :Observable<ResponseOrdenMetrics>     

      
    this.valorQuerySubject.pipe(
      switchMap(query => {
        if ([TypeSearchMetrics.PREPRENSA,TypeSearchMetrics.PRODUCCION].includes(tipoSearch) ){  
          busquedaObservable = this.metrisService.buscarPorPatron(this.valorQuery, this.paraProduccion());
        }else {    
          busquedaObservable = this.metrisService.buscarRegistroPreprensa(this.valorQuery);
        }
        return busquedaObservable;

      })
    ).subscribe((response) => {
      this.cargandoBusqueda.set(false);
      this.OPsBusqueda.set(response.ordenes);
    })

   
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
