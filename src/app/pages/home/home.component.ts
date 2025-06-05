import {  ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService,UiService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TextWrapSettingsModel } from '@syncfusion/ej2-angular-grids';
import { DetailRowService } from '@syncfusion/ej2-angular-grids'
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { Router, RouterModule } from '@angular/router';
import { SearchMetricsComponent } from '@app/shared/search-metrics/search-metrics.component';


@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule, PrimeModule, FormsModule, SynfusionModule, AuditComponent, SearchMetricsComponent],
  templateUrl: './home.component.html',
  providers: [DetailRowService],
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit{


  protected minusHeight = 0;
  private metricsService = inject(MetricsService);
  private uiService = inject(UiService);
  private _ordenesMetrics = signal<OrdenMetrics[]>([]);

  public puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);  
  public ordenesMetrics = computed(() => this._ordenesMetrics());
  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);


  public router = inject(Router);
  public cargando = signal(false);
  public wrapSettings?: TextWrapSettingsModel;
  public stackChecklist: any[] = [];
  public catalogoTiposProductos = [
    { id: "AUTOPOP", value: "Autopops" },
    { id: "BOL", value: "Bolsas" },
    { id: "CAG", value: "Catálogos / Folletos" },
    { id: "CD", value: "Calendarios" },
    { id: "EMPL", value: "Empaque Plegadizo" },
    { id: "EST", value: "Estuches" },
    { id: "ET", value: "Etiquetas" },
    { id: "FD", value: "Folder / Sobres" },
    { id: "LIB", value: "Libretas / Agendas" },
    { id: "MA", value: "Dipticos / Tripticos" },
    { id: "VIN", value: "Viniles / Floorgraphics" }
  ];

  constructor() {
    super();
  }


  columnasAuditoria = [
    {
      titulo: 'Cliente',
      subtitulo: 'Prueba de color',
      ruta: '/cliente/prueba_color',
      color: 'text-orange-700',
      check: (data: any) => {
        if (!data.pruebaColor_checklist) {
          return false;
        }
        return data.id_checklist_actual === data.pruebaColor_checklist
      }
    },
    {
      titulo: 'Cliente',
      subtitulo: 'Dummy vestido',
      ruta: '/cliente/dummy_vestido',
      color: 'text-orange-700',
      check: (data: any) => {
        if (!data.clienteDummyVestido_checklist) {
          return false;
        }
        return data.id_checklist_actual === data.clienteDummyVestido_checklist
      }
    },
    {
      titulo: 'Sobre viajero',
      subtitulo: 'Prueba de color',
      ruta: '/viajero/prueba_color',
      color: 'text-pink-700',
      check: (data: any) => {
        if (!data.viajeroPruebaColor_checkList) {
          return false;
        }
        return data.id_checklist_actual === data.viajeroPruebaColor_checkList
      }
    },
    {
      titulo: 'Sobre viajero',
      subtitulo: 'Dummy blanco',
      ruta: '/viajero/dummy_blanco',
      color: 'text-pink-700',
      check: (data: any) => {
        if (!data.viajeroDummyBlanco_checkList) {
          return false;
        }
        return data.id_checklist_actual === data.viajeroDummyBlanco_checkList
      }
    },
    {
      titulo: 'Sobre viajero',
      subtitulo: 'Dummy vestido',
      ruta: '/viajero/dummy_vestido',
      color: 'text-pink-700',
      check: (data: any) => {
        if (!data.viajeroDummyVestido_checkList) {
          return false;
        }
        return data.id_checklist_actual === data.viajeroDummyVestido_checkList
      }
    },
    {
      titulo: 'Sobre viajero',
      subtitulo: 'Liberación',
      ruta: '/viajero/dummy_vestido',
      color: 'text-pink-700',
      check: (data: any) => {
        if (!data.viajeroLiberacion_checkList) {
          return false;
        }
        return data.id_checklist_actual === data.viajeroLiberacion_checkList
      }
    }
  ];
  
  esAuditHabilitado(data: any, col: any): boolean {
    
    return col.check(data);
  }


  ngOnInit(): void {
    this.autoFitColumns = false;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();
  }

  actualizarTipoProd(tipo: string) {
    this.ordenMetricsPorDefinir.update((ordenMetrics) => {
      if (!ordenMetrics) return null;
      return { ...ordenMetrics, TipoProd: tipo };
    });

  }


  onSelectOrder(ordenMetrics: OrdenMetrics | null) {
    if (!ordenMetrics) {
      return;
    }
    this.ordenMetricsPorDefinir.set(ordenMetrics);
  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      this._ordenesMetrics.set([]); // Limpiar la lista antes de cargar nuevos datos            
      const response = await firstValueFrom(this.metricsService.listar())            
      this._ordenesMetrics.set(response.ordenes)      
    }
    catch (error) {
      this.uiService.mostrarAlertaError('Error al cargar la información', 'No se pudo cargar la información de las órdenes de métricas. Por favor, inténtelo más tarde.');      
    }
    finally {
      this.cargando.set(false);
    }
  }

  ir(ruta: string, ordenMetrics: OrdenMetrics) {
    const {NoOrden,id_checklist_actual}= ordenMetrics
    console.log({NoOrden,id_checklist_actual});    
    //TODO: Revisar si el usuario tiene permisos para hacer la revision del checklist
    //TODO: Guardar en el estado la ordenMetrics         
    this.router.navigate([`/checklist/${ruta}`]);
  }

  cerrarOrdenMetricsPorDefinir() {
    this.ordenMetricsPorDefinir.set(null);
  }

  async guardarOrdenMetricsPorDefinir() {    
    const ordenMetrics = this.ordenMetricsPorDefinir();    
    await firstValueFrom(this.metricsService.agregarOrden(ordenMetrics!));
    this.cargarInformacion();
    this.ordenMetricsPorDefinir.set(null);
  }

}
