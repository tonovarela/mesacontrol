import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { DetalleSobre } from '@app/interfaces/responses/ResponseContenidoSobre';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { TypeSearchMetrics } from '@app/interfaces/type';
import { PrimeModule } from '@app/lib/prime.module';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { MetricsService, SobreService } from '@app/services';
import { LoadingComponent } from '@app/shared/loading/loading.component';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';
import { firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-sobres',
  imports: [
    SynfusionModule,
    PrimeModule,
    CommonModule,
    FormsModule,
    SearchMetricsComponent,
    //  LoadingComponent
  ],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SobresComponent  extends BaseGridComponent implements OnInit {
  @ViewChild('dialogModal') dialogModal :any;

  public readonly type = TypeSearchMetrics.SOBRESPREPRENSA;      
  private sobreService = inject(SobreService);
  public ordenActual = signal<OrdenMetrics | null>(null);
  private _ordenes= signal<OrdenMetrics[]>([]);
  protected minusHeight = 0.3;  
  public mostrarModalSobre = false;    
  public ordenes = computed(() => this._ordenes());

  public contenidoSobre = signal<any[]>([]);

   constructor() {
    super();
  }
  


  ngOnInit(): void {
    this.cargarInformacion(false);
    this.iniciarResizeGrid(this.minusHeight, true);
  }

  async cargarInformacion(historico:boolean) {
    try {
      const response =await firstValueFrom(this.sobreService.listar(historico));      
      this._ordenes.set(response.ordenes);
    } catch (error) {
      console.error('Error al cargar la información:', error);
    }
  }


  async verDetalle(orden: OrdenMetrics) {
     this.mostrarModalSobre = true;
     this.dialogModal.maximized = true;
     
     const response =await firstValueFrom(this.sobreService.contenido(orden.NoOrden))
     const contenido = response.contenido.map(item => ({...item,aplica: item.aplica=='1' }));     
     this.ordenActual.set(orden);
     this.contenidoSobre.set(contenido);        
  }

  cerrarDetalle() { 
    this.ordenActual.set(null);
    this.mostrarModalSobre =false;    }


  async onSelectOrder(orden: OrdenMetrics | null) {
    if (orden === null) {
      return;
    }

    try {      
      const response = await firstValueFrom(this.sobreService.registrar(orden.NoOrden));  
      this.cargarInformacion(false);
    } catch (error) {
      console.error('Error al registrar el sobre:', error);
    }

  }


  async onCheckboxChange(detalleSobre: DetalleSobre) {
    const {aplica,id} = detalleSobre;    
    await firstValueFrom(this.sobreService.actualizarDetalle(id, aplica));  
  }

  estaEnAprobacion = computed(() => {
    if (this.ordenActual()===null) return false;
    return this.ordenActual()?.id_estado === "5"; 
  });

  estaPendiente= computed(() => {
    if (this.ordenActual()===null) return false;
    return this.ordenActual()?.id_estado === "1"; 
  });
  nombreTrabajo = computed(() => {
    if (this.ordenActual()===null) return '';
    return `${this.ordenActual()?.NoOrden}  - ${this.ordenActual()?.NombreTrabajo}`; 
  });


  solicitarAprobacion() {

  }

  guardarCambios(){
  }

  rechazar(){

  }
  aprobar(){  

  }


}
