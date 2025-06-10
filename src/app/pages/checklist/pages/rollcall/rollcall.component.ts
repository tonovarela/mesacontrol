import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChecklistViewComponent } from '../../components/checklist-view/checklist-view.component';
import { CheckListAnswered, CheckListDisplay } from '../../interfaces/CheckListAnswered';
import { CheckListService } from '@app/services/checklist.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rollcall',
  imports: [ChecklistViewComponent, CommonModule],
  templateUrl: './rollcall.component.html',
  styleUrl: './rollcall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RollcallComponent implements OnInit {

  private checkListService = inject(CheckListService);

  checkList = computed(() => this.checkListService.checkList());
  router = inject(Router);

  opMetrics = computed(() => `${this.checkListService.currentMetricsOP()?.NoOrden || ''}  ${this.checkListService.currentMetricsOP()?.NombreTrabajo || ''}`);
  isSaving = signal<boolean>(false);

  title = computed(() => {
    const detail = this.checkList();
    return detail ? `${detail.detail?.categoria} ${detail.detail?.tipoPrueba}` || 'Checklist' : 'Cargando...';
  });


  ngOnInit(): void {
    this.checkListService.loadChecklist();
    console.log('checkList cargando checklist');
    console.log(this.checkListService.checkList());
  }

  async onSave(checkList: CheckListAnswered) {
    this.isSaving.set(true);
    const { isRefused, optionsAnswered } = checkList;
    const checkListCurrent = this.checkListService.checkList()?.detail;
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
    await firstValueFrom(this.checkListService.saveChecklist({ orden: op_metrics, isRefused, optionsAprobed, optionsRejected, id_checklist }));
    this.checkListService.removeCheckList();
    this.isSaving.set(false);
    this.router.navigate(['/home']);




  }




}
