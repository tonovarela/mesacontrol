import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '@app/pages/checklist/components/checklist-view/checklist-view.component';
import { Option } from '../../../interfaces/Option';
import { CheckListAnswered } from '@app/pages/checklist/interfaces/CheckListAnswered';

@Component({
  selector: 'app-sobre',
  imports: [ChecklistViewComponent],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SobreComponent { 

  checkList:Option[] = [ // Tus datos de opciones
    { id: 1, label: 'Plotter Preprensa' ,optional: false       , answer: null, comments: '', answered: false },
    { id: 2, label: 'Responsiva Cliente'  ,optional:false      , answer: null, comments: '', answered: false },
    { id: 3, label: 'Máscara de acabados (opc)',optional: true , answer: null, comments: '', answered: false },    
    { id: 4, label: 'Etiqueta de ID', optional: false          , answer: null, comments: '', answered: false },
  ];

  
    onSave(checkList: CheckListAnswered) {
      console.log('Guardando checklist:', checkList);
      // Aquí puedes agregar la lógica para guardar el checklist
    }
  
}
