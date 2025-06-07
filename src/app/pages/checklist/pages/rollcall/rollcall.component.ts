import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ChecklistViewComponent } from '../../components/checklist-view/checklist-view.component';
import { CheckListAnswered, CheckListDisplay } from '../../interfaces/CheckListAnswered';
import { CheckListService } from '@app/services/checklist.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-rollcall',
  imports: [ChecklistViewComponent, CommonModule],
  templateUrl: './rollcall.component.html',
  styleUrl: './rollcall.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RollcallComponent implements OnInit {

  private checkListService = inject(CheckListService); 

  checkList = computed(() => this.checkListService._checkList());

  opMetrics = computed(() => this.checkListService.op_metrics);

  title = computed(() => {
    const detail = this.checkList();
    return detail ? `${detail.detail?.categoria} ${detail.detail?.tipoPrueba}` || 'Checklist' : 'Cargando...';
  });


  ngOnInit(): void {
    this.checkListService.loadChecklist();
  }

  async onSave(checkList: CheckListAnswered) {
    const {isRefused,optionsAnswered} = checkList;
    const checkListCurrent = this.checkListService._checkList()?.detail;
    const {id_checklist,op_metrics} = checkListCurrent! ;
    
    const optionsAprobed=optionsAnswered.filter(o=>o.answer!=2).map(options=>{
      return {
        id_checklist,
        id:options.id,
        answer: options.answer,    
      }
    });
    const optionsRejected=optionsAnswered.filter(o=>o.answer==2).map(options=>{
      return {
        id_checklist,
        id:options.id,        
        comments: options.comments ,
      }
    });    
    this.checkListService.id_checkListCurrent = id_checklist;
     const response=await firstValueFrom(this.checkListService.saveChecklist({orden: op_metrics,isRefused,optionsAprobed,optionsRejected, id_checklist}));
     this.checkListService.removeCheckList();              
     //console.log(response);
    


  }




}
