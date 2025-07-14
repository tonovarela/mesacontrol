import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { SynfusionModule } from '@app/lib/synfusion.module';

@Component({
  selector: 'app-solicitudes',
  imports: [SynfusionModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit {
  
  router = inject(Router);
  solicitudes = signal<any[]>( [
    {id: 1, nombre: 'Solicitud 1', estado: 'Pendiente'},
    {id: 2, nombre: 'Solicitud 2', estado: 'Aprobada'},
    {id: 3, nombre: 'Solicitud 3', estado: 'Rechazada'},
    {id: 4, nombre: 'Solicitud 4', estado: 'Pendiente'},    
  ]);

  ngOnInit(): void {
    this.iniciarResizeGrid(0.39,true);
  } 

  navigateToNueva(){
    this.router.navigate(['/control_elementos/nueva']);
  }



}
