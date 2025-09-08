import { ChangeDetectionStrategy, Component, computed, inject, OnInit, output, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ChecklistViewComponent } from '../../components/checklist-view/checklist-view.component';
import { CheckListAnswered } from '../../interfaces/CheckListAnswered';
import { CheckListService, MetricsService, PageService, PdfService } from '@app/services';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '@app/services/usuario.service';
import { OrdenMetrics } from '../../../../interfaces/responses/ResponseOrdenMetrics';


@Component({
  selector: 'app-rollcall',
  imports: [ChecklistViewComponent, CommonModule],
  templateUrl: './rollcall.component.html',
  styleUrl: './rollcall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RollcallComponent implements OnInit {

  public pageService = inject(PageService)
  private usuarioService = inject(UsuarioService);
  private pdfService = inject(PdfService);
  onClose =output<void>();

  ngOnInit(): void {            
  }
  private checkListService = inject(CheckListService);  
  checkList = computed(() => this.checkListService.checkList());  
  opMetrics = computed(() => `${this.checkListService.currentMetricsOP()?.NoOrden || ''}  ${this.checkListService.currentMetricsOP()?.NombreTrabajo || ''}`);
  isSaving = signal<boolean>(false);

  title = computed(() => {
    const detail = this.checkListService.checkList();
    return detail ? `${detail.detail?.categoria} ${detail.detail?.tipoPrueba}` || 'Checklist' : 'Cargando...';
  });



  

  async onSave(checkList: CheckListAnswered) {
    this.isSaving.set(true);
    const { optionsAnswered } = checkList;
    const checkListCurrent = this.checkList()?.detail;
    const { id_checklist, op_metrics } = checkListCurrent!;

    const optionsAprobed = optionsAnswered.filter(o => o.answer != 2).map(options => {
      return {
        id_checklist,
        id: options.id,
        answer: options.answer,
      }
    });
    const optionsRejected = optionsAnswered.filter(o => o.answer == 2).map(options => {
      return {
        id_checklist,
        id: options.id,
        comments: options.comments,
      }
    });
    this.checkListService.id_checkListCurrent = id_checklist;
    const idUsuario = this.usuarioService.StatusSesion()?.usuario?.id || '71';
    
   const response= await firstValueFrom(this.checkListService.saveChecklist({
      orden: op_metrics,
      optionsAprobed,
      optionsRejected,
      id_checklist,
      id_usuario: `${idUsuario}`
        }));
        const { termino,orden } = response as any;
              
    this.checkListService.removeActiveCheckList();
    this.isSaving.set(false);
    this.onClose.emit();
    //this.router.navigate([this.pageService.getPreviousUrl()]);

  }


  close(){
    this.checkListService.removeActiveCheckList();
    this.onClose.emit();
    
  }

}
