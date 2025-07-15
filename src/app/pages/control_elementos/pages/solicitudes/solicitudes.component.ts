import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Estado, Solicitud } from '@app/interfaces/responses/SolicitudResponse';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SolicitudService } from '@app/services';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-solicitudes',
  imports: [SynfusionModule,CommonModule,FormsModule],
  templateUrl: './solicitudes.component.html',
  styleUrl: './solicitudes.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SolicitudesComponent extends BaseGridComponent implements OnInit {

  router = inject(Router);

  solicitudService = inject(SolicitudService);
  solicitudes = signal<Solicitud[]>([])
  estados = signal<Estado[]>([]);
  
  ngOnInit(): void {
    this.cargarSolicitudes();
    
    this.iniciarResizeGrid(0.39, true);
    this.autoFitColumns = true;
  }

  navigateToNueva() {
    this.router.navigate(['/control_elementos/nueva']);
  }

  async cargarSolicitudes() {
    const response = await firstValueFrom(this.solicitudService.listar());
    
    this.estados.set(response.estados);
    this.solicitudes.set(response.solicitudes);
  }



}
