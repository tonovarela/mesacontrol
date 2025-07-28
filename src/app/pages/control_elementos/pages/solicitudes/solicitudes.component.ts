import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal,computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseGridComponent } from '@app/abstract/BaseGrid.component';
import { Estado, Solicitud } from '@app/interfaces/responses/SolicitudResponse';
import { SynfusionModule } from '@app/lib/synfusion.module';
import { SolicitudService, UiService, UsuarioService } from '@app/services';
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
  usuarioService = inject(UsuarioService);
  uiService = inject(UiService);

  solicitudes = signal<any[]>([])
  estados = signal<Estado[]>([]);
  
  ngOnInit(): void {
    this.cargarSolicitudes();    
    this.iniciarResizeGrid(0.39, true);
    this.autoFitColumns = true;
    console.log(this.usuarioService.StatusSesion().usuario?.id_rol);
  }

  navigateToNueva() {
    this.router.navigate(['/control_elementos/nueva']);
  }

  async cargarSolicitudes() {
    const response = await firstValueFrom(this.solicitudService.listar());    
    //this.estados.set(response.estados);
    this.solicitudes.set(response.solicitudes);
  }


  async cambioEstado(solicitud: Solicitud,$event: any) {
    const {id_solicitud,id_checklist} = solicitud;  
    const id_usuario = this.usuarioService.StatusSesion().usuario?.id!;
    const id_estado = $event.target.value;
    try {
      await  firstValueFrom(this.solicitudService.cambiarEstado(id_solicitud, id_estado, `${id_usuario}`,id_checklist))
      this.uiService.mostrarAlertaSuccess("Mesa de Control",'Estado actualizado correctamente');
     
    }catch (responseError:any) {      
      this.uiService.mostrarAlertaError("Mesa de Control", responseError.error.message || 'Error al actualizar el estado de la solicitud');
    }finally {
      this.cargarSolicitudes();      
    }
  }

  esSolicitante = computed(()=>this.usuarioService.StatusSesion().usuario?.id_rol==="1")
  
 irDetalle(solicitud:any){
  const orden =   solicitud["NoOrden"]  ?? '';
  this.router.navigate([`/control_elementos/devolucion/${orden}`]);

 }


}
