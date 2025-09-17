import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { UsuarioService } from '@app/services';
import { environment } from '@environments/environment.development';

@Component({
  selector: 'asistente',
  imports: [CommonModule],
  templateUrl: './asistente.component.html',
  styleUrl: './asistente.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsistenteComponent { 

readonly idAsistente = environment.idAsistente;
  
  private usuarioService = inject(UsuarioService);
  usuario = computed(() => this.usuarioService.StatusSesion().usuario)

}
