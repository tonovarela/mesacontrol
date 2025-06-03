import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChecklistViewComponent } from '../../../components/checklist-view/checklist-view.component';

import { Option } from '../../../interfaces/Option';
import { CheckListAnswered } from '../../../interfaces/CheckListAnswered';
@Component({
  selector: 'app-dummy-vestido',
  imports: [ChecklistViewComponent],
  templateUrl: './dummy_vestido.component.html',
  styleUrl: './dummy_vestido.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export  default class DummyVestidoComponent {

  checkList:Option[] = [ // Tus datos de opciones
    { id: 1, label: 'Dummy Vestino 1', optional: false , answered: true, answer: 1, comments: ''},
    { id: 2, label: 'Dummy Vestino 2', optional: false , answered: false, answer: null, comments: ''},
    { id: 3, label: 'Dummy Vestino 3', optional: false , answered: false, answer: null, comments: ''},
    { id: 4, label: 'Dummy Vestino 4', optional: false , answered: false, answer: null, comments: ''},
    { id: 5, label: 'Dummy Vestino 5', optional: true  , answered: false, answer: null, comments: ''},
  ];

  onSave(checkList: CheckListAnswered) {
    console.log('Guardando checklist:', checkList);
    // Aquí puedes agregar la lógica para guardar el checklist
  }
 }
