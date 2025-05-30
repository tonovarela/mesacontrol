import { AfterViewInit, ChangeDetectionStrategy, Component, computed, inject, type OnInit, signal, ViewChild } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { TextWrapSettingsModel, templateCompiler } from '@syncfusion/ej2-angular-grids';
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
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit, AfterViewInit {


  public ordenesMetrics = signal<OrdenMetrics[]>([]);

  public ordenMetricsPorDefinir = signal<OrdenMetrics | null>(null);
  public router = inject(Router);
  public cargando = signal(false);

  public wrapSettings?: TextWrapSettingsModel;
  protected minusHeight = 0;
  private metricsService = inject(MetricsService);
  public stackChecklist: any[] = [];

  public catalogoTiposProductos = [
    { id: "AUTOPOP", value: "Autopops" },
    { id: "BOL", value: "Bolsas" },
    { id: "CAG", value: "Catálogos / Folletos" },
    { id: "CD"  , value: "Calendarios" },
    { id: "EMPL", value: "Empaque Plegadizo" },
    { id: "EST" , value: "Estuches" },
    { id: "ET"  , value: "Etiquetas" },
    { id: "FD"  , value: "Folder / Sobres" },
    { id: "LIB" , value: "Libretas / Agendas" },
    { id: "MA"  , value: "Dipticos / Tripticos" },
    { id: "VIN" , value: "Viniles / Floorgraphics" }
  ];



  @ViewChild("clientePruebaColor") public clientePruebaColor: any;
  @ViewChild("clienteDummyVestido") public clienteDummyVestido: any;
  @ViewChild("viajeroPruebaColor") public viajeroPruebaColor: any;
  @ViewChild("viajeroDummyBlanco") public viajeroDummyBlanco: any;
  @ViewChild("viajeroDummyVestido") public viajeroDummyVestido: any;
  @ViewChild("viajeroSobre") public viajeroSobre: any;


  constructor() {
    super();
  }


  puedeDefinirOrdenMetrics = computed(() => this.ordenMetricsPorDefinir() !== null);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stackChecklist = [{
        headerText: 'Liberación al cliente',
        columns: [
          { headerText: 'Prueba de color', width: 110, textAlign: 'Center', template: this.clientePruebaColor, templateFn: templateCompiler(this.clientePruebaColor) },
          { headerText: 'Dummy vestido', width: 110, textAlign: 'Center', template: this.clienteDummyVestido, templateFn: templateCompiler(this.clienteDummyVestido) },
        ],
      },
      {
        headerText: 'Liberación de sobre viajero',
        columns: [
          { headerText: 'Prueba de color', width: 100, textAlign: 'Center', template: this.viajeroPruebaColor, templateFn: templateCompiler(this.viajeroPruebaColor) },
          { headerText: 'Dummy blanco', width: 100, textAlign: 'Center', template: this.viajeroDummyBlanco, templateFn: templateCompiler(this.viajeroDummyBlanco) },
          { headerText: 'Dummy vestido', width: 100, textAlign: 'Center', template: this.viajeroDummyVestido, templateFn: templateCompiler(this.viajeroDummyVestido) },
          { headerText: 'Sobre viajero', width: 100, textAlign: 'Center', template: this.viajeroSobre, templateFn: templateCompiler(this.viajeroSobre) },
        ]
      }
      ];
    }, 100);



  }

  ngOnInit(): void {
    this.autoFitColumns = false;
    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();

  }
  actualizarTipoProd(tipo:string){
    this.ordenMetricsPorDefinir.update((ordenMetrics) => {      
      if (!ordenMetrics) {
        return null;
      }
      // Actualizar el tipo de producto en la ordenMetrics
      return {
        ...ordenMetrics,
        tipoProducto: tipo 
      };
    });

    console.log('Tipo seleccionado:', tipo);

  }

  onSelectOrder(ordenMetrics: OrdenMetrics | null) {
    if (!ordenMetrics) {
      return;
    }
    console.log('Orden Metrics seleccionada:', ordenMetrics);
    this.ordenMetricsPorDefinir.set(ordenMetrics);
  }

  async cargarInformacion() {
    this.cargando.set(true);
    try {
      const response = await firstValueFrom(this.metricsService.listar())
      this.ordenesMetrics.set(response.ordenes)
      this.wrapSettings = { wrapMode: 'Content' };
    }
    catch (error) {
      console.error('Error al cargar la información:', error);
    }
    finally {
      this.cargando.set(false);
    }

  }

  ir(ruta: string, ordenMetrics: OrdenMetrics) {
    //console.log(ordenMetrics);    

    //TODO: Revisar si el usuario tiene permisos para hacer la revision del checklist
    //TODO: Guardar en el estado la ordenMetrics     
    this.router.navigate([`/checklist/${ruta}`]);
  }


  cerrarOrdenMetricsPorDefinir() {
    this.ordenMetricsPorDefinir.set(null);
    //this.router.navigate(['/home']);
  }

  guardarOrdenMetricsPorDefinir() {
    console.log('Guardando ordenMetricsPorDefinir:', this.ordenMetricsPorDefinir());
    this.ordenMetricsPorDefinir.set(null);
  }



}
