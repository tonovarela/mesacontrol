import { AfterViewInit, ChangeDetectionStrategy, Component, inject, type OnInit, signal, ViewChild } from '@angular/core';
import { PrimeModule } from '../../lib/prime.module';
import { FormsModule } from '@angular/forms';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { OrdenMetrics } from '@app/interfaces/responses/ResponseOrdenMetrics';
import { MetricsService } from '@app/services';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import {  ColumnModel, GroupService, TextWrapSettingsModel,templateCompiler } from '@syncfusion/ej2-angular-grids';
import { DetailRowService } from '@syncfusion/ej2-angular-grids'
import { AuditComponent } from '@app/shared/svg/audit/audit.component';
import { Router, RouterModule } from '@angular/router';
import { DetailsComponent } from '@app/shared/svg/details/details.component';





@Component({
  selector: 'app-home',
  imports: [RouterModule,CommonModule,PrimeModule, FormsModule, SynfusionModule,AuditComponent,DetailsComponent,],
  templateUrl: './home.component.html',
  providers: [DetailRowService,GroupService],
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class HomeComponent extends BaseGridComponent implements OnInit,AfterViewInit {



  


  ordenesMetrics = signal<OrdenMetrics[]>([]);  
  router = inject(Router);
  cargando = signal(false);

  public wrapSettings?: TextWrapSettingsModel;
  protected minusHeight = 0;
  private metricsService = inject(MetricsService);
  public stackChecklist: any[] = [];
  @ViewChild('stackedColTemplate') public colTemplate: any; 
  constructor() {
    super();
  }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stackChecklist=[{
        headerText: 'Entrega al cliente',                      
        columns:[
        { headerText: 'Prueba de color',width: 100, textAlign: 'Center',template:this.colTemplate, templateFn: templateCompiler(this.colTemplate)},
        { headerText: 'Dummy blanco', width: 150, textAlign: 'Center',template:this.colTemplate,templateFn: templateCompiler(this.colTemplate)},
        { headerText: 'Dummy vestido', width: 150, textAlign: 'Center' ,template:this.colTemplate,templateFn: templateCompiler(this.colTemplate)},
        ],        
      },
      {headerText:'Seccion 2',      
        columns:[
        { headerText: 'Prueba de color',width: 100, textAlign: 'Center',template:this.colTemplate, templateFn: templateCompiler(this.colTemplate)},
        { headerText: 'Dummy blanco', width: 150, textAlign: 'Center',template:this.colTemplate,templateFn: templateCompiler(this.colTemplate)},
        { headerText: 'Dummy vestido', width: 150, textAlign: 'Center' ,template:this.colTemplate,templateFn: templateCompiler(this.colTemplate)},
      ]}
      ];
    },100);
    
    
    
  }


  ngOnInit(): void {
    this.autoFitColumns = false;
   
    
    
    

    this.iniciarResizeGrid(this.minusHeight);
    this.cargarInformacion();

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

  ir(ruta:string,ordenMetrics:OrdenMetrics){    
    console.log(ordenMetrics);
    
    //TODO: Revisar si el usuario tiene permisos para hacer la revision del checklist
    //TODO: Guardar en el estado la ordenMetrics 
    
    this.router.navigate([`/checklist/${ruta}`]);
  }




}
